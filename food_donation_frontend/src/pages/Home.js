import React from "react";
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
  // Data for the bar chart
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

  // Data for the doughnut charts
  const doughnutData = {
    datasets: [
      {
        data: [70, 30], // Example data (e.g., 70% goal reached)
        backgroundColor: ["orange", "white"],
        hoverBackgroundColor: ["orange", "white"],
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
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

        {/* About Us and Reasons to Donate Section */}
        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">About us</h5>
            <p className="text-white text-center">
              ShareABite is a food donation platform dedicated to reducing food
              waste and fighting hunger by connecting donors with recipients in
              need. The platform also engages volunteers to facilitate the
              collection and distribution of surplus food to local communities.
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
              Support local communities: Donations strengthen community bonds by
              providing resources to those in need, fostering a sense of
              solidarity.
            </p>
          </div>
        </div>

        {/* Monthly Goal and Year Goal */}
        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">Monthly Goal</h5>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div
            className="card p-3"
            style={{ backgroundColor: "#4CAF50", borderRadius: "10px" }}
          >
            <h5 className="text-center text-white mb-2">Year Goal</h5>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
