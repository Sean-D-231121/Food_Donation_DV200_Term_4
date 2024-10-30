const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Donor = require("../Models/Donor");

// Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve donors" });
  }
});

// Get a donor by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const donor = await Donor.findById(id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.status(200).json(donor);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Create a new donor
router.post("/create", async (req, res) => {
  const { name, email, phone, password, image } = req.body;
  try {
    // Check if email already exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const donor = new Donor({
      name,
      email,
      phone,
      image,
      password: hashedPassword,
    });

    await donor.save();
    res.status(201).json({ message: "Donor created successfully", donor });
  } catch (err) {
    res.status(400).json({ error: "Error creating donor" });
  }
});

// Delete a donor by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const donor = await Donor.findByIdAndDelete(id);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.status(200).json({ message: "Donor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete donor" });
  }
});

module.exports = router;
