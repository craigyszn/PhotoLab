import React from "react";
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="how-container">
      <h2 className="section-title">How it Works</h2>

      {/* Row 1 */}
      <div className="how-grid">
        <div className="how-card how-step">
          <div className="step-number">Step 1</div>
          <h4 className="step-title">Book your Session!</h4>
          <p className="step-desc">Pick a date and choose a package that fits you.</p>
        </div>

        <div className="how-card how-visual">
          <div className="card-title">Package Deals</div>

          {/* mini package previews */}
          <div className="mini-packages">
            <div className="mini-card">
              <div className="mini-title">Solo</div>
              <div className="mini-price">₱500</div>
            </div>

            <div className="mini-card">
              <div className="mini-title">Family</div>
              <div className="mini-price">₱1000</div>
            </div>

            <div className="mini-card">
              <div className="mini-title">Custom</div>
              <div className="mini-price">Flexible</div>
            </div>
          </div>

          <div className="arrow" aria-hidden="true">➜</div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="how-grid reverse">
        <div className="how-card how-visual">
          <div className="card-title">What to Expect</div>
          <p className="card-text">
            We'll confirm logistics (time, location), send prep tips, and make sure everything is ready
            so your session runs smoothly. You’ll get post-session options for prints and digital delivery.
          </p>
        </div>

        <div className="how-card how-step">
          <div className="step-number">Step 2</div>
          <h4 className="step-title">Show up &amp; enjoy</h4>
          <p className="step-desc">Our team handles lighting and composition — you focus on the moment.</p>
        </div>
      </div>
    </div>
  );
}
