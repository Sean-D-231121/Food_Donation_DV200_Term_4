const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Volunteer or delivery service name
  serviceType: { type: String, required: true }, // E.g., delivery, packing
  image: { type: String, required: false }, // Path or URL to the volunteer's image
  contactPhone: { type: String, required: false },
  entryDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
