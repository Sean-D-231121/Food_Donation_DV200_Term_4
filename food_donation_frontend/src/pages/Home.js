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
const Home = () => {
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const monthlyGoal = 20000; // Example monthly goal
  const yearlyGoal = 200000; // Example yearly goal
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    // Fetch monthly donation totals
    fetch("http://localhost:5000/api/donations/monthlyTotals")
      .then((response) => response.json())
      .then((data) => {
        const amounts = Array(12).fill(0);
        data.forEach((item) => (amounts[item._id - 1] = item.totalAmount)); // Assign to each month
        setMonthlyDonations(amounts);

        // Calculate the yearly total
        setTotalDonations(amounts.reduce((sum, amount) => sum + amount, 0));
      })
      .catch((error) => console.error("Error fetching donation data:", error));
  }, []);

  // Data for the bar chart
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
        label: "Total amount donated",
        data: monthlyDonations,
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

  // Doughnut chart for the monthly goal
  const doughnutDataMonthly = {
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

  // Doughnut chart for the yearly goal
  const doughnutDataYearly = {
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

  return (
    <div className="container mt-5">
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
          <div className="col-md-6 mb-3">
            <div
              className="card p-3"
              style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
            >
              <h5 className="text-center text-white mb-2">About us</h5>
              <p className="text-white text-center">
                ShareABite is a food donation platform dedicated to reducing
                food waste and fighting hunger by connecting donors with
                recipients in need. The platform also engages volunteers to
                facilitate the collection and distribution of surplus food to
                local communities.
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-3">
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
            <Doughnut
              data={doughnutDataMonthly}
              options={{
                cutout: "70%",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">Year Goal</h5>
            <Doughnut
              data={doughnutDataYearly}
              options={{
                cutout: "70%",
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
      <TopDonorsWidget />
    </div>
  );
};

export default Home;

