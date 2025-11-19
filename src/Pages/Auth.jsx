// src/Pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin((s) => !s);

  const handleSubmit = (e) => {
    e.preventDefault();
    // === FAKE AUTH (placeholder) ===
    // Simulate login/signup success by writing a simple token to localStorage
    // In a real app you'll call your backend here and store a proper token
    const fakeToken = "fake-photolab-token-123";
    localStorage.setItem("photolab_token", fakeToken);

    // Optionally store a small "user" object
    localStorage.setItem(
      "photolab_user",
      JSON.stringify({ name: "Demo User", email: "demo@photolab.local" })
    );

    // Redirect to booking page after "login"
    navigate("/booking");
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
              <p>
                {isLogin
                  ? "Sign in to access your PhotoLab account"
                  : "Join PhotoLab and start capturing moments"}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="Enter your full name" required={!isLogin} />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" id="confirmPassword" placeholder="Confirm your password" required={!isLogin} />
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

              <button type="submit" className="auth-submit-btn">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="auth-divider"><span>OR</span></div>

            <div className="social-auth">
              <button className="social-btn google-btn">Continue with Google</button>
              <button className="social-btn facebook-btn">Continue with Facebook</button>
            </div>

            <div className="auth-toggle">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={toggleForm} className="toggle-btn">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
