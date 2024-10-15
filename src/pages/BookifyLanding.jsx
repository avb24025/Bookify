import React from 'react';
import './BookifyLanding.css'; // Assume we have a CSS file for styling

function BookifyLanding() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  return (
    <div className="bookify-landing">
      {/* <header className="header">
        <div className="logo">Bookify</div>
        <nav className="nav">
          <button className="nav-button active">Home</button>
          <button className="nav-button">List Book</button>
        </nav>
        <div className="auth-buttons">
          <button className="auth-button login">Login</button>
          <button className="auth-button signup">Sign Up</button>
        </div>
      </header> */}

      <main className="main-content">
        <h1 className="title">Welcome to Bookify</h1>
        <p className="description">
          At Bookify you can buy second-hand books and sell old books online at the best prices. 
          Selling used books online for cash made easy with Bookify!
        </p>

        {/* <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for a book..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form> */}

        {/* <div className="book-grid">
          <div className="book-card">
            <img src="/placeholder.svg" alt="PCGOE logo" className="book-image" />
            <h3 className="book-title">abc</h3>
            <p className="book-price">Price: $7869</p>
            <p className="book-seller">Added by: xyz@gmail.com</p>
            <button className="view-details-button">View Details</button>
          </div>

          <div className="book-card">
            <img src="/placeholder.svg" alt="Mathematics book cover" className="book-image" />
            <h3 className="book-title">How to crack jee in one month</h3>
            <p className="book-price">Price: $0</p>
            <p className="book-seller">Added by: xyz@gmail.com</p>
            <button className="view-details-button">View Details</button>
          </div>

          <div className="book-card">
            <img src="/placeholder.svg" alt="Sahil's Vichar" className="book-image" />
            <h3 className="book-title">Sahil's Vichar..</h3>
            <p className="book-price">Price: $1000</p>
            <p className="book-seller">Added by: tempgmail@gmail.com</p>
            <button className="view-details-button">View Details</button>
          </div>
        </div> */}
      </main>

      <footer className="footer">
        <p>© 2024 Bookify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default BookifyLanding;