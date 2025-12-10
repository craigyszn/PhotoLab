import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gallery.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const Gallery = () => {
  const [sessions, setSessions] = useState([]); // grouped sessions (by bookingId)
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

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Backend returns array of gallery rows (one photo per row)
        const res = await axios.get(`${API}/galleries/customer/${user.customerId}`);
        const rows = Array.isArray(res.data) ? res.data : [];

        // Group rows by bookingId. Use "no-booking-{galleryId}" as key for photos without booking.
        const grouped = rows.reduce((acc, row) => {
          const key = row.bookingId != null ? `booking-${row.bookingId}` : `unlinked-${row.galleryId}`;
          if (!acc[key]) acc[key] = { bookingId: row.bookingId, rows: [] };
          acc[key].rows.push(row);
          return acc;
        }, {});

        // Convert grouped object to sessions array the UI expects
        const builtSessions = Object.values(grouped).map((group) => {
          const rows = group.rows;

          // cover image = first row's photoUrl
          const coverImage = rows[0]?.photoUrl || null;

          // photo objects
          const photos = rows.map((r) => ({
            id: r.galleryId,
            url: r.photoUrl,
            caption: r.photoDescription || "" // if you later add caption to entity
          }));

          // latest uploadDate among rows
          const uploadDates = rows.map((r) => r.uploadDate).filter(Boolean);
          const latestUpload = uploadDates.length ? uploadDates.sort().slice(-1)[0] : null;

          // photographer name fallback: "Photographer #{id}" if no name provided by backend
          const photographerName = rows[0]?.photographerName || (rows[0]?.photographerId ? `Photographer #${rows[0].photographerId}` : "N/A");

          // session name: try to use event info if present; else Booking #id or "Unlinked Session"
          const sessionName = rows[0]?.eventName || (group.bookingId ? `Booking #${group.bookingId}` : `Session ${rows[0]?.galleryId || ""}`);

          return {
            // keep a stable key for the UI
            id: group.bookingId != null ? `booking-${group.bookingId}` : `unlinked-${rows[0]?.galleryId}`,
            bookingId: group.bookingId,
            sessionName,
            customerName: rows[0]?.customerName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "You",
            photographerName,
            eventDate: rows[0]?.eventDate || null,
            uploadDate: latestUpload,
            sessionType: rows[0]?.eventType || null,
            photoCount: photos.length,
            coverImage,
            photos
          };
        });

        // sort sessions by uploadDate desc (put newest first)
        builtSessions.sort((a, b) => {
          if (!a.uploadDate && !b.uploadDate) return 0;
          if (!a.uploadDate) return 1;
          if (!b.uploadDate) return -1;
          return b.uploadDate.localeCompare(a.uploadDate);
        });

        setSessions(builtSessions);
      } catch (err) {
        console.error("Failed to fetch galleries:", err);
        setError("Could not load galleries from server. Showing empty state.");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleDownloadAll = (session) => {
    // Ideally call backend endpoint to produce a ZIP.
    // Placeholder:
    alert(`Downloading all ${session.photoCount} photos from "${session.sessionName}"`);
  };

  const handleDownloadSingle = (photo, sessionName) => {
    // You can implement actual download by fetching the image and creating an <a download> link.
    alert(`Downloading: ${photo.caption || photo.id} from "${sessionName}"`);
  };

  const openLightbox = (photo) => setLightboxImage(photo);
  const closeLightbox = () => setLightboxImage(null);

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
          {loading ? (
            <div className="empty-state">Loading galleries…</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <h3>No galleries found</h3>
              <p>
                We could not find any gallery sessions for your account. If you
                have an upcoming event, your gallery will appear here after the
                photographer uploads the photos.
              </p>
            </div>
          ) : !selectedSession ? (
            <div className="sessions-grid">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-cover" onClick={() => setSelectedSession(session)}>
                    <img src={session.coverImage} alt={session.sessionName} />
                    <div className="session-overlay">
                      <button className="view-btn">View Gallery</button>
                    </div>
                  </div>

                  <div className="session-info">
                    <h3 className="session-title">{session.sessionName}</h3>

                    <div className="session-meta">
                      <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span className="meta-text">{session.customerName}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📸</span>
                        <span className="meta-text">{session.photographerName}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">{session.eventDate || session.uploadDate || "—"}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🖼️</span>
                        <span className="meta-text">{session.photoCount} photos</span>
                      </div>
                    </div>

                    <div className="session-actions">
                      <button className="download-all-btn" onClick={() => handleDownloadAll(session)}>
                        ⬇️ Download All
                      </button>
                      <button className="view-gallery-btn" onClick={() => setSelectedSession(session)}>
                        View Gallery →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="session-detail">
              <div className="session-detail-header">
                <button className="back-btn" onClick={() => setSelectedSession(null)}>
                  ← Back to All Sessions
                </button>

                <div className="session-detail-info">
                  <h2>{selectedSession.sessionName}</h2>
                  <div className="detail-meta">
                    <span>📸 by {selectedSession.photographerName}</span>
                    <span>•</span>
                    <span>📅 {selectedSession.eventDate || selectedSession.uploadDate}</span>
                    <span>•</span>
                    <span>🖼️ {selectedSession.photoCount} photos</span>
                  </div>
                </div>

                <button className="download-all-btn-header" onClick={() => handleDownloadAll(selectedSession)}>
                  ⬇️ Download All Photos
                </button>
              </div>

              <div className="photos-grid">
                {selectedSession.photos.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-wrapper" onClick={() => openLightbox(photo)}>
                      <img src={photo.url} alt={photo.caption} />
                      <div className="photo-overlay">
                        <button className="zoom-btn">🔍 View</button>
                      </div>
                    </div>

                    <div className="photo-info">
                      <p className="photo-caption">{photo.caption || ""}</p>
                      <button className="download-single-btn" onClick={() => handleDownloadSingle(photo, selectedSession.sessionName)}>
                        ⬇️
                      </button>
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
              <button className="lightbox-download" onClick={() => handleDownloadSingle(lightboxImage, selectedSession.sessionName)}>
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
