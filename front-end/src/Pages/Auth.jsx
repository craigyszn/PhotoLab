// src/Pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = (e) => {
    e?.preventDefault();
    setIsLogin((s) => !s);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const firstName = form.firstName?.value?.trim() || "";
    const lastName = form.lastName?.value?.trim() || "";
    const email = form.email.value?.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword?.value || "";

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${API}/customers/login`, { email, password });
        const user = res.data;
        localStorage.setItem("photolab_token", "demo-token");
        localStorage.setItem("photolab_user", JSON.stringify(user));
        navigate("/booking");
      } else {
        const payload = { firstName, lastName, email, password };
        const res = await axios.post(`${API}/customers/register`, payload);
        const created = res.data;
        localStorage.setItem("photolab_token", "demo-token");
        localStorage.setItem("photolab_user", JSON.stringify(created));
        navigate("/booking");
      }
    } catch (err) {
      console.error(err);
      const message = err?.response?.data || err?.message || "Request failed";
      alert("Error: " + message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-overlay">
            <div className="auth-brand">
              <h1>PhotoLab</h1>
              <p>Capture Your Moments, Create Your Memories</p>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p>{isLogin ? "Sign in to access your PhotoLab account" : "Join PhotoLab and start capturing moments"}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-row signup-names">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input name="firstName" type="text" id="firstName" placeholder="Enter first name" required={!isLogin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input name="lastName" type="text" id="lastName" placeholder="Enter last name" required={!isLogin} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input name="email" type="email" id="email" placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input name="password" type="password" id="password" placeholder="Enter your password" required />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input name="confirmPassword" type="password" id="confirmPassword" placeholder="Confirm your password" required={!isLogin} />
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn">{isLogin ? "Sign In" : "Create Account"}</button>
            </form>

            <div className="auth-divider"><span>OR</span></div>

            <div className="social-auth">
              <button className="social-btn google-btn">Continue with Google</button>
              <button className="social-btn facebook-btn">Continue with Facebook</button>
            </div>

            <div className="auth-toggle">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleForm} className="toggle-btn">{isLogin ? "Sign Up" : "Sign In"}</button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
