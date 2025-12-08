import React from "react";
import "./Gallery.css";

export default function Gallery(){
  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <h2>Portfolio</h2>
        <p>Sample gallery thumbnails</p>
        <div className="grid">
          <div className="thumb">Image 1</div>
          <div className="thumb">Image 2</div>
          <div className="thumb">Image 3</div>
        </div>
      </div>
    </section>
  );
}
