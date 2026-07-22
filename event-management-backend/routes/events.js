const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authenticate, adminOnly, createEvent);
router.put("/:id", authenticate, adminOnly, updateEvent);
router.delete("/:id", authenticate, adminOnly, deleteEvent);

module.exports = router;
