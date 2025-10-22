import React from "react";
import ServicesPreview from "../sections/servicespreview";
import GalleryPreview from "../sections/gallerypreview";
import "./home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Capture life's moments with professional precision</h1>
          <p>
            We transform ordinary scenes into extraordinary memories. Our skilled 
            photographers bring your vision to life with creativity and technical expertise.
          </p>
          <div className="hero-buttons">
            <a href="/booking" className="btn primary">Book now</a>
            <a href="/services" className="btn secondary">View packages</a>
          </div>
        </div>
      </section>

      <ServicesPreview />
      <GalleryPreview />
    </div>
  );
}