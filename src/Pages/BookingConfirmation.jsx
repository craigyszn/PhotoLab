import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  const services = [
    { id: 'portrait', name: 'Portrait Photography', icon: '📸' },
    { id: 'event', name: 'Event Coverage', icon: '🎉' },
    { id: 'product', name: 'Product Shoots', icon: '📦' },
    { id: 'branding', name: 'Branding Sessions', icon: '✨' },
    { id: 'editorial', name: 'Editorial Photography', icon: '📰' },
    { id: 'custom', name: 'Custom Projects', icon: '🎨' }
  ];

  // Generate booking reference number
  const bookingRef = `PL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Get service details
  const selectedService = services.find(s => s.id === bookingData?.serviceType);

  if (!bookingData) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="no-booking">
            <h2>No Booking Found</h2>
            <p>Please make a booking first.</p>
            <button onClick={() => navigate('/booking')} className="back-btn">
              Go to Booking Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      {/* Success Header */}
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Thank you for choosing PhotoLab. We're excited to capture your special moments!</p>
      </div>

      {/* Main Content */}
      <div className="confirmation-content">
        <div className="confirmation-container">
          
          {/* Booking Reference */}
          <div className="reference-card">
            <div className="reference-label">Booking Reference Number</div>
            <div className="reference-number">{bookingRef}</div>
            <p className="reference-note">Please save this reference number for your records</p>
          </div>

          {/* Booking Details Grid */}
          <div className="details-grid">
            
            {/* Service Details */}
            <div className="detail-card">
              <div className="card-icon">{selectedService?.icon}</div>
              <h3>Service Type</h3>
              <p className="detail-value">{selectedService?.name || 'N/A'}</p>
            </div>

            {/* Date Details */}
            <div className="detail-card">
              <div className="card-icon">📅</div>
              <h3>Date</h3>
              <p className="detail-value">{bookingData.date || 'N/A'}</p>
            </div>

            {/* Time Details */}
            <div className="detail-card">
              <div className="card-icon">🕐</div>
              <h3>Time</h3>
              <p className="detail-value">{bookingData.time || 'N/A'}</p>
            </div>

            {/* Duration Details */}
            <div className="detail-card">
              <div className="card-icon">⏱️</div>
              <h3>Duration</h3>
              <p className="detail-value">{bookingData.duration || 'N/A'}</p>
            </div>

            {/* Location Details */}
            <div className="detail-card full-width">
              <div className="card-icon">📍</div>
              <h3>Location</h3>
              <p className="detail-value">{bookingData.location || 'N/A'}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="info-section">
            <h2>Your Contact Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Full Name</div>
                <div className="info-value">{bookingData.name || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Email Address</div>
                <div className="info-value">{bookingData.email || 'N/A'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Phone Number</div>
                <div className="info-value">{bookingData.phone || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {bookingData.specialRequests && (
            <div className="info-section">
              <h2>Special Requests</h2>
              <div className="special-requests-box">
                <p>{bookingData.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="next-steps">
            <h2>What Happens Next?</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4>Confirmation Email</h4>
                <p>You'll receive a confirmation email shortly with all the details</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h4>Photographer Assigned</h4>
                <p>We'll assign a photographer and contact you within 24 hours</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h4>Pre-Session Consultation</h4>
                <p>Our team will reach out to discuss your vision and requirements</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h4>Session Day</h4>
                <p>Enjoy your photography session and let us capture your moments</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => window.print()} className="print-btn">
              🖨️ Print Confirmation
            </button>
            <button onClick={() => navigate('/')} className="home-btn">
              🏠 Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;