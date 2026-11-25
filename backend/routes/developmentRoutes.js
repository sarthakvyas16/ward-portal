
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Development = require("../models/Development");
const authMiddleware = require("../middleware/authMiddleware");

const allowedStatuses = ["Planned", "In Progress", "Completed"];

function validateMedia(media, fieldName) {
  if (media === null && fieldName === "cover") return true;

  if (!Array.isArray(media) && fieldName !== "cover") {
    return false;
  }

  const items = fieldName === "cover" ? [media] : media;

  return items.every((item) => {
    return (
      item &&
      typeof item.url === "string" &&
      typeof item.publicId === "string" &&
      ["image", "video"].includes(item.resourceType)
    );
  });
}

// PUBLIC: Published development projects
router.get("/", async (req, res) => {
  try {
    const projects = await Development.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Public development fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Development projects load nahi ho paye.",
    });
  }
});

// ADMIN: All projects
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const projects = await Development.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Admin development fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Admin projects load nahi ho paye.",
    });
  }
});

// ADMIN: Create project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      area,
      title,
      description,
      date,
      status,
      cover,
      photos,
      videos,
      isPublished,
    } = req.body;

    if (
      typeof area !== "string" ||
      !area.trim() ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Area aur project title required hain.",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    if (cover !== undefined && !validateMedia(cover, "cover")) {
      return res.status(400).json({
        success: false,
        message: "Invalid cover media.",
      });
    }

    if (photos !== undefined && !validateMedia(photos, "photos")) {
      return res.status(400).json({
        success: false,
        message: "Invalid photo media.",
      });
    }

    if (videos !== undefined && !validateMedia(videos, "videos")) {
      return res.status(400).json({
        success: false,
        message: "Invalid video media.",
      });
    }

    if (
      isPublished !== undefined &&
      typeof isPublished !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isPublished must be true or false.",
      });
    }

    const project = await Development.create({
      area: area.trim(),
      title: title.trim(),
      description: description || "",
      date: date || "",
      status: status || "Planned",
      cover: cover || null,
      photos: photos || [],
      videos: videos || [],
      isPublished: isPublished ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Create development project error:", error);

    res.status(500).json({
      success: false,
      message: "Project create nahi ho paya.",
    });
  }
});

// ADMIN: Update project
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const allowedFields = [
      "area",
      "title",
      "description",
      "date",
      "status",
      "cover",
      "photos",
      "videos",
      "isPublished",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided.",
      });
    }

    if (
      updates.area !== undefined &&
      (typeof updates.area !== "string" || !updates.area.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project area.",
      });
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" || !updates.title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project title.",
      });
    }

    if (
      updates.status !== undefined &&
      !allowedStatuses.includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

    if (
      updates.cover !== undefined &&
      !validateMedia(updates.cover, "cover")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cover media.",
      });
    }

    if (
      updates.photos !== undefined &&
      !validateMedia(updates.photos, "photos")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid photos.",
      });
    }

    if (
      updates.videos !== undefined &&
      !validateMedia(updates.videos, "videos")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid videos.",
      });
    }

    if (
      updates.isPublished !== undefined &&
      typeof updates.isPublished !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isPublished must be true or false.",
      });
    }

    if (updates.area) updates.area = updates.area.trim();
    if (updates.title) updates.title = updates.title.trim();

    const project = await Development.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update development project error:", error);

    res.status(500).json({
      success: false,
      message: "Project update nahi ho paya.",
    });
  }
});

// ADMIN: Delete project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Development.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete development project error:", error);

    res.status(500).json({
      success: false,
      message: "Project delete nahi ho paya.",
    });
  }
});

module.exports = router;
