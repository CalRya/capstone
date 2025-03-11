import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Ensures navigation works
import '../CSS FOLDER/Navbar.css';
import logo from '../../assets/logo.png';

const NavbarAdmin = ({ onSearch }) => {
  const [sticky, setSticky] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setSticky(window.scrollY > 50);
    });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchInput(query);
    onSearch(query); // ✅ Live update search results
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchInput.trim() === "") {
        navigate("/lib"); // ✅ Redirect to library if search is empty
      } else {
        navigate(`/lib?q=${encodeURIComponent(searchInput.trim())}`); // ✅ Redirect with search query
      }
    }
  };

  return (
    <nav className={`container ${sticky ? "dark-nav" : ""}`}>
      <img src={logo} alt="Logo" className="logo" />
      
      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search for books..."
        value={searchInput}
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        className="search-bar"
      />

      <ul>
        <li><a href="homeadmin">Home</a></li>
        <li><a href="digilibadmin">Manage Books</a></li>
        <li><a href="libadmin">Library</a></li>
        <li> <a href="profadmin"> Profile </a> </li>
        <li><button className="btn"><a href="login">Log Out</a></button></li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin;
