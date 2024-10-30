const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Donor", "Volunteer", "Recipient"],
    required: true,
  },
  image: { type: String, required: false }, // Image URL or path in the server
});

module.exports = mongoose.model("User", userSchema);
