// In-memory data store
// All data is stored here and resets when the server restarts

let users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    phone: "9876543210",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "john123",
    role: "user",
    phone: "9123456789",
    createdAt: new Date().toISOString(),
  },
];

let events = [
  {
    id: 1,
    title: "Tech Workshop 2025",
    description:
      "A hands-on workshop covering web development with React and Node.js. Learn to build full-stack applications from scratch.",
    date: "2025-09-15",
    time: "10:00",
    location: "Computer Science Lab, Block A",
    category: "Technology",
    organizer: "Admin User",
    createdBy: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Cultural Fest - Tarang",
    description:
      "Annual cultural festival featuring music, dance, drama, and art competitions. Open to all departments.",
    date: "2025-10-20",
    time: "09:00",
    location: "Main Auditorium",
    category: "Cultural",
    organizer: "John Doe",
    createdBy: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Inter-College Sports Meet",
    description:
      "Annual sports competition including cricket, football, basketball, and athletics. Registrations open for all years.",
    date: "2025-11-05",
    time: "07:00",
    location: "College Sports Ground",
    category: "Sports",
    organizer: "Admin User",
    createdBy: 1,
    createdAt: new Date().toISOString(),
  },
];

// Active tokens: { token: userId }
const tokens = {};

let nextUserId = 3;
let nextEventId = 4;

// Helper functions
const findUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};

const findUserById = (id) => {
  return users.find((u) => u.id === id);
};

const findEventById = (id) => {
  return events.find((e) => e.id === id);
};

const generateToken = (userId) => {
  const token = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  tokens[token] = userId;
  return token;
};

const removeToken = (token) => {
  delete tokens[token];
};

const getUserIdFromToken = (token) => {
  return tokens[token] || null;
};

const getNextUserId = () => nextUserId++;
const getNextEventId = () => nextEventId++;

module.exports = {
  users,
  events,
  tokens,
  findUserByEmail,
  findUserById,
  findEventById,
  generateToken,
  removeToken,
  getUserIdFromToken,
  getNextUserId,
  getNextEventId,
};
