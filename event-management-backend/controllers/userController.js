const { getUsers, saveUsers, getRegistrations, saveRegistrations } = require("../data/db");
const { isValidEmail } = require("../utils/helpers");

const getAllUsers = (req, res) => {
  const { search } = req.query;
  let users = getUsers();

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        u.role.toLowerCase().includes(q)
    );
  }

  // Omit passwords from response
  const sanitizedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone || "N/A",
    createdAt: u.createdAt,
  }));

  res.status(200).json({ users: sanitizedUsers, total: sanitizedUsers.length });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID." });

  const users = getUsers();
  const user = users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ message: "User not found." });

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "N/A",
      createdAt: user.createdAt,
    },
  });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID." });

  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return res.status(404).json({ message: "User not found." });

  const { name, email, role, phone } = req.body;

  if (name && name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters." });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (role && !["admin", "user"].includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Role must be 'admin' or 'user'." });
  }

  if (name) users[index].name = name.trim();
  if (email) users[index].email = email.trim().toLowerCase();
  if (role) users[index].role = role.toLowerCase();
  if (phone !== undefined) users[index].phone = phone.trim();

  saveUsers(users);

  res.status(200).json({
    message: "User updated successfully.",
    user: {
      id: users[index].id,
      name: users[index].name,
      email: users[index].email,
      role: users[index].role,
      phone: users[index].phone,
      createdAt: users[index].createdAt,
    },
  });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID." });

  if (id === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) return res.status(404).json({ message: "User not found." });

  users.splice(index, 1);
  saveUsers(users);

  // Remove registrations for deleted user
  let registrations = getRegistrations();
  registrations = registrations.filter((r) => r.userId !== id);
  saveRegistrations(registrations);

  res.status(200).json({ message: "User deleted successfully." });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
