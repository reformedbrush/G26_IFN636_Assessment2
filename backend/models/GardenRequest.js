const mongoose = require("mongoose");

const REQUEST_TYPES = [
  "Watering",
  "Compost",
  "Tool Request",
  "Maintenance",
  "Harvest Assistance",
];

const REQUEST_STATUSES = ["Pending", "Approved", "Rejected", "Completed"];

const gardenRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plot",
      required: true,
    },
    requestType: {
      type: String,
      enum: REQUEST_TYPES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GardenRequest", gardenRequestSchema);
module.exports.REQUEST_TYPES = REQUEST_TYPES;
module.exports.REQUEST_STATUSES = REQUEST_STATUSES;
