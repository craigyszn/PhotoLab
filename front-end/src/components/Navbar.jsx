// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const readUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("photolab_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(readUserFromStorage());
    const handleUserChange = () => setUser(readUserFromStorage());
    window.addEventListener("storage", handleUserChange);
    window.addEventListener("user-changed", handleUserChange);
    return () => {
      window.removeEventListener("storage", handleUserChange);
      window.removeEventListener("user-changed", handleUserChange);
    };
  }, []);

  const doLogout = () => {
    localStorage.removeItem("photolab_user");
    localStorage.removeItem("photolab_token");
    setUser(null);
    window.dispatchEvent(new Event("user-changed"));
    setShowLogoutModal(false);
    navigate("/");
  };

  const onLogoutClick = () => setShowLogoutModal(true);
  const closeModal = () => setShowLogoutModal(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <span className="logo-box">
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                  PhotoLab
                </Link>
              </span>
            </div>

            <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
              <a href="#how" className="navbar-link">How it Works</a>
              <Link to="/portfolio" className="navbar-link">Portfolio</Link>
              <a href="#pricing" className="navbar-link">Pricing</a>
              <a href="#qa" className="navbar-link">Q&A</a>

              <div className="navbar-buttons-group">
                {!user && (
                  <Link to="/auth">
                    <button className="navbar-button">Login</button>
                  </Link>
                )}

                {user && (
                  <>
                    <Link to="/booking">
                      <button className="navbar-button">Book Now</button>
                    </Link>

                    <button className="navbar-button" onClick={onLogoutClick}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="modal-card">
            <h3 id="logout-title">Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>

            <div className="modal-actions">
              <button className="modal-btn cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="modal-btn confirm-btn" onClick={doLogout} autoFocus>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;