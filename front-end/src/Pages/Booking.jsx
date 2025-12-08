// src/Pages/Booking.jsx  (or src/sections/Booking.jsx)
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

  // redirect if not logged in & scroll to form
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validations
    if (!formData.serviceType) {
      alert("Please choose a service first.");
      return;
    }
    if (!formData.date || !formData.time) {
      alert("Please pick a date and time.");
      return;
    }

    // 1) get logged-in user from localStorage
    const rawUser = localStorage.getItem("photolab_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const customerId = user?.customerId;

    if (!customerId) {
      alert("You must be logged in to book.");
      navigate("/auth");
      return;
    }

    // 2) map service type -> event_id in DB
    let eventId = serviceToEventId[formData.serviceType];

    if (!eventId) {
      alert("Selected service is not linked to an event. Please contact admin.");
      return;
    }

    // 3) payload for backend booking
    const bookingPayload = {
      bookingDate: formData.date,
      status: "PENDING",
      totalPrice: 5000.0, // TODO: calculate based on service/duration if needed
      packageType: formData.serviceType,
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `${API}/bookings?customerId=${customerId}&eventId=${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      // optional: keep a local history as before
      const localBookings = JSON.parse(
        localStorage.getItem("photolab_bookings") || "[]"
      );
      localBookings.push({
        id: savedBooking.bookingId,
        ...formData,
        backendBooking: savedBooking,
      });
      localStorage.setItem("photolab_bookings", JSON.stringify(localBookings));

      // go to confirmation page
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

      {/* Main Content */}
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
            <section className="booking-section">
              <h2 className="section-title">Choose Date & Time</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Session Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="booking-section">
              <h2 className="section-title">Location Details</h2>
              <div className="form-group">
                <label htmlFor="location">Session Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Enter the address or venue"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            <section className="booking-section">
              <h2 className="section-title">Your Information</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+63 XXX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="booking-section">
              <h2 className="section-title">Additional Details</h2>
              <div className="form-group">
                <label htmlFor="specialRequests">
                  Special Requests or Notes
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="4"
                  placeholder="Tell us about your vision..."
                  value={formData.specialRequests}
                  onChange={handleChange}
                />
              </div>
            </section>

            <div className="booking-summary">
              <div className="summary-card">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span className="summary-label">Service:</span>
                  <span className="summary-value">
                    {formData.serviceType
                      ? services.find((s) => s.id === formData.serviceType)
                          ?.name
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

            <button
              type="submit"
              className="submit-booking-btn"
              disabled={submitting}
            >
              {submitting ? "SAVING..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
