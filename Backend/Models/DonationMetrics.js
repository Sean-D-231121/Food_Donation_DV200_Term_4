const mongoose = require("mongoose");

const donationMetricsSchema = new mongoose.Schema({
  id: { type: String, required: false },
  month: { type: String, required: true }, // E.g., "January", "February"
  year: { type: Number, required: true },
  totalDonated: { type: Number, required: true }, // Total amount donated in the month
  monthlyGoal: { type: Number, required: true }, // Monthly goal for donations
  yearlyGoal: { type: Number, required: true }, // Yearly goal for donations
  totalYearlyDonated: { type: Number, required: true }, // Total amount donated in the year
  entryDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DonationMetrics", donationMetricsSchema);
