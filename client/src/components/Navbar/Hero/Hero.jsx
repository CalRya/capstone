import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../../CSS FOLDER/Hero.css";
import dark_arrow from "../../../assets/arrow.png";
import logo from "../../../assets/logo.png"; // Ensure you have a logo in assets

const Hero = () => {
  return (
    <div className="hero container">
      <div className="hero-content">
        {/* 🔥 Added Logo */}
        <img src={logo} alt="Library Logo" className="hero-logo" />

        <div className="hero-text">
          <h1>Welcome to Our Digital Library</h1>
          <p>
            Unlock a world of literature at your fingertips! Whether you're a
            passionate book lover, a student searching for academic resources,
            or simply curious, our library has something for you.
          </p>

          {/* ✅ Link Button to Library Page */}
          <Link to="/lib" className="btn">
            Explore More 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
