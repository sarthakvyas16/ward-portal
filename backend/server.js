const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const wardTeamRoutes = require("./routes/wardTeamRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ward-team", wardTeamRoutes);
app.use("/api/auth", authRoutes);

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