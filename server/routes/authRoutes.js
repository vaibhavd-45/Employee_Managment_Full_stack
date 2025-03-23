const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Admin Signup
router.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashedPassword, role: "admin" });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body; // Ensure role is passed in request
  
    try {
      // Find user by email and role
      const user = await User.findOne({ email, role });
      if (!user) return res.status(404).json({ message: "User not found or role mismatch" });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  });
  

module.exports = router;
