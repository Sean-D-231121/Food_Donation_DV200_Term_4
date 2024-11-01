import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

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
    setUser(null); // Clear user from state
    navigate("/SignIn"); // Redirect to sign-in page
  };

  return (
    <nav className="navbar navbar-expand-lg Navbar-background">
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

          {/* Right side of the navbar: Display user info and logout */}
          {user && (
            <div className="d-flex align-items-center">
              <span className="me-3">{user.name}</span>
              {user.image && (
                <img
                  src={user.image}
                  alt="User Avatar"
                  className="me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
