const express = require("express");
const router = express.Router();
const Volunteer = require("../Models/Volunteer");

// Get all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve volunteers" });
  }
});

// Get volunteer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Create a new volunteer
router.post("/create", async (req, res) => {
  const { name, serviceType, contactPhone } = req.body;
  try {
    const volunteer = new Volunteer({ name, serviceType, contactPhone });
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: "Error creating volunteer" });
  }
});

// Delete volunteer by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }
    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete volunteer" });
  }
});

module.exports = router;
