const express = require("express");
const router = express.Router();
const Donor = require("../Models/Donor");
const bcrypt = require("bcrypt");

// Sign-in route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const donor = await Donor.findOne({
      $or: [{ email }, { username: email }], // Check for both email and username
    });

    if (!donor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user details (excluding password)
    res.status(200).json({
      username: donor.name,
      email: donor.email,
      image: donor.image || "default_image_url", // Set a default image if none exists
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
