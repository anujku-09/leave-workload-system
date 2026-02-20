const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  deadline: Date,
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  status: {
    type: String,
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);