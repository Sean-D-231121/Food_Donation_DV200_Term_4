const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email should be unique for each donor
  phone: { type: String, required: false },
  image: { type: String, required: false }, // Path or URL to the donor's image
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }], // Array of donation references
  entryDate: { type: Date, default: Date.now },
  password: { type: String, required: true }, // Hashed password will be stored here
});

module.exports = mongoose.model("Donor", donorSchema);
