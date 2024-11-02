const express = require("express");
const multer = require("multer");
const User = require("../Models/User");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Relative path from project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Sign in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: "Sign in successful", user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Sign in failed" });
  }
});

// Register a new user
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // Generate `userid` by counting documents + 1
    const userCount = await User.countDocuments();

    const user = new User({
      userid: userCount + 1, // Use this as the unique identifier
      name,
      email,
      phone,
      password,
      role,
      image: imagePath,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Error creating user", error });
  }
});

// Get a user by userid
router.get("/:userid", async (req, res) => {
  try {
    const user = await User.findOne({ userid: req.params.userid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Update a user by userid
router.put("/:userid", upload.single("image"), async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const updatedUser = await User.findOneAndUpdate(
      { userid: req.params.userid },
      {
        name,
        email,
        phone,
        password,
        role,
        image: imagePath,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// Delete a user by userid
router.delete("/:userid", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ userid: req.params.userid });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = router;
