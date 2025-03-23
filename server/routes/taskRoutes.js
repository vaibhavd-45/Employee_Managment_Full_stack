const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// 🔹 Get employees under the logged-in admin
router.get("/employees", protect, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ admin: req.user._id, role: "employee" }).select("name email");
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
});

// 🔹 Assign a task to an employee
router.post("/assign-task", protect, adminOnly, async (req, res) => {
    const { name, assignedTo, taskType, priority, estimatedTime, description } = req.body;
  
    if (!name || !assignedTo || !taskType || !priority || !estimatedTime || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const employee = await User.findById(assignedTo);
      if (!employee || employee.role !== "employee") {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const task = new Task({
        name,
        assignedTo,
        taskType,
        priority,
        estimatedTime,
        description,
        assignedBy: req.user._id, // Admin assigning the task
        status: "pending", // Default task status
      });
  
      await task.save();
      res.status(201).json({ message: "Task assigned successfully", task });
    } catch (error) {
      console.error("Error assigning task:", error);
      res.status(500).json({ message: "Error assigning task", error: error.message });
    }
  });
  


// 🔹 Get all tasks created by the logged-in admin
router.get("/admin-tasks", protect, adminOnly, async (req, res) => {
    try {
      const tasks = await Task.find({ assignedBy: req.user._id }).populate("assignedTo", "name email");
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching admin tasks:", error);
      res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
  });

  router.get("/employee-tasks", protect, async (req, res) => {
    try {
      const employeeId = req.user.id; // Extracted from the JWT token
  
      // Fetch tasks assigned to the logged-in employee
      const tasks = await Task.find({ assignedTo: employeeId });
  
      // Fetch employee's name from the database
      const employee = await User.findById(employeeId).select("name");
  
      res.json({
        employeeName: employee ? employee.name : "Employee",
        tasks,
      });
    } catch (error) {
      console.error("Error fetching employee tasks:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });


  // 🔹 Mark task as completed (Employee Only)
router.put("/complete-task/:taskId", protect, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.taskId, assignedTo: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: "Task not found or not assigned to you" });
      }
  
      if (task.status === "completed") {
        return res.status(400).json({ message: "Task is already completed" });
      }
  
      task.status = "completed";
      await task.save();
  
      res.json({ message: "Task marked as completed", task });
    } catch (error) {
      console.error("Error marking task as completed:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  


module.exports = router;
