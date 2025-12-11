import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import BookingPage from "./Pages/Booking";
import BookingConfirmation from "./Pages/BookingConfirmation";
import Portfolio from "./Pages/Portfolio";
import Gallery from "./Pages/Gallery";
import Admin from "./Pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/admin" element={<Admin />} /> {/* <-- new */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}