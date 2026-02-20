const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);