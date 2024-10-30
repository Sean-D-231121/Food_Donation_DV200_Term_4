const express = require("express");
const router = express.Router();
const DonationMetrics = require("../Models/DonationMetrics");

// Get all donation metrics
router.get("/", async (req, res) => {
  try {
    const metrics = await DonationMetrics.find();
    res.status(200).json(metrics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get metrics by month and year
router.get("/:month/:year", async (req, res) => {
  const { month, year } = req.params;
  try {
    const metrics = await DonationMetrics.findOne({ month, year });
    if (!metrics) {
      return res
        .status(404)
        .json({ message: "Metrics not found for this period." });
    }
    res.status(200).json(metrics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create new donation metrics
router.post("/create", async (req, res) => {
  const {
    month,
    year,
    totalDonated,
    monthlyGoal,
    yearlyGoal,
    totalYearlyDonated,
  } = req.body;
  try {
    const metrics = new DonationMetrics({
      month,
      year,
      totalDonated,
      monthlyGoal,
      yearlyGoal,
      totalYearlyDonated,
    });
    await metrics.save();
    res.status(201).json(metrics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
