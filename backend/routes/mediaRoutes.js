const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cloudinary = require("../cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../temp_uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
});

router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "File size cannot exceed 100MB",
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Upload error",
        });
      }

      next();
    });
  },
  async (req, res) => {
    let tempFilePath = req.file?.path;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const isVideo = req.file.mimetype.startsWith("video/");
      const maxSize = isVideo
        ? 100 * 1024 * 1024
        : 15 * 1024 * 1024;

      if (req.file.size > maxSize) {
        return res.status(413).json({
          success: false,
          message: isVideo
            ? "Video size cannot exceed 100MB"
            : "Photo size cannot exceed 15MB",
        });
      }

      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "ward-portal/development",
        resource_type: "auto",
        timeout: 120000,
      });

      return res.status(200).json({
        success: true,
        message: "Media uploaded successfully",
        media: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error("Media upload error:", error);

      return res.status(500).json({
        success: false,
        message: "Media upload failed",
      });
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error("Temporary file cleanup failed:", err);
        });
      }
    }
  }
);


// POST /api/media/delete
router.post("/delete", authMiddleware, async (req, res) => {
  try {
    const { publicId, resourceType } = req.body;

    if (!publicId || !resourceType) {
      return res.status(400).json({
        success: false,
        message: "publicId and resourceType are required",
      });
    }

    if (!["image", "video"].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media resource type",
      });
    }

    // Only allow deletion from our Development media folder
    if (!publicId.startsWith("ward-portal/development/")) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized media deletion",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({
        success: false,
        message: "Cloudinary deletion failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      result: result.result,
    });
  } catch (error) {
    console.error("Media deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Media deletion failed",
    });
  }
});

module.exports = router;


