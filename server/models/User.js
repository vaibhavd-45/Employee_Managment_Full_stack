const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: function() { return this.role === "employee"; } // Only employees have an admin reference
  },
  dateOfJoining: {
    type: Date,
    required: function() { return this.role === "employee"; } // Required for employees
  },
  department: {
    type: String,
    required: function() { return this.role === "employee"; }, // Required for employees
    trim: true,
  },
  profileImage: {
    type: String,
    default: "",
  }
});

// Ensure `admin` does not have unnecessary fields
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.admin = null; // Admins should not have an admin reference
    this.dateOfJoining = undefined; // Remove dateOfJoining for admins
    this.department = undefined; // Remove department for admins
    this.profileImage = undefined; // Remove profile image for admins
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
