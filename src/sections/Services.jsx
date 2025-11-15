import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    { 
      title: 'Portrait Photography', 
      desc: 'Capture your personality in stunning studio or outdoor portraits', 
      icon: '📸' 
    },
    { 
      title: 'Event Coverage', 
      desc: 'Professional documentation of your special moments and celebrations', 
      icon: '🎉' 
    },
    { 
      title: 'Product Shoots', 
      desc: 'Showcase your products with commercial-grade photography', 
      icon: '📦' 
    },
    { 
      title: 'Branding Sessions', 
      desc: 'Build your brand identity with cohesive visual storytelling', 
      icon: '✨' 
    },
    { 
      title: 'Editorial Photography', 
      desc: 'Creative imagery for publications and marketing campaigns', 
      icon: '📰' 
    },
    { 
      title: 'Custom Projects', 
      desc: 'Tailored photography solutions for your unique needs', 
      icon: '🎨' 
    }
  ];

  return (
    <section className="services">
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={idx} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;