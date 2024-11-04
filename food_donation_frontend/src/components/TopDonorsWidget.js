// TopDonorsWidget.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopDonorWidget.css";

const TopDonorsWidget = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5001/api/donations/top-donors"
        );

        // Map over the donors and construct proper image URLs
        const donorsWithImages = response.data.map((donor) => ({
          ...donor,
          // If donor has an image path, construct full URL, otherwise use placeholder
          imageUrl: donor.image
            ? `http://localhost:5001${donor.image}`
            : "https://via.placeholder.com/50",
        }));

        setTopDonors(donorsWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top donors:", error);
        setError("Failed to load top donors");
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <h3 className="text-white">Loading top donors...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <h3 className="text-white">Error: {error}</h3>
      </div>
    );
  }

  return (
    <div className="widget">
      <h3 className="text-white mb-4">Top Donors of the Month</h3>
      <div className="donors-grid">
        {topDonors.map((donor, index) => (
          <div key={donor.donorEmail || index} className="donor-card">
            <div className="donor-image-container">
              <img
                src={donor.imageUrl}
                alt={donor.donorName}
                className="donor-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/50";
                }}
              />
              {index < 3 && (
                <div className={`donor-rank rank-${index + 1}`}>
                  #{index + 1}
                </div>
              )}
            </div>
            <div className="donor-info">
              <h4 className="donor-name">{donor.donorName}</h4>
              <p className="donor-stats">
                Donated: {donor.totalAmount} bags
                <br />
                Total Donations: {donor.count}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDonorsWidget;
