const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "users.json");
const EVENTS_FILE = path.join(__dirname, "events.json");
const REGISTRATIONS_FILE = path.join(__dirname, "registrations.json");

// In-memory active tokens mapping: token -> userId
const tokens = {};

const readJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Data accessors
const getUsers = () => readJson(USERS_FILE);
const saveUsers = (data) => writeJson(USERS_FILE, data);

const getEvents = () => readJson(EVENTS_FILE);
const saveEvents = (data) => writeJson(EVENTS_FILE, data);

const getRegistrations = () => readJson(REGISTRATIONS_FILE);
const saveRegistrations = (data) => writeJson(REGISTRATIONS_FILE, data);

// Helpers
const getNextId = (items) => {
  if (!items || items.length === 0) return 1;
  const maxId = Math.max(...items.map((item) => Number(item.id) || 0));
  return maxId + 1;
};

// Token operations
const generateToken = (userId) => {
  const token = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  tokens[token] = userId;
  return token;
};

const removeToken = (token) => {
  delete tokens[token];
};

const getUserIdFromToken = (token) => {
  return tokens[token] || null;
};

module.exports = {
  getUsers,
  saveUsers,
  getEvents,
  saveEvents,
  getRegistrations,
  saveRegistrations,
  getNextId,
  generateToken,
  removeToken,
  getUserIdFromToken,
};
