// food_donation_frontend/src/pages/AddDonation.js

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const AddDonation = () => {
  const [amount, setAmount] = useState("");
  const [recipientID, setRecipientID] = useState(null);
  const [volunteerID, setVolunteerID] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donorID, setDonorID] = useState(() => {
    const storedDonor = localStorage.getItem("user");
    return storedDonor ? JSON.parse(storedDonor).userid : null;
  });
  const [recipientImage, setRecipientImage] = useState(
    "https://via.placeholder.com/400x200"
  );
  const [volunteerImage, setVolunteerImage] = useState(
    "https://via.placeholder.com/400x200"
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const recipientData = await axios.get(
          "http://localhost:5000/api/users?role=Recipient"
        );
        const volunteerData = await axios.get(
          "http://localhost:5000/api/users?role=Volunteer"
        );

        setRecipients(
          recipientData.data.filter((user) => user.role === "Recipient")
        );
        setVolunteers(
          volunteerData.data.filter((user) => user.role === "Volunteer")
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = async (userId, setUserImage) => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );
      const user = response.data;
      setUserImage(
        user.image
          ? `http://localhost:5000${user.image}`
          : "https://via.placeholder.com/400x200"
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationData = {
      donorID: parseInt(donorID, 10),
      recipientID: parseInt(recipientID, 10),
      volunteerID: parseInt(volunteerID, 10),
      amountDonated: parseInt(amount, 10),
      status: "pending",
      recipientStatus: "pending",
      volunteerStatus: "pending",
    };

    // Log data to verify
    console.log("Donation data:", donationData);

    // Ensure all values are valid integers
    if (
      isNaN(donationData.donorID) ||
      isNaN(donationData.recipientID) ||
      isNaN(donationData.volunteerID) ||
      isNaN(donationData.amountDonated)
    ) {
      console.error(
        "Invalid data: Ensure all fields are properly filled in with integers."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/donations/create",
        donationData
      );
      if (response.status === 201) {
        alert(
          "Donation created successfully! Waiting for recipient and volunteer approval."
        );
        // Clear form
        setAmount("");
        setRecipientID(null);
        setVolunteerID(null);
        setRecipientImage("https://via.placeholder.com/400x200");
        setVolunteerImage("https://via.placeholder.com/400x200");
      }
    } catch (error) {
      console.error("Error creating donation:", error);
      alert("Error creating donation. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <img
              src={recipientImage}
              alt="Recipient"
              className="card-img-top"
            />
            <div className="card-body">
              <select
                className="form-select"
                value={recipientID || ""}
                onChange={(e) => {
                  setRecipientID(parseInt(e.target.value, 10));
                  handleUserSelect(e.target.value, setRecipientImage);
                }}
              >
                <option value="">Choose recipient</option>
                {recipients.map((recipient) => (
                  <option key={recipient.userid} value={recipient.userid}>
                    {recipient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <img
              src={volunteerImage}
              alt="Volunteer"
              className="card-img-top"
            />
            <div className="card-body">
              <select
                className="form-select"
                value={volunteerID || ""}
                onChange={(e) => {
                  setVolunteerID(parseInt(e.target.value, 10));
                  handleUserSelect(e.target.value, setVolunteerImage);
                }}
              >
                <option value="">Choose volunteer</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.userid} value={volunteer.userid}>
                    {volunteer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <div className="card-body">
              <input
                type="number"
                className="form-control"
                placeholder="Enter donation amount"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value, 10) || "")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <button
            className="btn btn-warning w-100"
            style={{ color: "white", fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDonation;
