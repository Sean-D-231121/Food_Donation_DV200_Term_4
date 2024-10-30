import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ user }) => {
  const location = useLocation();
  const showNavBar =
    location.pathname === "/Home" ||
    location.pathname === "/Profile" ||
    location.pathname === "/AddDonation";

  if (!showNavBar) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/Home">
          DonationApp
        </Link>
        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/Home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/AddDonation">
                Add Donation
              </Link>
            </li>
          </ul>

          {/* Right side of the navbar: Display user info */}
          {user && (
            <div className="d-flex align-items-center">
              <span className="me-2">{user.username}</span>
              <img
                src={user.image}
                alt="User Avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
