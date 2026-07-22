const {
  getUsers,
  saveUsers,
  getNextId,
  generateToken,
  removeToken,
} = require("../data/db");
const { isValidEmail } = require("../utils/helpers");

const register = (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const users = getUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const newUser = {
    id: getNextId(users),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    role: "user",
    phone: phone ? phone.trim() : "",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const token = generateToken(newUser.id);

  res.status(201).json({
    message: "Registration successful.",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    },
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken(user.id);

  res.status(200).json({
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
};

const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    removeToken(token);
  }
  res.status(200).json({ message: "Logged out successfully." });
};

const getProfile = (req, res) => {
  const users = getUsers();
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
};

const updateProfile = (req, res) => {
  const { name, phone } = req.body;
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  if (name && name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters." });
  }

  if (name) users[userIndex].name = name.trim();
  if (phone !== undefined) users[userIndex].phone = phone.trim();

  saveUsers(users);

  res.status(200).json({
    message: "Profile updated successfully.",
    user: {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      role: users[userIndex].role,
      phone: users[userIndex].phone,
      createdAt: users[userIndex].createdAt,
    },
  });
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};
