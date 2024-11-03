// Navbar.js
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import logo from "../assets/Logo.png";
const Navbar = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const showNavBar =
    location.pathname === "/Home" ||
    location.pathname === "/Profile" ||
    location.pathname === "/AddDonation";

  if (!showNavBar) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/Home">
          <img
            src={logo}
            alt="FoodShare Connect Logo"
            height="40"
            className="me-2"
          />
          
        </Link>

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/Home" ? "active" : ""
                }`}
                to="/Home"
              >
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/Profile" ? "active" : ""
                }`}
                to="/Profile"
              >
                <i className="fas fa-user me-1"></i> Profile
              </Link>
            </li>
            {/* Only show AddDonation link for Donor users */}
            {user && user.role === "Donor" && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/AddDonation" ? "active" : ""
                  }`}
                  to="/AddDonation"
                >
                  <i className="fas fa-plus-circle me-1"></i> Add Donation
                </Link>
              </li>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center user-section">
              <span className="user-name me-3">{user.name}</span>
              {user.image && (
                <img
                  src={`http://localhost:5000${user.image}`}
                  alt="User Avatar"
                  className="user-avatar me-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
              )}
              <button className="btn btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
