import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../CSS FOLDER/Search.css"; // Import the updated CSS

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo"> Library Management</h1> 
      
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">
            <img src="/search-icon.svg" alt="Search" className="search-icon" />
          </button>
        </div>
      </div>
      
      <Link to="/lib" className="nav-link">Library</Link> {/* Added a link to the library */}
    </nav>
  );
};

export default Navbar;
