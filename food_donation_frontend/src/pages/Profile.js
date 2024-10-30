import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
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

  return (
    <div className="container mt-5">
      {/* Recent Donations Table */}
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
                {[1, 2, 3].map((_, index) => (
                  <tr
                    key={index}
                    style={{ backgroundColor: "#4CAF50", color: "white" }}
                  >
                    <td>Charity 1</td>
                    <td>Delivery Service 1</td>
                    <td>500 bags of food</td>
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

      {/* Summary Cards */}
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
  );
};

export default Profile;
