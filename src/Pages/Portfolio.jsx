import React, { useState } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample portfolio data - Replace with your actual data from backend
  const portfolios = [
    {
      id: 1,
      photographerName: 'Maria Santos',
      title: 'Elegant Wedding Moments',
      description: 'Capturing the beauty and emotion of your special day with timeless elegance.',
      category: 'event',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
    },
    {
      id: 2,
      photographerName: 'Juan Dela Cruz',
      title: 'Professional Portraits',
      description: 'Studio and outdoor portraits that bring out your unique personality and style.',
      category: 'portrait',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80'
    },
    {
      id: 3,
      photographerName: 'Ana Reyes',
      title: 'Product Excellence',
      description: 'Commercial photography that showcases your products in the best light.',
      category: 'product',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
    },
    {
      id: 4,
      photographerName: 'Carlos Martinez',
      title: 'Corporate Branding',
      description: 'Building your brand identity through professional and cohesive imagery.',
      category: 'branding',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80'
    },
    {
      id: 5,
      photographerName: 'Sofia Garcia',
      title: 'Editorial Fashion',
      description: 'Creative and artistic imagery for magazines and marketing campaigns.',
      category: 'editorial',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'
    },
    {
      id: 6,
      photographerName: 'Miguel Torres',
      title: 'Milestone Celebrations',
      description: 'Preserving precious memories from birthdays, graduations, and special events.',
      category: 'event',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'
    },
    {
      id: 7,
      photographerName: 'Isabel Cruz',
      title: 'Family Treasures',
      description: 'Warm and authentic family portraits that capture genuine connections.',
      category: 'portrait',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80'
    },
    {
      id: 8,
      photographerName: 'Roberto Flores',
      title: 'Luxury Products',
      description: 'High-end product photography for premium brands and e-commerce.',
      category: 'product',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Work', icon: '🎨' },
    { id: 'portrait', name: 'Portraits', icon: '📸' },
    { id: 'event', name: 'Events', icon: '🎉' },
    { id: 'product', name: 'Products', icon: '📦' },
    { id: 'branding', name: 'Branding', icon: '✨' },
    { id: 'editorial', name: 'Editorial', icon: '📰' }
  ];

  const filteredPortfolios = selectedCategory === 'all' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory);

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="portfolio-header">
        <div className="portfolio-header-content">
          <h1>Our Portfolio</h1>
          <p>Explore our collection of stunning photography work from our talented team</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="portfolio-filters">
        <div className="filters-container">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="portfolio-content">
        <div className="portfolio-container">
          <div className="portfolio-grid">
            {filteredPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="portfolio-card">
                <div className="portfolio-image-wrapper">
                  <img 
                    src={portfolio.image} 
                    alt={portfolio.title}
                    className="portfolio-image"
                  />
                  <div className="portfolio-overlay">
                    <div className="overlay-content">
                      <h3 className="portfolio-title">{portfolio.title}</h3>
                      <p className="portfolio-description">{portfolio.description}</p>
                      <div className="photographer-badge">
                        <span className="photographer-icon">👤</span>
                        <span className="photographer-name">{portfolio.photographerName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPortfolios.length === 0 && (
            <div className="no-results">
              <p>No portfolio items found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="portfolio-cta">
        <div className="cta-content">
          <h2>Ready to Create Your Own Story?</h2>
          <p>Let our talented photographers bring your vision to life</p>
          <button className="cta-button" onClick={() => window.location.href = '/booking'}>
            Book a Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;