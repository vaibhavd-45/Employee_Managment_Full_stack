const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const { protect } = require("./middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const User = require("./models/User");

// Multer Setup
const upload = multer({ storage: multer.memoryStorage() });
const app = express();


app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/tasks",require("./routes/taskRoutes"));


connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
