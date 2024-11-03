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

  const getDonationStatus = () => {
    if (
      donation.recipientStatus === "declined" ||
      donation.volunteerStatus === "declined"
    ) {
      return "declined";
    } else if (
      donation.recipientStatus === "accepted" &&
      donation.volunteerStatus === "accepted"
    ) {
      return "accepted";
    } else {
      return "pending";
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

  const showDonorStatus = () => {
    return (
      <div className="status-container">
        <div className="status-row">
          <span className="status-label">Recipient Status:</span>
          <span className={getStatusBadgeClass(donation.recipientStatus)}>
            {donation.recipientStatus.toUpperCase()}
          </span>
        </div>
        <div className="status-row mt-2">
          <span className="status-label">Volunteer Status:</span>
          <span className={getStatusBadgeClass(donation.volunteerStatus)}>
            {donation.volunteerStatus.toUpperCase()}
          </span>
        </div>
        <div className="status-row mt-2">
          <span className="status-label">Overall Status:</span>
          <span className={getStatusBadgeClass(getDonationStatus())}>
            {getDonationStatus().toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  const showActions = () => {
    if (user.role === "Donor") {
      return showDonorStatus();
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
      <span className={getStatusBadgeClass(getDonationStatus())}>
        {getDonationStatus().toUpperCase()}
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
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [totalAcceptedDonations, setTotalAcceptedDonations] = useState(0);
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
        label: "Monthly Accepted Donations",
        data: Array(12).fill(0),
        backgroundColor: "rgba(76, 175, 80, 0.6)",
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
  if (user) {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      image: null,
    });
  }
}, [user]);
  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;

      try {
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

        // Filter accepted donations
        const accepted = donationsData.filter(
          (donation) =>
            donation.recipientStatus === "accepted" &&
            donation.volunteerStatus === "accepted"
        );
        setAcceptedDonations(accepted);

        // Calculate total accepted donations
        const total = accepted.reduce(
          (sum, donation) => sum + donation.amountDonated,
          0
        );
        setTotalAcceptedDonations(total);

        // Process monthly statistics for accepted donations
        const monthlyData = Array(12).fill(0);
        accepted.forEach((donation) => {
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
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      // Only append fields that have values
      if (formData.name) formDataObj.append("name", formData.name);
      if (formData.email) formDataObj.append("email", formData.email);
      if (formData.phone) formDataObj.append("phone", formData.phone);
      if (formData.image) formDataObj.append("image", formData.image);

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.userid}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local storage and state with new user data
      const updatedUser = response.data.updatedUser;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h2>Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
        <div className="col-md-8">
          <h2>Donations</h2>
          <div className="donation-list">
            {donations.map((donation) => (
              <DonationManagement
                key={donation.donationid}
                donation={donation}
                user={user}
                onStatusUpdate={(updatedDonation) => {
                  setDonations((prevDonations) =>
                    prevDonations.map((donation) =>
                      donation.donationid === updatedDonation.donationid
                        ? updatedDonation
                        : donation
                    )
                  );
                }}
              />
            ))}
          </div>
          <h2>Monthly Statistics</h2>
          <Bar data={monthlyStats} />
          <h2>Accepted Donations</h2>
          <p>Total Accepted Donations: {totalAcceptedDonations} bags</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
