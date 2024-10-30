const express = require("express");
const router = express.Router();
const Donation = require("../Models/Donation");
const User = require("../Models/User");

// Get all donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donorID", "name email role") // Populate donor details with role filter
      .populate("recipientID", "name location role") // Populate recipient details with role filter
      .populate("volunteerID", "name serviceType role"); // Populate volunteer details with role filter
    res.status(200).json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get donations by donorID
router.get("/donor/:donorID", async (req, res) => {
  const { donorID } = req.params;
  try {
    const donations = await Donation.find({ donorID }).populate(
      "donorID",
      "name email role"
    );
    if (!donations.length) {
      return res
        .status(404)
        .json({ message: "No donations found for this donor." });
    }
    res.status(200).json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a donation
router.post("/create", async (req, res) => {
  const {donorID, recipientID, volunteerID, amountDonated } = req.body;
  console.log(req.body)
  try {
    // Validate that donor, recipient, and volunteer exist and have the correct roles
    const donor = await User.findOne({ id: donorID, role: "Donor" });
    console.log(donor)
    

    const recipient = await User.findOne({
      id: recipientID,
      role: "Recipient",
    });
    
    const volunteer = await User.findOne({
      id: volunteerID,
      role: "Volunteer",
    });
  

    // Create the donation
    const donation = new Donation({
      donorID,
      recipientID,
      volunteerID,
      amountDonated,
    });

    await donation.save();
    res
      .status(201)
      .json({ message: "Donation created successfully", donation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a donation by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete donation" });
  }
});

module.exports = router;
