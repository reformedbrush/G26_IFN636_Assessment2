const mongoose = require("mongoose");

const plotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
  },
  plants: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Available", "Reserved", "Full", "Occupied"],
    default: "Available",
  },
  location: {
    type: String,
    default: "",
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plot", plotSchema);
