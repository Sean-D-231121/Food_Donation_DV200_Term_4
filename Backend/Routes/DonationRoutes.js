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
    
      const donationCount = await Donation.countDocuments(); 
      console.log(donationCount)
    // Create the donation
    const donation = new Donation({
      donationid: donationCount + 1,
      donorID,
      recipientID,
      volunteerID,
      amountDonated,
    });
    
    await donation.save();
    
    res
      .status(201)
      .json({ message: "Donation created successfully", donation });
      console.log(donation);
  } catch (err) {
    
    res.status(400).json({ error: err.message });
  }
});

// Delete a donation by ID
router.delete("/delete/:donationid", async (req, res) => {
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


// Get total donation amount per month
router.get("/monthlyTotals", async (req, res) => {
  try {
    const monthlyTotals = await Donation.aggregate([
      {
        $group: {
          _id: { $month: "$dateDonated" },
          totalAmount: { $sum: "$amountDonated" },
        },
      },
      { $sort: { "_id": 1 } } // Sort by month
    ]);

    res.status(200).json(monthlyTotals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get top donors of the current month
router.get("/top-donors", async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $match: {
          dateDonated: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of the month
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) // Start of the next month
          }
        }
      },
      {
        $group: {
          _id: "$donorID",
          totalAmount: { $sum: "$amountDonated" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users", // The name of the users collection
          localField: "_id",
          foreignField: "id",
          as: "donorInfo"
        }
      },
      {
        $unwind: "$donorInfo"
      },
      {
        $project: {
          donorName: "$donorInfo.name",
          donorEmail: "$donorInfo.email",
          totalAmount: 1,
          count: 1
        }
      },
      { $sort: { totalAmount: -1 } }, // Sort by total amount donated
      { $limit: 5 } // Get top 5 donors
    ]);

    res.status(200).json(topDonors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get most donated items
router.get("/most-donated-items", async (req, res) => {
  try {
    const mostDonatedItems = await Donation.aggregate([
      {
        $group: {
          _id: "$item", // Assuming there's an 'item' field in the Donation schema
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amountDonated" }
        }
      },
      { $sort: { totalCount: -1 } }, // Sort by count
      { $limit: 5 } // Get top 5 items
    ]);

    res.status(200).json(mostDonatedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get the last five donations for a user by donorID
router.get("/:donorID", async (req, res) => {
  const { donorID } = req.params;
  try {
    const donations = await Donation.find({ donorID })
      .sort({ dateDonated: -1 }) // Assuming you have a date field to sort by
      .limit(5)
      .populate("donorID", "name")
      .populate("recipientID", "name")
      .populate("volunteerID", "name");

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



module.exports = router;

