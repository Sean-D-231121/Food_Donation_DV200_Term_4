import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    image: null,
  });
  const [error, setError] = useState(null);
    const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("password", formData.password);
    formDataObj.append("role", formData.role);
    if (formData.image) formDataObj.append("image", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/register",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate("/");

      // Redirect to login or another page if needed
    } catch (error) {
      console.error("Error during signup", error);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "10px",
          backgroundColor: "#4CAF50",
        }}
      >
        <div className="card-body">
          <h3 className="text-center text-white mb-4">Welcome Back!</h3>
          <h5 className="text-center text-white mb-4">Sign Up</h5>

          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group mb-3">
              <label className="text-white">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group mb-3">
              <label className="text-white">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group mb-3">
              <label className="text-white">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group mb-3">
              <label className="text-white">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group mb-3">
              <label className="text-white">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group mb-3">
              <label className="text-white">Select Role</label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Choose your role</option>
                <option value="Donor">Donor</option>
                <option value="Recipient">Recipient</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="form-group mb-3">
              <label className="text-white">Upload Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-warning text-white">
                Sign Up
              </button>
            </div>

            {/* Already have an account */}
            <div className="text-center">
              <span className="text-white">Already have an account? </span>
              <a href="/" className="text-warning">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
