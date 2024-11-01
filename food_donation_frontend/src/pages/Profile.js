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
import './Profile.css'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [donations, setDonations] = useState([]);
  const [recipients, setRecipients] = useState({});
  const [volunteers, setVolunteers] = useState({});

  useEffect(() => {
    const fetchDonations = async () => {
      if (user && user.userid) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/donations/${user.userid}`
          );
          const data = await response.json();
          setDonations(data);
          fetchUsersDetails(data);
        } catch (error) {
          console.error("Error fetching donations:", error);
        }
      }
    };

    fetchDonations();
  }, [user]);

  const fetchUsersDetails = async (donations) => {
    const recipientIDs = [...new Set(donations.map((d) => d.recipientID))];
    const volunteerIDs = [...new Set(donations.map((d) => d.volunteerID))];

    const recipientPromises = recipientIDs.map((id) =>
      fetch(`http://localhost:5000/api/users/${id}`).then((res) => res.json())
    );
    const volunteerPromises = volunteerIDs.map((id) =>
      fetch(`http://localhost:5000/api/users/${id}`).then((res) => res.json())
    );

    const recipientData = await Promise.all(recipientPromises);
    const volunteerData = await Promise.all(volunteerPromises);

    const recipientMap = {};
    recipientData.forEach((user) => {
      recipientMap[user.userid] = user.name;
    });
    setRecipients(recipientMap);

    const volunteerMap = {};
    volunteerData.forEach((user) => {
      volunteerMap[user.userid] = user.name;
    });
    setVolunteers(volunteerMap);
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Total amount donated",
        data: [50, 80, 60, 90, 70, 60, 100, 70, 85],
        backgroundColor: "orange",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // User information update handler
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      console.error("User or user ID is not defined.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser.updatedUser));
        alert("User information updated successfully!");
      } else {
        console.error("Error updating user:", response.statusText);
        alert("Failed to update user information.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Side - Recent Donations and Summary Cards */}
        <div className="col-md-12">
          <div className="row justify-content-center mb-4">
            <h3 className="text-center">Recent Donations</h3>
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                      <th>Recipient</th>
                      <th>Volunteer</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: "#4CAF50", color: "white" }}
                      >
                        <td>{recipients[donation.recipientID] || "Unknown"}</td>
                        <td>{volunteers[donation.volunteerID] || "Unknown"}</td>
                        <td>{donation.amountDonated} bags of food</td>
                        <td>
                          <button className="btn btn-light">
                            <i className="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-3">
              <div
                className="card p-3"
                style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
              >
                <h5 className="text-center text-white mb-2">
                  How much have you donated
                </h5>
                <p className="text-white text-center">
                  Amount Donated: 3000 bags of food <br />
                  Children fed: 6000 children
                </p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div
                className="card p-3"
                style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
              >
                <h5 className="text-center text-white mb-2">
                  Donations so far in the year
                </h5>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side - Update User Information */}
      <div className="col-md-4">
        <h3>Update User Information</h3>
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
              type="text"
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
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
