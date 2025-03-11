import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Use Link for navigation
import '../CSS FOLDER/Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = ({ onSearch }) => {
  const [sticky, setSticky] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigation

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    onSearch && onSearch(query); // ✅ Calls live search if available
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      navigate(searchInput.trim() ? `/lib?q=${encodeURIComponent(searchInput.trim())}` : '/lib');
    }
  };

  return (
    <nav className={`navbar ${sticky ? 'dark-nav' : ''}`}>
      <div className="nav-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <input
        type="text"
        placeholder="Search for books..."
        value={searchInput}
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        className="search-bar"
      />

      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/lib">Library</Link></li>
        <li><Link to="/bookhistory"> History</Link></li>
        <li><Link to="/gamesh">Games</Link></li>
        <li><Link to="/courierp">Courier</Link></li>
        <li><Link to="/prof" className="profile-link">Profile</Link></li>
        <li>
          <button className="btn">
            <Link to="/login">Log Out</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
