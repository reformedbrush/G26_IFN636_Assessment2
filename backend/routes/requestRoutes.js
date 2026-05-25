const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createRequest,
  getRequests,
  getRequestById,
  deleteRequest,
  approveRequest,
  rejectRequest,
  completeRequest,
} = require("../controllers/requestController");

router.use(protect);

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.put("/:id/approve", admin, approveRequest);
router.put("/:id/reject", admin, rejectRequest);
router.put("/:id/complete", admin, completeRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
