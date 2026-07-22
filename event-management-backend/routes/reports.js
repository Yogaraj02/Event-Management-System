const express = require("express");
const router = express.Router();
const { getDashboardStats, getEventStats } = require("../controllers/reportController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.get("/dashboard", authenticate, adminOnly, getDashboardStats);
router.get("/events", authenticate, adminOnly, getEventStats);

module.exports = router;
