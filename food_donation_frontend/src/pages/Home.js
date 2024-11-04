import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import TopDonorsWidget from "../components/TopDonorsWidget";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Hero Section Component
const HeroSection = () => {
  return (
    <div
      className="hero-section text-center mb-4"
      style={{
        backgroundColor: "#4CAF50",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <h1 className="text-white">Welcome to MealBridging!</h1>
      <p className="text-white text-center">
        Join MealBridging and become a hero in the fight against hunger!
        Our innovative platform bridges the gap between surplus food and empty
        plates, turning potential waste into nourishing meals. With just a few
        clicks, you can make a real difference in your community. Together,
        we're not just sharing food – we're sharing hope, one meal at a time.
        Ready to make an impact1
      </p>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-light me-2">Get Involved</button>
        <button className="btn btn-light">Profile</button>
      </div>
    </div>
  );
};
const Home = () => {
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const monthlyGoal = 20000;
  const yearlyGoal = 200000;
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    // Fetch monthly donation totals for accepted donations
    fetch("http://localhost:5001/api/donations/monthlyTotals?status=accepted")
      .then((response) => response.json())
      .then((data) => {
        const amounts = Array(12).fill(0);
        data.forEach((item) => (amounts[item._id - 1] = item.totalAmount));
        setMonthlyDonations(amounts);
        setTotalDonations(amounts.reduce((sum, amount) => sum + amount, 0));
      })
      .catch((error) => console.error("Error fetching donation data:", error));

    // Fetch top donors with their images (only for accepted donations)
    fetch("http://localhost:5001/api/donations/top-donors?status=accepted")
      .then((response) => response.json())
      .then((data) => setTopDonors(data))
      .catch((error) => console.error("Error fetching top donors:", error));
  }, []);

  // Bar chart configuration
  const barData = {
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
        label: "Monthly Donations (in bags)",
        data: monthlyDonations,
        backgroundColor: "orange",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Donation Overview",
        color: "white",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // Monthly goal doughnut chart
  const doughnutDataMonthly = {
    labels: ["Donated", "Remaining"],
    datasets: [
      {
        data: [
          Math.min(totalDonations, monthlyGoal),
          monthlyGoal - Math.min(totalDonations, monthlyGoal),
        ],
        backgroundColor: ["orange", "white"],
        hoverBackgroundColor: ["orange", "white"],
      },
    ],
  };

  // Yearly goal doughnut chart
  const doughnutDataYearly = {
    labels: ["Donated", "Remaining"],
    datasets: [
      {
        data: [
          Math.min(totalDonations, yearlyGoal),
          yearlyGoal - Math.min(totalDonations, yearlyGoal),
        ],
        backgroundColor: ["orange", "white"],
        hoverBackgroundColor: ["orange", "white"],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="container mt-5">
      <HeroSection />

      <div className="row justify-content-center">
        {/* Bar Chart Section */}
        <div className="col-12">
          <div
            className="card mb-4 p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="row">
          

          <div className="col-md-12 mb-3">
            <div
              className="card p-3"
              style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
            >
              <h5 className="text-center text-white mb-2">Reasons to donate</h5>
              <p className="text-white text-center">
                Fight hunger: Your donation directly helps individuals and
                families who struggle to access enough food. <br />
                Reduce food waste: By donating surplus food, you help minimize
                waste and contribute to environmental sustainability. <br />
                Support local communities: Donations strengthen community bonds
                by providing resources to those in need, fostering a sense of
                solidarity.
              </p>
            </div>
          </div>
        </div>

        {/* Monthly and Yearly Goal Sections */}
        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">Monthly Goal</h5>
            <Doughnut data={doughnutDataMonthly} options={doughnutOptions} />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">Year Goal</h5>
            <Doughnut data={doughnutDataYearly} options={doughnutOptions} />
          </div>
        </div>
      </div>
      <TopDonorsWidget />
    </div>
  );
};

export default Home;
