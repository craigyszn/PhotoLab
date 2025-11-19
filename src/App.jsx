import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import BookingPage from "./Pages/Booking"; // adjust import path if needed

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
