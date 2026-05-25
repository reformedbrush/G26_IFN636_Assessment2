const GardenRequest = require("../models/GardenRequest");
const Plot = require("../models/Plot");
const { REQUEST_TYPES } = require("../models/GardenRequest");

const userFields = "name email";
const plotFields = "name location";

const populateRequest = (query) =>
  query.populate("user", userFields).populate("plot", plotFields);

const isValidRequestType = (type) => REQUEST_TYPES.includes(type);

const userOwnsPlot = async (userId, plotId) => {
  const plot = await Plot.findById(plotId);
  if (!plot || !plot.bookedBy) return false;
  return String(plot.bookedBy) === String(userId);
};

const canAccessRequest = (request, user) => {
  const isOwner = String(request.user._id || request.user) === String(user._id);
  return user.role === "admin" || isOwner;
};

const createRequest = async (req, res) => {
  try {
    const { plot, requestType, description } = req.body;

    if (!plot || !requestType || !description?.trim()) {
      return res.status(400).json({
        message: "Plot, request type, and description are required",
      });
    }

    if (!isValidRequestType(requestType)) {
      return res.status(400).json({ message: "Invalid request type" });
    }

    const ownsPlot = await userOwnsPlot(req.user._id, plot);
    if (!ownsPlot) {
      return res.status(403).json({
        message: "You can only submit requests for plots you have booked",
      });
    }

    const request = await GardenRequest.create({
      user: req.user._id,
      plot,
      requestType,
      description: description.trim(),
    });

    const populated = await populateRequest(
      GardenRequest.findById(request._id)
    );

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      GardenRequest.find({ user: req.user._id }).sort({ createdAt: -1 })
    );

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const requests = await populateRequest(
      GardenRequest.find(filter).sort({ createdAt: -1 })
    );

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRequests = async (req, res) => {
  if (req.user.role === "admin") {
    return getAllRequests(req, res);
  }
  return getMyRequests(req, res);
};

const getRequestById = async (req, res) => {
  try {
    const request = await populateRequest(
      GardenRequest.findById(req.params.id)
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!canAccessRequest(request, req.user)) {
      return res.status(403).json({ message: "Not authorized to view this request" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const request = await GardenRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const isOwner = String(request.user) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    if (!isAdmin && request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be deleted",
      });
    }

    await request.deleteOne();
    res.json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const request = await GardenRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be approved",
      });
    }

    request.status = "Approved";
    await request.save();

    const populated = await populateRequest(
      GardenRequest.findById(request._id)
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const request = await GardenRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending requests can be rejected",
      });
    }

    request.status = "Rejected";
    await request.save();

    const populated = await populateRequest(
      GardenRequest.findById(request._id)
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeRequest = async (req, res) => {
  try {
    const request = await GardenRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Approved") {
      return res.status(400).json({
        message: "Only approved requests can be marked completed",
      });
    }

    request.status = "Completed";
    await request.save();

    const populated = await populateRequest(
      GardenRequest.findById(request._id)
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequests,
  getRequestById,
  deleteRequest,
  approveRequest,
  rejectRequest,
  completeRequest,
};
