import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ Added `useLocation`
import '../CSS FOLDER/Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = ({ onSearch }) => {
  const [sticky, setSticky] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get the current URL path

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
    onSearch && onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const path = location.pathname; // ✅ Get current route

      if (path.includes("courierlibrary")) {
        navigate(searchInput.trim() ? `/courierlibrary?q=${encodeURIComponent(searchInput.trim())}` : '/courierlibrary');
      } else if (path.includes("lib")) {
        navigate(searchInput.trim() ? `/lib?q=${encodeURIComponent(searchInput.trim())}` : '/lib');
      }
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
        <li><Link to="/courierhome">Home</Link></li>
        <li><Link to="/courierlibrary"> Library</Link></li>
        <li><Link to="/courierhistory"> History</Link></li>
        <li><Link to="/couriergamehome"> Games</Link></li>
        <li><Link to="/courierarticles"> Articles</Link></li>
        <li><Link to="/courierprofile" className="profile-link"> Profile (Courier) </Link></li>
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
