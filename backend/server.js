const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const wardTeamRoutes = require("./routes/wardTeamRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const developmentRoutes = require("./routes/developmentRoutes");



const app = express();

app.use(cors());

// Increased limit for Base64 member photos
app.use(express.json({ limit: "15mb" }));

app.use("/api/ward-team", wardTeamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/development", developmentRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ward Portal Backend is running!",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});