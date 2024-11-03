// TopVolunteersWidget.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopDonorWidget.css"; // Reusing the same CSS

const TopVolunteersWidget = () => {
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopVolunteers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/donations/top-volunteers"
        );

        // Map over the volunteers and construct proper image URLs
        const volunteersWithImages = response.data.map((volunteer) => ({
          ...volunteer,
          imageUrl: volunteer.image
            ? `http://localhost:5000${volunteer.image}`
            : "https://via.placeholder.com/50",
        }));

        setTopVolunteers(volunteersWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top volunteers:", error);
        setError("Failed to load top volunteers");
        setLoading(false);
      }
    };

    fetchTopVolunteers();
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <h3 className="text-white">Loading top volunteers...</h3>
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
      <h3 className="text-white mb-4">Top Volunteers of the Month</h3>
      <div className="donors-grid">
        {topVolunteers.map((volunteer, index) => (
          <div key={volunteer.volunteerEmail || index} className="donor-card">
            <div className="donor-image-container">
              <img
                src={volunteer.imageUrl}
                alt={volunteer.volunteerName}
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
              <h4 className="donor-name">{volunteer.volunteerName}</h4>
              <p className="donor-stats">
                Deliveries: {volunteer.totalDeliveries}
                <br />
                Success Rate: {volunteer.successRate.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopVolunteersWidget;
