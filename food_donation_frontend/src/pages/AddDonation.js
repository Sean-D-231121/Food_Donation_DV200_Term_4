import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // For fetching data

const AddDonation = ({ donorID }) => {
  const [place, setPlace] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientID, setRecipientID] = useState("");
  const [volunteerID, setVolunteerID] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // Fetch donors, recipients, and volunteers from the server
    const fetchUsers = async () => {
      const recipientData = await axios.get(
        "http://localhost:5000/api/users?role=Recipient"
      );
      const volunteerData = await axios.get(
        "http://localhost:5000/api/users?role=Volunteer"
      );

      setRecipients(recipientData.data);
      setVolunteers(volunteerData.data);
    };
    
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle the donation submission
    try {
      await axios.post("http://localhost:5000/api/donations/create", {
        donorID,
        recipientID,
        volunteerID,
        amountDonated: amount,
      });
      console.log("Donation successfully created");
    } catch (error) {
      console.error("Error creating donation:", error);
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
              src="https://via.placeholder.com/400x200"
              alt="Place"
              className="card-img-top"
            />
            <div className="card-body">
              <select
                className="form-select"
                value={recipientID}
                onChange={(e) => setRecipientID(e.target.value)}
              >
                <option>Choose recipient</option>
                {recipients.map((recipient) => (
                  <option key={recipient.id} value={recipient.id}>
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
              src="https://via.placeholder.com/400x200"
              alt="Service"
              className="card-img-top"
            />
            <div className="card-body">
              <select
                className="form-select"
                value={volunteerID}
                onChange={(e) => setVolunteerID(e.target.value)}
              >
                <option>Choose volunteer</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.id} value={volunteer.id}>
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
                onChange={(e) => setAmount(e.target.value)}
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
