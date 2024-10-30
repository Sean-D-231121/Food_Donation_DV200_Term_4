const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Charity name or recipient institution
  location: { type: String, required: true }, // Address or location
  image: { type: String, required: false }, // Path or URL to the recipient's image
  contactPerson: { type: String, required: false },
  contactPhone: { type: String, required: false },
  entryDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipient", recipientSchema);
