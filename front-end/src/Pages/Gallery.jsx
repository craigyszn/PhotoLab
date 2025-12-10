import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gallery.css";
 
const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
 
const sampleGallerySessions = [
  {
    id: 1,
    sessionName: "Wedding - Juan & Maria",
    customerName: "Juan Dela Cruz",
    photographerName: "Maria Santos",
    eventDate: "2024-12-01",
    uploadDate: "2024-12-05",
    sessionType: "Wedding",
    photoCount: 45,
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", caption: "First Dance" },
      { id: 2, url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", caption: "The Vows" },
      { id: 3, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", caption: "Family Portrait" },
      { id: 4, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", caption: "Reception" },
      { id: 5, url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", caption: "Cake Cutting" },
      { id: 6, url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", caption: "Sunset Photos" }
    ]
  },
  {
    id: 2,
    sessionName: "Birthday Celebration - Sofia",
    customerName: "Ana Reyes",
    photographerName: "Carlos Martinez",
    eventDate: "2024-11-28",
    uploadDate: "2024-11-30",
    sessionType: "Birthday",
    photoCount: 32,
    coverImage:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", caption: "Birthday Girl" },
      { id: 2, url: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80", caption: "Cake Time" },
      { id: 3, url: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80", caption: "Party Fun" },
      { id: 4, url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80", caption: "Decorations" }
    ]
  },
  {
    id: 3,
    sessionName: "Family Portrait Session",
    customerName: "Roberto Flores",
    photographerName: "Isabel Cruz",
    eventDate: "2024-11-25",
    uploadDate: "2024-11-27",
    sessionType: "Portrait",
    photoCount: 28,
    coverImage:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80", caption: "Family Together" },
      { id: 2, url: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80", caption: "Parents & Kids" },
      { id: 3, url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", caption: "Candid Moments" },
      { id: 4, url: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&q=80", caption: "Outdoor Fun" }
    ]
  },
  {
    id: 4,
    sessionName: "Corporate Event - Tech Summit 2024",
    customerName: "TechCorp Inc.",
    photographerName: "Miguel Torres",
    eventDate: "2024-11-20",
    uploadDate: "2024-11-22",
    sessionType: "Corporate",
    photoCount: 56,
    coverImage:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80",
    photos: [
      { id: 1, url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80", caption: "Keynote Speaker" },
      { id: 2, url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80", caption: "Networking" },
      { id: 3, url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80", caption: "Panel Discussion" },
      { id: 4, url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80", caption: "Audience" }
    ]
  }
];
 
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
      // Not authenticated — send to auth page
      navigate("/auth");
      return;
    }
 
    const token = localStorage.getItem("photolab_token") || null;
 
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
 
      // Try to fetch from backend if possible
      try {
        // If your backend provides a user-specific endpoint, use it.
        // Example: GET /api/customers/{userId}/galleries
        if (user?.id) {
          const res = await axios.get(`${API}/customers/${user.id}/galleries`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
 
          if (Array.isArray(res.data) && res.data.length > 0) {
            setSessions(res.data);
            setLoading(false);
            return;
          }
        }
 
        // Fallback: if backend doesn't have that endpoint or returned empty,
        // filter the sample data by matching user's name (best-effort).
        const fullNameCandidates = [];
        if (user?.firstName && user?.lastName) {
          fullNameCandidates.push(`${user.firstName} ${user.lastName}`.trim());
          fullNameCandidates.push(`${user.lastName} ${user.firstName}`.trim());
        }
        if (user?.name) {
          fullNameCandidates.push(user.name);
        }
        if (user?.email) {
          fullNameCandidates.push(user.email);
        }
 
        // simple case-insensitive match against sample.customerName or sessionName
        const filtered = sampleGallerySessions.filter((s) => {
          const customer = (s.customerName || "").toLowerCase();
          const sessionName = (s.sessionName || "").toLowerCase();
          return fullNameCandidates.some((candidate) =>
            candidate && (customer.includes(candidate.toLowerCase()) || sessionName.includes(candidate.toLowerCase()))
          );
        });
 
        // If filtered array empty, you might still want to show an empty state
        setSessions(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch galleries:", err);
        // On error, fall back to filtered sample data
        const fallbackFiltered = sampleGallerySessions.filter((s) => {
          const customer = (s.customerName || "").toLowerCase();
          const sessionName = (s.sessionName || "").toLowerCase();
          const candidate = user?.email || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
          return candidate && (customer.includes(candidate.toLowerCase()) || sessionName.includes(candidate.toLowerCase()));
        });
        setSessions(fallbackFiltered);
        setError("Could not load galleries from server. Showing available local sessions (if any).");
        setLoading(false);
      }
    };
 
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
 
  const handleDownloadAll = (session) => {
    // Implement download-all logic that calls your backend to create ZIP or returns URLs
    alert(`Downloading all ${session.photoCount} photos from "${session.sessionName}"`);
  };
 
  const handleDownloadSingle = (photo, sessionName) => {
    // Implement single-photo download logic
    alert(`Downloading: ${photo.caption} from "${sessionName}"`);
  };
 
  const openLightbox = (photo) => setLightboxImage(photo);
  const closeLightbox = () => setLightboxImage(null);
 
  // Render
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
                We could not find any gallery sessions for your account. If you have an upcoming event, your
                gallery will appear here after the photographer uploads the photos.
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
                        <span className="meta-text">{session.eventDate}</span>
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
                    <span>📅 {selectedSession.eventDate}</span>
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
                      <p className="photo-caption">{photo.caption}</p>
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
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
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