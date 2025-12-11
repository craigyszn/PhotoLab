// src/sections/Gallery.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gallery.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const Gallery = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const readUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("photolab_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = readUserFromStorage();
    if (!user) {
      navigate("/auth");
      return;
    }

    const token = localStorage.getItem("photolab_token") || null;

    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Backend exposes GET /api/galleries?customerId=<id>
        const customerId = user.customerId || user.id || user.customer_id || null;
        const res = await axios.get(`${API}/galleries${customerId ? `?customerId=${customerId}` : ""}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const rows = Array.isArray(res.data) ? res.data : [];
        // group rows by bookingId to make sessions
        const sessionsMap = {};
        rows.forEach((r) => {
          const bid = r.booking?.bookingId || r.booking?.booking_id;
          if (!bid) return;
          if (!sessionsMap[bid]) {
            sessionsMap[bid] = {
              id: bid,
              sessionName: r.booking?.packageType || `Booking ${bid}`,
              customerName: `${r.booking?.customer?.firstName || ""} ${r.booking?.customer?.lastName || ""}`.trim(),
              photographerName: r.photographer ? (r.photographer.name || r.photographer?.firstName || "") : "",
              eventDate: r.booking?.bookingDate || r.booking?.event?.eventDate || "",
              uploadDate: r.uploadDate,
              photos: []
            };
          }
          sessionsMap[bid].photos.push({
            id: r.galleryId,
            url: r.photoUrl,
            caption: r.photoDescription
          });
        });

        const sessionsArr = Object.values(sessionsMap);
        setSessions(sessionsArr);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch galleries:", err);
        setError("Failed to load galleries from server.");
        setLoading(false);
      }
    };

    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const openLightbox = (photo) => setLightboxImage(photo);
  const closeLightbox = () => setLightboxImage(null);

  if (loading) return <div className="empty-state">Loading galleries…</div>;
  if (error) return <div className="empty-state">{error}</div>;
  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No galleries found</h3>
        <p>Your gallery will appear here after a photographer uploads photos for your booking.</p>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="gallery-header-content">
          <h1>Your Photo Gallery</h1>
          <p>View and download your memories captured by our photographers</p>
        </div>
      </div>

      <div className="gallery-content">
        <div className="gallery-container">
          {!selectedSession ? (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-cover" onClick={() => setSelectedSession(session)}>
                    <img
                      src={session.photos[0]?.url || "/placeholder.jpg"}
                      alt={session.sessionName}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="session-overlay">
                      <button className="view-btn">View Gallery</button>
                    </div>
                  </div>

                  <div className="session-info">
                    <h3 className="session-title">{session.sessionName}</h3>

                    <div className="session-meta">
                      <div className="meta-item"><span className="meta-icon">👤</span><span className="meta-text">{session.customerName}</span></div>
                      <div className="meta-item"><span className="meta-icon">📸</span><span className="meta-text">{session.photographerName}</span></div>
                      <div className="meta-item"><span className="meta-icon">📅</span><span className="meta-text">{session.eventDate}</span></div>
                      <div className="meta-item"><span className="meta-icon">🖼️</span><span className="meta-text">{session.photos.length} photos</span></div>
                    </div>

                    <div className="session-actions">
                      <button className="download-all-btn" onClick={() => alert("Download all not yet implemented")}>⬇️ Download All</button>
                      <button className="view-gallery-btn" onClick={() => setSelectedSession(session)}>View Gallery →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="session-detail">
              <div className="session-detail-header">
                <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to All Sessions</button>

                <div className="session-detail-info">
                  <h2>{selectedSession.sessionName}</h2>
                  <div className="detail-meta">
                    <span>📸 by {selectedSession.photographerName}</span>
                    <span>•</span>
                    <span>📅 {selectedSession.eventDate}</span>
                    <span>•</span>
                    <span>🖼️ {selectedSession.photos.length} photos</span>
                  </div>
                </div>
              </div>

              <div className="photos-grid">
                {selectedSession.photos.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-wrapper" onClick={() => openLightbox(photo)}>
                      <img src={photo.url} alt={photo.caption} onError={(e) => (e.target.src = "/placeholder.jpg")} />
                      <div className="photo-overlay"><button className="zoom-btn">🔍 View</button></div>
                    </div>

                    <div className="photo-info">
                      <p className="photo-caption">{photo.caption || "No caption"}</p>
                      <button className="download-single-btn" onClick={() => {
                        // simple download: open in new tab
                        window.open(photo.url, "_blank");
                      }}>⬇️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <img src={lightboxImage.url} alt={lightboxImage.caption} />
            <div className="lightbox-caption">
              <p>{lightboxImage.caption}</p>
              <button className="lightbox-download" onClick={() => window.open(lightboxImage.url, "_blank")}>⬇️ Download</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
