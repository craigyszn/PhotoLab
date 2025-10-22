import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h1>PhotoLab</h1>
      </div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/gallery">Portfolio</Link>
        <div className="navbar-dropdown">
          <Link to="/booking" className="dropdown-toggle">
            Packages
            <span className="dropdown-arrow">▼</span>
          </Link>
        </div>
      </nav>
      <div className="navbar-auth">
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/register" className="btn-register">Register</Link>
      </div>
    </header>
  );
}