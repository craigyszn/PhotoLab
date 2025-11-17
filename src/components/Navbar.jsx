// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <span className="logo-box">PhotoLab</span>
          </div>

          <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
            {/* internal page anchors (keep as anchors so they scroll on Home) */}
            <a href="#how" className="navbar-link" onClick={handleLinkClick}>
              How it Works
            </a>
            <a href="#portfolio" className="navbar-link" onClick={handleLinkClick}>
              Portfolio
            </a>
            <a href="#pricing" className="navbar-link" onClick={handleLinkClick}>
              Pricing
            </a>
            <a href="#qa" className="navbar-link" onClick={handleLinkClick}>
              Q&A
            </a>

            {/* SPA navigation to /auth using Link */}
            <Link to="/auth" className="navbar-button" onClick={handleLinkClick}>
              Book Now
            </Link>
          </div>

          <button
            className="navbar-toggle"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
