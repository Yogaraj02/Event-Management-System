const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.get("/", authenticate, adminOnly, getAllUsers);
router.get("/:id", authenticate, adminOnly, getUserById);
router.put("/:id", authenticate, adminOnly, updateUser);
router.delete("/:id", authenticate, adminOnly, deleteUser);

module.exports = router;
