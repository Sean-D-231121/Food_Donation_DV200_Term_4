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
    const status = req.query.status || "accepted"; // Default to 'accepted' if not specified
    const monthlyTotals = await Donation.aggregate([
      { $match: { status: status } },
      {
        $group: {
          _id: { $month: "$dateDonated" },
          totalAmount: { $sum: "$amountDonated" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
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
          status: "accepted", // Only include accepted donations
          dateDonated: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: "$donorID",
          totalAmount: { $sum: "$amountDonated" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "userid",
          as: "donorInfo",
        },
      },
      {
        $unwind: "$donorInfo",
      },
      {
        $project: {
          donorName: "$donorInfo.name",
          donorEmail: "$donorInfo.email",
          image: "$donorInfo.image",
          totalAmount: 1,
          count: 1,
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(topDonors);
  } catch (err) {
    console.error("Error in /top-donors:", err);
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
// Backend/Routes/DonationRoutes.js
// Add these new routes to your existing file

// Update donation status
router.patch("/status/:donationid", async (req, res) => {
  try {
    const { donationid } = req.params;
    const { status, userRole, userID } = req.body;

    const donation = await Donation.findOne({ donationid });
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (userRole === "Recipient" && parseInt(userID) === donation.recipientID) {
      donation.recipientStatus = status;
    } else if (userRole === "Volunteer" && parseInt(userID) === donation.volunteerID) {
      donation.volunteerStatus = status;
    } else {
      return res.status(403).json({ message: "Unauthorized to update this donation" });
    }

    // Update overall status if both recipient and volunteer have accepted
    if (donation.recipientStatus === 'accepted' && donation.volunteerStatus === 'accepted') {
      donation.status = 'accepted';
    } else if (donation.recipientStatus === 'declined' || donation.volunteerStatus === 'declined') {
      donation.status = 'declined';
    }

    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Backend/Routes/DonationRoutes.js

// Add these new routes
router.get("/recipient/:recipientID", async (req, res) => {
  const { recipientID } = req.params;
  try {
    const donations = await Donation.find({ recipientID });
    res.status(200).json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/volunteer/:volunteerID", async (req, res) => {
  const { volunteerID } = req.params;
  try {
    const donations = await Donation.find({ volunteerID });
    res.status(200).json(donations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Add to DonationRoutes.js
// In Backend/Routes/DonationRoutes.js

// Add this new route for top volunteers
router.get("/top-volunteers", async (req, res) => {
  try {
    const topVolunteers = await Donation.aggregate([
      {
        $match: {
          dateDonated: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: "$volunteerID",
          totalDeliveries: { $sum: 1 },
          successfulDeliveries: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "userid",
          as: "volunteerInfo",
        },
      },
      {
        $unwind: "$volunteerInfo",
      },
      {
        $match: {
          "volunteerInfo.role": "Volunteer"
        }
      },
      {
        $project: {
          volunteerName: "$volunteerInfo.name",
          volunteerEmail: "$volunteerInfo.email",
          image: "$volunteerInfo.image",
          totalDeliveries: 1,
          successfulDeliveries: 1,
          successRate: {
            $multiply: [
              {
                $cond: [
                  { $eq: ["$totalDeliveries", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$successfulDeliveries", "$totalDeliveries"] },
                      100
                    ]
                  }
                ]
              },
              1
            ]
          }
        },
      },
      { $sort: { totalDeliveries: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(topVolunteers);
  } catch (err) {
    console.error("Error in /top-volunteers:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

