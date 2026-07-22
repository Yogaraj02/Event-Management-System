const { getUserIdFromToken, getUsers } = require("../data/db");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  const userId = getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  const users = getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "User not found." });
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

module.exports = { authenticate, adminOnly };
