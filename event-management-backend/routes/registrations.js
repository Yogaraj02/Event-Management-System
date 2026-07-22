const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  getAllParticipants,
  updateParticipant,
  removeParticipantFromEvent,
  deleteParticipant,
} = require("../controllers/registrationController");
const { authenticate, adminOnly } = require("../middleware/auth");

// User routes
router.post("/:eventId", authenticate, registerForEvent);
router.delete("/:eventId", authenticate, cancelRegistration);
router.get("/my", authenticate, getMyRegistrations);

// Admin routes
router.get("/all", authenticate, adminOnly, getAllParticipants);
router.get("/event/:eventId", authenticate, adminOnly, getEventParticipants);
router.put("/participant/:id", authenticate, adminOnly, updateParticipant);
router.delete("/:id/remove", authenticate, adminOnly, removeParticipantFromEvent);
router.delete("/participant/:id", authenticate, adminOnly, deleteParticipant);

module.exports = router;
