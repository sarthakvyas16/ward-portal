const express = require("express");
const router = express.Router();

const WardTeam = require("../models/WardTeam");
const authMiddleware = require("../middleware/authMiddleware");

// GET: Ward Team public rahegi (sab dekh sakte hain)
router.get("/", async (req, res) => {
  try {
    const wardTeam = await WardTeam.findOne({ key: "ward-team" });

    res.json({
      success: true,
      data: wardTeam ? wardTeam.data : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ward team fetch failed",
    });
  }
});

// PUT: Sirf authenticated admin save/update kar sakta hai
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Valid ward team data required",
      });
    }

    const wardTeam = await WardTeam.findOneAndUpdate(
      { key: "ward-team" },
      { $set: { data } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: wardTeam.data,
      message: "Ward team saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ward team save failed",
    });
  }
});

module.exports = router;