import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Ensures navigation works
import '../CSS FOLDER/Navbar.css';
import logo from '../../assets/logo.png';

const NavbarAdmin = () => {
  const [sticky, setSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setSticky(window.scrollY > 50);
    });
  }, []);

  return (
    <nav className={`container ${sticky ? "dark-nav" : ""}`}>
      <img src={logo} alt="Logo" className="logo" />
      <ul style={styles.navList}>
        <li>
          <button style={styles.btn}><a href="login" style={styles.link}>Log Out</a></button>
        </li>
      </ul>
    </nav>
  );
};

// Inline styles
const styles = {
  navList: {
    display: "flex",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-end", // Aligns the items to the right
    gap: "20px", // Adds spacing between the items
  },
  btn: {
    backgroundColor: "#8E735B", // Brown background
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  // Hover effect for the button
  btnHover: {
    backgroundColor: "#6A4E3D", // Darker brown on hover
  },
};

export default NavbarAdmin;
