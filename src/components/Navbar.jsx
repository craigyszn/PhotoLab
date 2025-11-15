import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <span className="logo-box">PhotoLab</span>
          </div>
          
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#how" className="navbar-link">How it Works</a>
            <a href="#portfolio" className="navbar-link">Portfolio</a>
            <a href="#pricing" className="navbar-link">Pricing</a>
            <a href="#qa" className="navbar-link">Q&A</a>
            <button className="navbar-button">Book Now</button>
          </div>

          <button className="navbar-toggle" onClick={toggleMenu}>
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;