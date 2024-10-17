import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './BookifyLanding.css'; // Assume we have a CSS file for styling

function BookifyLanding() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleGetStarted = () => {
    navigate('/home'); // Navigate to /home on button click
  };

  return (
    <div className="bookify-landing">
      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero-title">Discover, Buy & Sell Books Easily</h1>
        <p className="hero-description">
          At Bookify, we make it easy to buy second-hand books and sell your old books for cash. Join our community and start your book journey today!
        </p>
        <button className="hero-button" onClick={handleGetStarted}>Get Started</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Bookify?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Secure Payments</h3>
            <p>Transactions are safe and protected, giving you peace of mind when buying or selling books.</p>
          </div>
          <div className="feature">
            <h3>Wide Selection</h3>
            <p>Discover books from every genre and category at the best prices.</p>
          </div>
          <div className="feature">
            <h3>Easy to Sell</h3>
            <p>List your old books quickly and reach potential buyers instantly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"Bookify made it so easy for me to sell my old books and get some extra cash. The process was seamless!"</p>
            <h4>- Sarah W.</h4>
          </div>
          <div className="testimonial">
            <p>"I've bought many second-hand books from Bookify. The prices are unbeatable, and the service is fantastic!"</p>
            <h4>- John D.</h4>
          </div>
          <div className="testimonial">
            <p>"Selling my textbooks on Bookify was a breeze. Highly recommend this platform!"</p>
            <h4>- Emma L.</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Bookify. All rights reserved.</p>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default BookifyLanding;
