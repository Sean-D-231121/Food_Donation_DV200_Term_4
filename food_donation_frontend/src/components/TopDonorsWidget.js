import React, { useEffect, useState } from "react";
import axios from "axios";
import './TopDonorWidget.css';
const TopDonorsWidget = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [mostDonatedItems, setMostDonatedItems] = useState([]);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/donations/top-donors"
        );
        setTopDonors(response.data);
      } catch (error) {
        console.error("Error fetching top donors:", error);
      }
    };

    // const fetchMostDonatedItems = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:5000/api/donations/most-donated-items"
    //     );
    //     setMostDonatedItems(response.data);
    //   } catch (error) {
    //     console.error("Error fetching most donated items:", error);
    //   }
    // };

    fetchTopDonors();
    // fetchMostDonatedItems();
  }, []);

  return (
    <div className="widget">
      <h3>Top Donors of the Month</h3>
      <ul>
        {topDonors.map((donor) => (
          <li key={donor.donorEmail}>
            {donor.donorName}: ${donor.totalAmount} ({donor.count} donations)
          </li>
        ))}
      </ul>

      {/* <h3>Most Donated Items</h3>
      <ul>
        {mostDonatedItems.map((item) => (
          <li key={item._id}>
            {item._id}: {item.totalCount} donated
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default TopDonorsWidget;
