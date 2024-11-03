// food_donation_frontend/src/components/DonationStatus.js
import React from "react";

const DonationStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "accepted":
        return "text-success";
      case "declined":
        return "text-danger";
      default:
        return "text-warning";
    }
  };

  return (
    <span className={`badge ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default DonationStatus;
