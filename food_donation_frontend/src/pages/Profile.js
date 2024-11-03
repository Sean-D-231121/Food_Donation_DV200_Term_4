import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DonationManagement = ({ donation, user, onStatusUpdate }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "badge bg-success";
      case "declined":
        return "badge bg-danger";
      default:
        return "badge bg-warning";
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/donations/status/${donation.donationid}`,
        {
          status,
          userRole: user.role,
          userID: user.userid,
        }
      );
      onStatusUpdate(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const showActions = () => {
    if (user.role === "Donor") {
      return (
        <div className="text-muted">
          Waiting for recipient and volunteer approval
        </div>
      );
    } else if (
      user.role === "Recipient" &&
      donation.recipientStatus === "pending"
    ) {
      return (
        <div>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange("accepted")}
          >
            Accept Donation
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleStatusChange("declined")}
          >
            Decline Donation
          </button>
        </div>
      );
    } else if (
      user.role === "Volunteer" &&
      donation.volunteerStatus === "pending"
    ) {
      return (
        <div>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => handleStatusChange("accepted")}
          >
            Accept Delivery
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleStatusChange("declined")}
          >
            Decline Delivery
          </button>
        </div>
      );
    }
    return (
      <span className={getStatusBadgeClass(donation.status)}>
        {donation.status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="donation-details p-3 border rounded mb-2">
      <div className="row align-items-center">
        <div className="col">
          <h6>Donation #{donation.donationid}</h6>
          <p className="mb-1">Amount: {donation.amountDonated} bags</p>
          <p className="mb-1">
            Date: {new Date(donation.dateDonated).toLocaleDateString()}
          </p>
        </div>
        <div className="col-auto">{showActions()}</div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Donations",
        data: Array(12).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    image: null,
  });

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;

      try {
        // Construct the endpoint based on user role
        let endpoint;
        switch (user.role.toLowerCase()) {
          case "donor":
            endpoint = `http://localhost:5000/api/donations/donor/${user.userid}`;
            break;
          case "recipient":
            endpoint = `http://localhost:5000/api/donations/recipient/${user.userid}`;
            break;
          case "volunteer":
            endpoint = `http://localhost:5000/api/donations/volunteer/${user.userid}`;
            break;
          default:
            console.error("Invalid user role");
            return;
        }

        const response = await axios.get(endpoint);
        const donationsData = response.data;
        setDonations(donationsData);

        // Calculate total donations
        const total = donationsData.reduce(
          (sum, donation) => sum + donation.amountDonated,
          0
        );
        setTotalDonations(total);

        // Process monthly statistics
        const monthlyData = Array(12).fill(0);
        donationsData.forEach((donation) => {
          const month = new Date(donation.dateDonated).getMonth();
          monthlyData[month] += donation.amountDonated;
        });
        setMonthlyStats((prevStats) => ({
          ...prevStats,
          datasets: [
            {
              ...prevStats.datasets[0],
              data: monthlyData,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${user.userid}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUser(response.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleStatusUpdate = (updatedDonation) => {
    setDonations((prevDonations) =>
      prevDonations.map((donation) =>
        donation.donationid === updatedDonation.donationid
          ? updatedDonation
          : donation
      )
    );
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div
            className="card p-3"
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <h4>Update Profile</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-8">
          <div
            className="card p-3"
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <h4>Donations</h4>
            <ul className="list-group">
              {donations.map((donation) => (
                <li key={donation.donationid} className="list-group-item">
                  <DonationManagement
                    donation={donation}
                    user={user}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div
            className="card p-3 mt-3"
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <h4>Donation Statistics</h4>
            <p>Total Donations: {totalDonations} bags</p>
            <Bar data={monthlyStats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
