import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Services from '../sections/Services';
import Booking from '../sections/Booking';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <Services />
      <Booking />
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">PhotoLab</div>
              <p className="footer-text">Professional photography services for every occasion</p>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#portraits">Portraits</a></li>
                <li><a href="#events">Events</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#branding">Branding</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Connect</h4>
              <ul className="footer-links">
                <li><a href="#instagram">Instagram</a></li>
                <li><a href="#facebook">Facebook</a></li>
                <li><a href="#pinterest">Pinterest</a></li>
                <li><a href="#email">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 PhotoLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;