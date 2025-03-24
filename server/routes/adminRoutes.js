const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Employee
router.post("/create-employee", protect, adminOnly, async (req, res) => {
  const { name, email, password, dateOfJoining, department, profileImage } = req.body;

  if (!name || !email || !password || !dateOfJoining || !department) {
    return res.status(400).json({ message: "All fields except profile image are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      admin: req.user._id,
      dateOfJoining: new Date(dateOfJoining),
      department: department.trim(),
      profileImage: profileImage || "",
    });

    await employee.save();
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
});

// Get Employees
router.get("/employees", protect, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ admin: req.user._id, role: "employee" }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
});

// Delete Employee
router.delete("/employees/:id", protect, adminOnly, async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Check if employee exists and belongs to this admin
    const employee = await User.findOne({ 
      _id: employeeId, 
      role: "employee", 
      admin: req.user._id 
    });

    if (!employee) {
      return res.status(404).json({ 
        message: "Employee not found or you don't have permission to delete this employee" 
      });
    }

    // Delete the employee
    await User.findByIdAndDelete(employeeId);

    res.status(200).json({ 
      message: "Employee deleted successfully", 
      employeeId 
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ 
      message: "Error deleting employee", 
      error: error.message 
    });
  }
});
module.exports = router;
