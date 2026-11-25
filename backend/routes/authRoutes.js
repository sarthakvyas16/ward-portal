const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST: Admin Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Username received:", username);
console.log("Admin username configured:", !!process.env.ADMIN_USERNAME);
console.log("Admin password configured:", !!process.env.ADMIN_PASSWORD);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    const isPasswordValid = await bcrypt.compare(
      password,
      passwordHash
    );

    const isUsernameValid =
      username === process.env.ADMIN_USERNAME;

    if (!isUsernameValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

module.exports = router;