import React from "react";
import "./Hero.css";

const Hero = () => {
  const scrollToHow = (e) => {
    e.preventDefault();
    const target = document.getElementById("how");
    if (!target) return;
    // smooth scroll, respects reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero" id="hero" aria-label="Hero section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              From Portraits to Products, Events to Editorial — We Bring Your Vision to Life Through the Art of Photography.
            </h1>

            <p className="hero-description">
              At PhotoLab, Explore our full range of photography services — including studio portraits,
              event coverage, product shoots, and branding sessions — all crafted to deliver stunning,
              high-quality images you'll be proud to share.
            </p>

            <button
              className="hero-button"
              onClick={scrollToHow}
              aria-controls="how"
              aria-label="Explore how it works"
            >
              Explore Our Services
            </button>
          </div>

          <div className="hero-image" role="img" aria-label="Example photo of a wedding">
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80&auto=format&fit=crop"
              alt="Happy family at the beach"
            />
          </div>
        </div>
      </div>

      {/* Tagline Section */}
      <div className="hero-tagline">
        <div className="hero-tagline-container">
          <h2 className="hero-tagline-text">Clean, authentic photography tailored to you.</h2>
        </div>
      </div>
    </section>
  );
};

export default Hero;
