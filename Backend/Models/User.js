// User Schema
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true, required: true }, // Ensure `userid` is populated and unique
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Donor", "Volunteer", "Recipient"],
    required: true,
  },
  image: { type: String },
});

module.exports = mongoose.model("User", userSchema);
