const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

const router = express.Router();

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });

// Get Employee Profile
router.get("/profile", protect, async (req, res) => {
  try {
    const employee = await User.findById(req.user._id).select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Upload Employee Profile Image
router.post("/upload-image", protect, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "employee") {
      return res.status(403).json({ message: "Only employees can upload profile images" });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    
    // Upload image to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "employee_profiles" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    
    const result = await streamUpload(req.file.buffer);
    
    // Update User Profile Image
    await User.findByIdAndUpdate(req.user._id, { profileImage: result.secure_url });
    
    res.status(200).json({ message: "Profile image updated successfully", profileImage: result.secure_url });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});


module.exports = router;