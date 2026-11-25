const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  resourceType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  format: {
    type: String,
    default: "",
  },
  originalName: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 0,
  },
});

const developmentSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },

    // Cover photo
    cover: {
      type: mediaSchema,
      default: null,
    },

    // Multiple project photos
    photos: {
      type: [mediaSchema],
      default: [],
    },

    // Multiple project videos
    videos: {
      type: [mediaSchema],
      default: [],
    },

    // Legacy media field — old records preserved
    media: {
      type: [mediaSchema],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Development", developmentSchema);