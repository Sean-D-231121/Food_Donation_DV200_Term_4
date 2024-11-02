const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from 'public'

// Verify JWT secret is loaded

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Import and use routes
const userRoutes = require("./Routes/UserRoutes");
app.use("/api/users", userRoutes);

const donationRoutes = require("./Routes/DonationRoutes");
app.use("/api/donations", donationRoutes);

const donationMetricsRoutes = require("./Routes/DonationMetricsRoutes");
app.use("/api/metrics", donationMetricsRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
