const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donationid: {
    type: Number,
    required: true,
    unique: true
  },
  donorID: {
    type: Number,
    required: true,
  }, // Reference to the Donor
  recipientID: {
    type: Number,
    required: true,
  }, // Reference to the Recipient
  volunteerID: {
    type: Number,
    required: true,
  }, // Reference to the Volunteer
  amountDonated: { type: Number, required: true }, // Amount of food/items donated
  dateDonated: { type: Date, default: Date.now },
  entryDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
