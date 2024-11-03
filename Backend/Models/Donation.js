// Backend/Models/Donation.js
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donationid: {
    type: Number,
    required: true,
    unique: true,
  },
  donorID: {
    type: Number,
    required: true,
  },
  recipientID: {
    type: Number,
    required: true,
  },
  volunteerID: {
    type: Number,
    required: true,
  },
  amountDonated: { type: Number, required: true },
  dateDonated: { type: Date, default: Date.now },
  entryDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  recipientStatus: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  volunteerStatus: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
});

module.exports = mongoose.model("Donation", donationSchema);
