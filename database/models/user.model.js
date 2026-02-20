const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ["employee", "manager", "admin"],
    default: "employee"
  },
  leaveBalance: {
    casual: { type: Number, default: 10 },
    sick: { type: Number, default: 5 },
    earned: { type: Number, default: 15 }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);