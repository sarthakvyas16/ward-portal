const mongoose = require("mongoose");

const wardTeamSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "ward-team",
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WardTeam", wardTeamSchema);