// src/Pages/Booking.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// map frontend serviceType -> backend event_id
const serviceToEventId = {
  portrait: 2,
  event: 3,
  product: 4,
  branding: 5,
  editorial: 6,
  custom: 7,
};

const BookingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("photolab_token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const t = setTimeout(() => {
      const el = document.getElementById("booking-form-anchor");
      if (el) {
        const rect = el.getBoundingClientRect();
        const offset = 20;
        window.scrollTo({
          top: window.scrollY + rect.top - offset,
          behavior: "smooth",
        });
      }
    }, 120);

    return () => clearTimeout(t);
  }, [navigate]);

  const [formData, setFormData] = useState({
    serviceType: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const services = [
    { id: "portrait", name: "Portrait Photography", icon: "📸" },
    { id: "event", name: "Event Coverage", icon: "🎉" },
    { id: "product", name: "Product Shoots", icon: "📦" },
    { id: "branding", name: "Branding Sessions", icon: "✨" },
    { id: "editorial", name: "Editorial Photography", icon: "📰" },
    { id: "custom", name: "Custom Projects", icon: "🎨" },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const durations = ["1 Hour", "2 Hours", "3 Hours", "4 Hours", "Full Day"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleServiceSelect = (serviceId) => {
    setFormData((s) => ({ ...s, serviceType: serviceId }));
  };

  // helper: create CSV content from an object (basic CSV)
  const toCsv = (obj) => {
    // header order
    const keys = [
      "bookingId",
      "serviceType",
      "date",
      "time",
      "duration",
      "location",
      "name",
      "email",
      "phone",
      "specialRequests",
      "createdAt",
    ];
    // single row
    const header = keys.join(",");
    const row = keys
      .map((k) => {
        const val = obj[k] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",");
    return header + "\n" + row + "\n";
  };

  // try POSTing CSV to either API base or fallback without /api
  const uploadCsvToServer = async (csvString, filename) => {
    const token = localStorage.getItem("photolab_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // candidates to try (first is API as configured, second is same host but without /api)
    const removeApiSuffix = (url) => (url ? url.replace(/\/api\/?$/, "") : url);
    const candidates = [`${API}/exports/bookings`, `${removeApiSuffix(API)}/exports/bookings`].filter(Boolean);

    for (let url of candidates) {
      try {
        const form = new FormData();
        form.append("file", new Blob([csvString], { type: "text/csv;charset=utf-8;" }), filename);
        form.append("filename", filename);

        const res = await fetch(url, {
          method: "POST",
          headers,
          body: form,
        });

        const text = await res.text().catch(() => null);
        if (res.ok) {
          console.log("CSV uploaded successfully to", url);
          return { ok: true, url };
        } else {
          console.warn("CSV upload to", url, "failed:", res.status, text);
          // if 404 maybe this base doesn't exist; try next candidate
        }
      } catch (err) {
        console.error("CSV upload error to", url, err);
        // try next
      }
    }

    return { ok: false, error: "All upload attempts failed" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceType) {
      alert("Please choose a service first.");
      return;
    }
    if (!formData.date || !formData.time) {
      alert("Please pick a date and time.");
      return;
    }

    const rawUser = localStorage.getItem("photolab_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const customerId = user?.customerId;

    if (!customerId) {
      alert("You must be logged in to book.");
      navigate("/auth");
      return;
    }

    let eventId = serviceToEventId[formData.serviceType];
    if (!eventId) {
      alert("Selected service is not linked to an event. Please contact admin.");
      return;
    }

    const bookingPayload = {
      bookingDate: formData.date,
      status: "PENDING",
      totalPrice: 5000.0,
      packageType: formData.serviceType,
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `${API}/bookings?customerId=${customerId}&eventId=${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(localStorage.getItem("photolab_token") ? { Authorization: `Bearer ${localStorage.getItem("photolab_token")}` } : {}) },
          body: JSON.stringify(bookingPayload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Booking failed:", text);
        alert("Failed to create booking. Please try again.");
        setSubmitting(false);
        return;
      }

      const savedBooking = await res.json();

      // Save a local copy for convenience
      const localBookings = JSON.parse(
        localStorage.getItem("photolab_bookings") || "[]"
      );
      localBookings.push({
        id: savedBooking.bookingId,
        ...formData,
        backendBooking: savedBooking,
      });
      localStorage.setItem("photolab_bookings", JSON.stringify(localBookings));

      // create a CSV row with more detailed front-end data
      const csvObj = {
        bookingId: savedBooking.bookingId,
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        location: formData.location,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests,
        createdAt: new Date().toISOString(),
      };

      const csvString = toCsv(csvObj);
      const filename = `booking_${savedBooking.bookingId}.csv`;

      // upload CSV to server (best-effort)
      const uploadResult = await uploadCsvToServer(csvString, filename);
      if (!uploadResult.ok) {
        console.warn("Upload CSV failed:", uploadResult);
      }

      // navigate to confirmation
      navigate("/booking-confirmation", {
        state: { bookingData: formData, backendBooking: savedBooking },
      });
    } catch (err) {
      console.error("Booking fetch error:", err);
      alert("Network error while saving your booking: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-header">
        <div className="booking-header-content">
          <h1>Ready to Create Something Beautiful?</h1>
          <p>Let's bring your vision to life through photography</p>
          <button
            className="hero-cta"
            onClick={() => {
              const el = document.getElementById("booking-form-anchor");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            Book Your Session Today
          </button>
        </div>
      </div>

      {/* Main Content (form unchanged) */}
      <div className="booking-content">
        <div className="booking-container">
          <div id="booking-form-anchor" />

          {/* Service Selection */}
          <section className="booking-section">
            <h2 className="section-title">Select Your Service</h2>
            <div className="service-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleServiceSelect(service.id);
                  }}
                  className={`service-card ${
                    formData.serviceType === service.id ? "selected" : ""
                  }`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <p className="service-name">{service.name}</p>
                  {formData.serviceType === service.id && (
                    <div className="check-mark">✓</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Booking Form */}
          <form className="booking-form" onSubmit={handleSubmit}>
            {/* -- form fields (same as before) -- */}
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <select name="time" value={formData.time} onChange={handleChange}>
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Studio / Address"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+63..."
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  name="specialRequests"
                  placeholder="Notes for the photographer..."
                  value={formData.specialRequests}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="booking-summary">
              <div className="summary-card">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span className="summary-label">Service:</span>
                  <span className="summary-value">
                    {formData.serviceType
                      ? services.find((s) => s.id === formData.serviceType)?.name
                      : "Not selected"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">
                    {formData.date || "Not selected"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time:</span>
                  <span className="summary-value">
                    {formData.time || "Not selected"}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Duration:</span>
                  <span className="summary-value">
                    {formData.duration || "Not selected"}
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-booking-btn" disabled={submitting}>
              {submitting ? "SAVING..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
