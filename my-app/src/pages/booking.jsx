import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./booking.css";

export default function Booking() {
  const [form, setForm] = useState({ serviceId: "", date: "", time: "", notes: "" });
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then(r => setServices(r.data)).catch(() => {});
  }, []);

  function submit(e) {
    e.preventDefault();
    api.post("/bookings", form)
      .then(() => alert("Booking sent — you will receive a confirmation."))
      .catch(() => alert("Booking failed"));
  }

  return (
    <div className="booking-card">
      <h1>Book an Event</h1>
      <form onSubmit={submit}>
        <label>Package</label>
        <select required value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
          <option value="">Select package</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.title} — ${s.price}</option>)}
        </select>

        <div className="booking-row">
          <div>
            <label>Date</label>
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label>Time</label>
            <input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>
        </div>

        <label>Notes</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows="4" />

        <button type="submit">Request Booking</button>
      </form>
    </div>
  );
}