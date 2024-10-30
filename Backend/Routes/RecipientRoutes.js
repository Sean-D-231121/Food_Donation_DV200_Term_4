const express = require("express");
const router = express.Router();
const Recipient = require("../Models/Recipient");

// Get all recipients
router.get("/", async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.status(200).json(recipients);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve recipients" });
  }
});

// Get recipient by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipient = await Recipient.findById(id);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    res.status(200).json(recipient);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Create a new recipient
router.post("/create", async (req, res) => {
  const { name, location, contactPerson, contactPhone, image } = req.body;
  try {
    const recipient = new Recipient({
      name,
      location,
      contactPerson,
      contactPhone,
      image,
    });
    await recipient.save();
    res.status(201).json(recipient);
  } catch (err) {
    res.status(400).json({ error: "Error creating recipient" });
  }
});

// Delete recipient by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipient = await Recipient.findByIdAndDelete(id);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }
    res.status(200).json({ message: "Recipient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete recipient" });
  }
});

module.exports = router;
