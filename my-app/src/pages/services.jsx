import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "./services.css";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then(res => setServices(res.data)).catch(() => {});
  }, []);

  return (
    <div className="services-container">
      <h1>Packages & Pricing</h1>
      <div className="services-grid">
        {services.length ? (
          services.map(s => (
            <div key={s.id} className="service-card">
              <div className="service-header">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
              <div className="service-price">
                <span>${s.price}</span>
                <small>{s.duration}</small>
              </div>
            </div>
          ))
        ) : (
          <p>No packages to show.</p>
        )}
      </div>
    </div>
  );
}