const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  id: { type: String, required: false },
  type: { type: String, required: true }, // 'monthly' or 'yearly'
  targetAmount: { type: Number, required: true }, // Target donation amount
  achievedAmount: { type: Number, required: false, default: 0 }, // Tracks the achieved amount so far
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  entryDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", goalSchema);
