const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Event Management API is running." });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
