// src/Pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [exportFiles, setExportFiles] = useState([]);
  const [exportBase, setExportBase] = useState(null); // discovered base (e.g. API or base-without-api)
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalPhotographers: 0,
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [error, setError] = useState(null);

  // for upload: selected photographer for the upload form
  const [uploadPhotographerId, setUploadPhotographerId] = useState("");

  const navigate = useNavigate();

  const readUserFromStorage = () => {
    try {
      const raw = localStorage.getItem("photolab_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getToken = () => localStorage.getItem("photolab_token") || null;
  const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // normalize booking shape helper
  const normalizeBookings = (arr) => {
    return (arr || []).map((b) => {
      const id = b.bookingId ?? b.id ?? b.booking_id ?? null;
      const bookingRef = b.bookingRef ?? b.ref ?? b.booking_ref ?? `#${id}`;
      const bookingDate = b.bookingDate ?? b.date ?? b.booking_date ?? "";
      const service =
        b.service ??
        (b.event && (b.event.eventName ?? b.event.event_name)) ??
        b.packageType ??
        b.package_type ??
        "";
      const customerName =
        b.customerName ??
        (b.customer &&
        (b.customer.firstName ?? b.customer.firstname)
          ? `${b.customer.firstName || ""} ${b.customer.lastName || ""}`
          : b.customer?.email ?? "");
      const statusRaw = b.status ?? b.bookingStatus ?? "";
      const status = typeof statusRaw === "string" ? statusRaw.trim() : statusRaw;
      const photographerName =
        b.photographerName ??
        (b.photographer && (b.photographer.name ?? b.photographerName)) ??
        (b.photographer?.name ?? null);

      return {
        ...b,
        id,
        bookingRef,
        bookingDate,
        service,
        customerName,
        status,
        photographerName,
        photographerId:
          (b.photographerId ??
            b.photographer?.photographerId ??
            b.photographer?.photographer_id) ?? null,
      };
    });
  };

  // helper to remove trailing "/api" from base
  const removeApiSuffix = (url) => {
    if (!url) return url;
    return url.replace(/\/api\/?$/, "");
  };

  // discover and load exports list (tries API and fallback without /api)
  const refreshExports = async () => {
    const tokenHeader = authHeaders();

    // If already discovered, try that first
    if (exportBase) {
      try {
        const res = await axios.get(`${exportBase}/exports/bookings`, { headers: tokenHeader });
        setExportFiles(Array.isArray(res.data) ? res.data : []);
        return;
      } catch (err) {
        // cached base failed - fallthrough to discovery
        console.warn("Cached export base failed, re-discovering...", err?.response?.status || err?.message);
      }
    }

    const candidates = [API, removeApiSuffix(API)].filter(Boolean);

    for (let base of candidates) {
      const url = `${base}/exports/bookings`;
      try {
        const res = await axios.get(url, { headers: tokenHeader });
        if (res.status === 200) {
          setExportBase(base);
          setExportFiles(Array.isArray(res.data) ? res.data : []);
          console.log("Using exports base:", base);
          return;
        }
      } catch (err) {
        // try next candidate
        console.warn("Trying exports URL failed:", url, err?.response?.status || err.message);
      }
    }

    // none worked
    setExportFiles([]);
    console.warn("No exports endpoint reachable at expected paths.");
  };

  useEffect(() => {
    const user = readUserFromStorage();
    // role guard: only allow admin or photographer
    const role = (user?.role ?? user?.roles?.[0] ?? "").toString().toLowerCase?.() || "";
    if (!user || (role !== "admin" && role !== "photographer")) {
      navigate("/");
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch stats optionally
        let fetchedStats = null;
        try {
          const statsRes = await axios.get(`${API}/admin/stats`, { headers: authHeaders() });
          if (statsRes?.data) fetchedStats = statsRes.data;
        } catch (err) {
          // ignore if endpoint not present
        }

        // fetch users
        let fetchedUsers = [];
        try {
          const usersRes = await axios.get(`${API}/users`, { headers: authHeaders() });
          if (Array.isArray(usersRes?.data)) fetchedUsers = usersRes.data;
        } catch (err) {}

        // fetch bookings
        let fetchedBookings = [];
        try {
          const bookingsRes = await axios.get(`${API}/bookings`, { headers: authHeaders() });
          if (Array.isArray(bookingsRes?.data)) fetchedBookings = bookingsRes.data;
          else if (bookingsRes?.data?.items) fetchedBookings = bookingsRes.data.items;
        } catch (err) {}

        // fetch photographers
        let fetchedPhotographers = [];
        try {
          const photographersRes = await axios.get(`${API}/photographers`, {
            headers: authHeaders(),
          });
          if (Array.isArray(photographersRes?.data)) fetchedPhotographers = photographersRes.data;
        } catch (err) {}

        // normalize bookings
        const normalized = normalizeBookings(fetchedBookings);

        // set state
        setUsers(fetchedUsers);
        setBookings(normalized);
        setPhotographers(fetchedPhotographers);

        // discover and fetch exports (may set exportBase)
        await refreshExports();

        // compute stats if not returned by API
        if (fetchedStats) {
          setStats(fetchedStats);
        } else {
          const pendingCount = normalized.filter(
            (b) => (b.status || "").toString().toLowerCase() === "pending"
          ).length;
          const completedCount = normalized.filter(
            (b) => (b.status || "").toString().toLowerCase() === "completed"
          ).length;
          setStats({
            totalUsers: fetchedUsers.length,
            totalBookings: normalized.length,
            pendingBookings: pendingCount,
            completedBookings: completedCount,
            totalPhotographers: fetchedPhotographers.length,
          });
        }

        // default select first confirmed/completed booking in upload tab (if any)
        const firstOk =
          normalized.find((b) =>
            ["confirmed", "completed"].includes((b.status || "").toString().toLowerCase())
          ) ?? normalized[0] ?? null;
        if (firstOk) {
          setSelectedBooking(firstOk);
          // if booking already has assigned photographer, pre-select it in upload form
          if (firstOk.photographerId) setUploadPhotographerId(firstOk.photographerId);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data.");
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
    try {
      await axios.patch(
        `${API}/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: authHeaders() }
      );
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking status. Reloading.");
      window.location.reload();
    }
  };

  const handleAssignPhotographer = async (bookingId, newPhotographerId) => {
    // update UI immediately
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              photographerId: newPhotographerId,
              photographerName:
                photographers.find(
                  (p) => String(p.photographerId ?? p.id ?? p.id) === String(newPhotographerId)
                )?.name ?? "Unassigned",
            }
          : b
      )
    );
    try {
      // attempt to call backend endpoint to set photographer for booking.
      await axios.patch(
        `${API}/bookings/${bookingId}/photographer`,
        { photographerId: newPhotographerId },
        { headers: authHeaders() }
      );
    } catch (err) {
      console.error("Failed to assign photographer:", err);
      alert("Failed to assign photographer. See console.");
      // revert state (simple fallback: reload)
      window.location.reload();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API}/users/${userId}`, { headers: authHeaders() });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert(`User ${userId} deleted`);
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  // NOTE: upload button removed from Actions column per request.
  const onFilesSelected = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadFiles(null);
      return;
    }
    setUploadFiles(files);
  };

  const submitUpload = async () => {
    if (!selectedBooking) {
      alert("No booking selected.");
      return;
    }
    if (!uploadFiles || uploadFiles.length === 0) {
      alert("Please choose photo files to upload.");
      return;
    }

    // quick client-side size check (optional) - total <= 200MB
    const totalBytes = Array.from(uploadFiles).reduce((s, f) => s + f.size, 0);
    const MAX_TOTAL = 200 * 1024 * 1024; // 200MB
    if (totalBytes > MAX_TOTAL) {
      alert("Total files too large. Try uploading fewer / smaller images.");
      return;
    }

    const photographerId = uploadPhotographerId || selectedBooking.photographerId;
    if (!photographerId) {
      if (!window.confirm("No photographer selected. Upload anyway without associating a photographer?")) {
        return;
      }
    }

    setUploading(true);
    try {
      const form = new FormData();
      for (let i = 0; i < uploadFiles.length; i++) {
        form.append("files", uploadFiles[i]); // backend expects key 'files'
      }
      const endpoint = photographerId
        ? `${API}/galleries/${selectedBooking.id}/photos?photographerId=${photographerId}`
        : `${API}/galleries/${selectedBooking.id}/photos`;
      const res = await axios.post(endpoint, form, {
        headers: {
          ...authHeaders(),
        },
        timeout: 120000,
      });
      console.log("Upload success:", res?.data);
      alert("Photos uploaded successfully.");
      setShowUploadModal(false);
      setSelectedBooking(null);
      setUploadFiles(null);

      // refresh bookings
      const bookingsRes = await axios.get(`${API}/bookings`, { headers: authHeaders() });
      setBookings(
        normalizeBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.items || [])
      );
    } catch (err) {
      console.error("Photo upload failed:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.status, err.response.data);
        alert(`Photo upload failed (status ${err.response.status}). See console for details.`);
      } else if (err.request) {
        console.error("No response received, request was:", err.request);
        alert("Photo upload failed — no response from server. See console.");
      } else {
        console.error("Upload error:", err.message);
        alert("Photo upload failed. See console.");
      }
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedBooking(null);
    setUploadFiles(null);
    setUploadPhotographerId("");
  };

  // helper to render photographer dropdown options (for bookings table)
  const renderPhotographerOptions = () => {
    return [
      <option key="unassigned" value="">
        Unassigned
      </option>,
      ...(photographers || []).map((p) => (
        <option key={p.photographerId ?? p.id} value={p.photographerId ?? p.id}>
          {p.name}
        </option>
      )),
    ];
  };

  // --- NEW: handle toggle availability (optimistic UI)
  const handleToggleAvailability = async (photographerId, newAvailability) => {
    setPhotographers((prev) =>
      prev.map((p) =>
        String(p.photographerId ?? p.id) === String(photographerId) ? { ...p, availability: newAvailability } : p
      )
    );
    try {
      await axios.patch(
        `${API}/photographers/${photographerId}/availability`,
        { availability: newAvailability },
        { headers: authHeaders() }
      );
    } catch (err) {
      console.error("Failed to update availability:", err);
      alert("Failed to update availability. Reverting UI. See console.");
      const photographersRes = await axios.get(`${API}/photographers`, { headers: authHeaders() });
      setPhotographers(Array.isArray(photographersRes.data) ? photographersRes.data : []);
    }
  };

  // --- NEW: download + delete export helpers (use discovered exportBase)
  const handleDownloadExport = (filename) => {
    const base = exportBase || API;
    const url = `${base}/exports/bookings/${encodeURIComponent(filename)}`;
    window.open(url, "_blank");
  };

  const handleDeleteExport = async (filename) => {
    if (!window.confirm(`Delete ${filename}? This action cannot be undone.`)) return;
    try {
      const base = exportBase || API;
      await axios.delete(`${base}/exports/bookings/${encodeURIComponent(filename)}`, {
        headers: authHeaders(),
      });
      await refreshExports();
      alert("Deleted.");
    } catch (err) {
      console.error("Delete export failed:", err);
      alert("Failed to delete export. See console.");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>PhotoLab Admin</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="nav-icon">📊</span> <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="nav-icon">👥</span> <span>Users</span>
          </button>
          <button
            className={`nav-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            <span className="nav-icon">📅</span> <span>Bookings</span>
          </button>
          <button
            className={`nav-item ${activeTab === "photographers" ? "active" : ""}`}
            onClick={() => setActiveTab("photographers")}
          >
            <span className="nav-icon">📸</span> <span>Photographers</span>
          </button>
          <button
            className={`nav-item ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <span className="nav-icon">⬆️</span> <span>Upload Photos</span>
          </button>

          {/* NEW: Exports tab */}
          <button
            className={`nav-item ${activeTab === "exports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exports");
              refreshExports();
            }}
          >
            <span className="nav-icon">📁</span> <span>Exports</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "bookings" && "Booking Management"}
            {activeTab === "photographers" && "Photographers"}
            {activeTab === "upload" && "Upload Photos"}
            {activeTab === "exports" && "Exports"}
          </h1>
        </div>

        <div className="admin-content">
          {loading ? (
            <div>Loading admin data…</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="overview-section">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">👥</div>
                      <div className="stat-info">
                        <p className="stat-label">Total Users</p>
                        <p className="stat-value">{stats.totalUsers}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <p className="stat-label">Total Bookings</p>
                        <p className="stat-value">{stats.totalBookings}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⏳</div>
                      <div className="stat-info">
                        <p className="stat-label">Pending Bookings</p>
                        <p className="stat-value">{stats.pendingBookings}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-info">
                        <p className="stat-label">Completed</p>
                        <p className="stat-value">{stats.completedBookings}</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📸</div>
                      <div className="stat-info">
                        <p className="stat-label">Photographers</p>
                        <p className="stat-value">{stats.totalPhotographers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="recent-activity">
                    <h2>Recent Bookings</h2>
                    <div className="activity-list">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="activity-item">
                          <div className="activity-icon">📅</div>
                          <div className="activity-info">
                            <p className="activity-title">{booking.service}</p>
                            <p className="activity-meta">
                              {booking.customerName} • {booking.bookingDate}
                            </p>
                          </div>
                          <span className={`status-badge ${String(booking.status || "").toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                      {bookings.length === 0 && <div style={{ padding: 12, color: "#6b7280" }}>No recent bookings</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="users-section">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td className="user-name">{u.name || `${u.firstName || ""} ${u.lastName || ""}`}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`role-badge ${(u.role || "customer").toLowerCase()}`}>
                                {u.role || "Customer"}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${(u.status || "active").toLowerCase()}`}>
                                {u.status || "Active"}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="btn-delete" onClick={() => handleDeleteUser(u.id)} title="Delete">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bookings Tab (Actions column now only shows CSV download) */}
              {activeTab === "bookings" && (
                <div className="bookings-section">
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Ref#</th>
                          <th>Customer</th>
                          <th>Photographer</th>
                          <th>Service</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => {
                          // find file for this booking (matching naming pattern booking_<id>.csv)
                          const csvForBooking = (exportFiles || []).find((f) => f.includes(`booking_${booking.id}`));
                          return (
                            <tr key={booking.id}>
                              <td className="booking-ref">{booking.bookingRef}</td>
                              <td>{booking.customerName}</td>
                              <td>
                                <select
                                  className="form-control"
                                  value={booking.photographerId ?? ""}
                                  onChange={(e) =>
                                    handleAssignPhotographer(booking.id, e.target.value ? Number(e.target.value) : "")
                                  }
                                >
                                  <option value="">Unassigned</option>
                                  {photographers.map((p) => (
                                    <option key={p.photographerId ?? p.id} value={p.photographerId ?? p.id}>
                                      {p.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>{booking.service}</td>
                              <td>{booking.bookingDate}</td>
                              <td>
                                <select
                                  className={`status-select ${String(booking.status || "").toLowerCase()}`}
                                  value={booking.status}
                                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>

                              {/* Actions column: only CSV download (upload removed) */}
                              <td>
                                <div className="action-buttons">
                                  {csvForBooking ? (
                                    <a
                                      className="btn-download"
                                      href={`${(exportBase || API)}/exports/bookings/${encodeURIComponent(csvForBooking)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="Download booking CSV"
                                    >
                                      ⤓
                                    </a>
                                  ) : (
                                    <span className="no-export" title="No CSV">
                                      —
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>
                              No bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Photographers Tab (updated: toggle + removed View Portfolio) */}
              {activeTab === "photographers" && (
                <div className="photographers-section">
                  <div className="photographers-grid">
                    {photographers.map((pRaw) => {
                      const p = {
                        id: pRaw.photographerId ?? pRaw.id,
                        name: pRaw.name,
                        availability: (pRaw.availability ?? "no").toString().toLowerCase(),
                      };
                      // Determine bookings assigned to this photographer (show refs)
                      const assigned = bookings.filter((b) => String(b.photographerId ?? "") === String(p.id));
                      return (
                        <div key={p.id} className="photographer-card">
                          <div className="photographer-avatar">
                            <span className="avatar-icon">📸</span>
                          </div>
                          <h3>{p.name}</h3>
                          <div className="photographer-stats">
                            <div className="stat-item">
                              <span className="stat-label">Availability:</span>
                              <span className="stat-value">
                                {/* Toggle switch */}
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={p.availability === "yes"}
                                    onChange={(e) =>
                                      handleToggleAvailability(p.id, e.target.checked ? "yes" : "no")
                                    }
                                  />
                                  <span className="slider" />
                                </label>
                              </span>
                            </div>

                            <div className="stat-item" style={{ marginTop: 8 }}>
                              <span className="stat-label">Assigned Bookings:</span>
                              <span className="stat-value">
                                {assigned.length > 0 ? assigned.map((x) => `#${x.id}`).join(", ") : "-"}
                              </span>
                            </div>
                          </div>

                          <div className="photographer-actions">{/* View Portfolio removed as requested */}</div>
                        </div>
                      );
                    })}

                    {photographers.length === 0 && (
                      <div style={{ padding: 20, color: "#6b7280" }}>No photographers available</div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Photos Tab (kept intact; row action removed only) */}
              {activeTab === "upload" && (
                <div className="upload-section">
                  <div className="upload-card">
                    <h2>Upload Photos to Customer Gallery</h2>
                    <p className="upload-description">Select a booking and upload photos that customers can view and download</p>

                    <div className="upload-form">
                      <div className="form-group">
                        <label>Select Booking</label>
                        <select
                          className="form-control"
                          value={selectedBooking?.id || ""}
                          onChange={(e) => {
                            const booking = bookings.find((b) => String(b.id) === String(e.target.value));
                            setSelectedBooking(booking || null);
                            if (booking?.photographerId) setUploadPhotographerId(booking.photographerId);
                            else setUploadPhotographerId("");
                          }}
                        >
                          <option value="">Choose a booking...</option>
                          {bookings.map((booking) => (
                            <option key={booking.id} value={booking.id}>
                              {`${booking.bookingRef} - ${booking.customerName} - ${booking.service}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Select Photographer</label>
                        <select
                          className="form-control"
                          value={uploadPhotographerId || ""}
                          onChange={(e) => setUploadPhotographerId(e.target.value)}
                        >
                          <option value="">(none) — choose a photographer</option>
                          {photographers.map((p) => (
                            <option key={p.photographerId ?? p.id} value={p.photographerId ?? p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                          The selected photographer will be associated with uploaded photos (saved to gallery.photographer_id).
                        </p>
                      </div>

                      <div className="upload-area">
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">Drag and drop photos here or click to browse</p>
                        <input type="file" multiple accept="image/*" onChange={onFilesSelected} className="file-input" />
                        <button
                          className="upload-button"
                          onClick={() => document.querySelector(".upload-section .file-input")?.click()}
                        >
                          Choose Photos
                        </button>

                        {uploadFiles && uploadFiles.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            <strong>{uploadFiles.length} file(s) ready</strong>
                            <ul>
                              {Array.from(uploadFiles).map((f, i) => (
                                <li key={i}>
                                  {f.name} ({Math.round(f.size / 1024)} KB)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <button className="submit-upload-btn" onClick={submitUpload} disabled={uploading}>
                        {uploading ? "Uploading…" : "Upload Photos to Gallery"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NEW: Exports Tab */}
              {activeTab === "exports" && (
                <div className="exports-section">
                  <div className="table-container" style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h2 style={{ margin: 0 }}>Exports</h2>
                      <div>
                        <button className="submit-upload-btn" onClick={refreshExports} style={{ padding: "8px 12px", fontSize: 14 }}>
                          Refresh
                        </button>
                      </div>
                    </div>

                    {exportFiles.length === 0 ? (
                      <div style={{ padding: 20, color: "#6b7280" }}>No export files found.</div>
                    ) : (
                      <ul className="export-list" style={{ margin: 0, padding: 0 }}>
                        {exportFiles.map((f) => (
                          <li key={f} className="export-row">
                            <span className="export-name">{f}</span>
                            <div className="export-actions">
                              <button className="btn-download" onClick={() => handleDownloadExport(f)}>Download</button>
                              <button className="btn-delete" onClick={() => handleDeleteExport(f)} style={{ marginLeft: 8 }}>Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal (kept in case you still want modal upload flow) */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={closeUploadModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeUploadModal}>
              ✕
            </button>
            <h2>Upload Photos</h2>
            <p className="modal-subtitle">
              Booking: {selectedBooking?.bookingRef} - {selectedBooking?.customerName}
            </p>

            <div className="form-group">
              <label>Select Photographer</label>
              <select
                className="form-control"
                value={uploadPhotographerId || ""}
                onChange={(e) => setUploadPhotographerId(e.target.value)}
              >
                <option value="">(none)</option>
                {photographers.map((p) => (
                  <option key={p.photographerId ?? p.id} value={p.photographerId ?? p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-area">
              <div className="upload-icon">📤</div>
              <p className="upload-text">Drag and drop photos here or click to browse</p>
              <input type="file" multiple accept="image/*" onChange={onFilesSelected} className="file-input" />
              <button className="upload-button" onClick={() => document.querySelector(".modal-content .file-input")?.click()}>
                Choose Photos
              </button>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="submit-modal-btn" onClick={submitUpload} disabled={uploading}>
                {uploading ? "Uploading…" : "Upload to Gallery"}
              </button>
              <button className="modal-btn cancel-btn" onClick={closeUploadModal} disabled={uploading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
