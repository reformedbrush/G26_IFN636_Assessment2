const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getParticipants,
  getEvents,
  getEventById,
  registerForEvent,
  cancelRegistration,
} = require("../controllers/eventController");

router.use(protect);

router.get("/", getEvents);
router.post("/", admin, createEvent);

router.get("/:id/participants", admin, getParticipants);
router.post("/:id/register", registerForEvent);
router.delete("/:id/cancel", cancelRegistration);

router.get("/:id", getEventById);
router.put("/:id", admin, updateEvent);
router.delete("/:id", admin, deleteEvent);

module.exports = router;
