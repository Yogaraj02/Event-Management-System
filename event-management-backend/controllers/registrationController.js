const {
  getRegistrations,
  saveRegistrations,
  getEvents,
  getUsers,
  saveUsers,
  getNextId,
} = require("../data/db");
const { isValidEmail } = require("../utils/helpers");

// User registers for an event
const registerForEvent = (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const userId = req.user.id;

  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  const events = getEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const registrations = getRegistrations();

  // Check duplicate registration
  const existing = registrations.find((r) => r.userId === userId && r.eventId === eventId);
  if (existing) {
    return res.status(400).json({ message: "You are already registered for this event." });
  }

  // Check seat capacity
  const currentCount = registrations.filter((r) => r.eventId === eventId).length;
  const totalSeats = Number(event.totalSeats) || 50;
  if (currentCount >= totalSeats) {
    return res.status(400).json({ message: "This event is full. No available seats." });
  }

  const newReg = {
    id: getNextId(registrations),
    userId,
    eventId,
    registeredAt: new Date().toISOString(),
  };

  registrations.push(newReg);
  saveRegistrations(registrations);

  res.status(201).json({
    message: "Successfully registered for the event!",
    registration: newReg,
  });
};

// User cancels registration
const cancelRegistration = (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const userId = req.user.id;

  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  const registrations = getRegistrations();
  const index = registrations.findIndex((r) => r.userId === userId && r.eventId === eventId);

  if (index === -1) {
    return res.status(404).json({ message: "Registration not found." });
  }

  registrations.splice(index, 1);
  saveRegistrations(registrations);

  res.status(200).json({ message: "Registration cancelled successfully." });
};

// User views their registered events
const getMyRegistrations = (req, res) => {
  const userId = req.user.id;
  const registrations = getRegistrations();
  const events = getEvents();

  const userRegs = registrations.filter((r) => r.userId === userId);
  const myEvents = userRegs
    .map((r) => {
      const event = events.find((e) => e.id === r.eventId);
      if (!event) return null;
      return {
        registrationId: r.id,
        registeredAt: r.registeredAt,
        ...event,
      };
    })
    .filter(Boolean);

  res.status(200).json({ registeredEvents: myEvents });
};

// Admin: Get participants for a specific event
const getEventParticipants = (req, res) => {
  const eventId = parseInt(req.params.eventId);
  if (isNaN(eventId)) {
    return res.status(400).json({ message: "Invalid event ID." });
  }

  const registrations = getRegistrations();
  const users = getUsers();
  const events = getEvents();

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found." });
  }

  const eventRegs = registrations.filter((r) => r.eventId === eventId);
  const participants = eventRegs
    .map((r) => {
      const user = users.find((u) => u.id === r.userId);
      if (!user) return null;
      return {
        registrationId: r.id,
        registeredAt: r.registeredAt,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "N/A",
        eventId: event.id,
        eventTitle: event.title,
      };
    })
    .filter(Boolean);

  res.status(200).json({ eventTitle: event.title, participants });
};

// Admin: Get all participants across all events (with search & filter)
const getAllParticipants = (req, res) => {
  const { search, eventId } = req.query;
  const registrations = getRegistrations();
  const users = getUsers();
  const events = getEvents();

  let participants = registrations
    .map((r) => {
      const user = users.find((u) => u.id === r.userId);
      const event = events.find((e) => e.id === r.eventId);
      if (!user || !event) return null;
      return {
        registrationId: r.id,
        registeredAt: r.registeredAt,
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "N/A",
        eventId: event.id,
        eventTitle: event.title,
        eventCategory: event.category,
        eventDate: event.date,
      };
    })
    .filter(Boolean);

  if (eventId && !isNaN(parseInt(eventId))) {
    const eId = parseInt(eventId);
    participants = participants.filter((p) => p.eventId === eId);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    participants = participants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.eventTitle.toLowerCase().includes(q)
    );
  }

  res.status(200).json({ participants, total: participants.length });
};

// Admin: Edit participant information (updates User object)
const updateParticipant = (req, res) => {
  const participantId = parseInt(req.params.id); // userId
  if (isNaN(participantId)) {
    return res.status(400).json({ message: "Invalid participant ID." });
  }

  const { name, email, phone } = req.body;
  const users = getUsers();
  const index = users.findIndex((u) => u.id === participantId);

  if (index === -1) {
    return res.status(404).json({ message: "Participant not found." });
  }

  if (name && name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters." });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (name) users[index].name = name.trim();
  if (email) users[index].email = email.trim().toLowerCase();
  if (phone !== undefined) users[index].phone = phone.trim();

  saveUsers(users);

  res.status(200).json({
    message: "Participant information updated successfully.",
    user: users[index],
  });
};

// Admin: Remove participant from an event (deletes registration)
const removeParticipantFromEvent = (req, res) => {
  const registrationId = parseInt(req.params.id);
  if (isNaN(registrationId)) {
    return res.status(400).json({ message: "Invalid registration ID." });
  }

  const registrations = getRegistrations();
  const index = registrations.findIndex((r) => r.id === registrationId);

  if (index === -1) {
    return res.status(404).json({ message: "Registration record not found." });
  }

  registrations.splice(index, 1);
  saveRegistrations(registrations);

  res.status(200).json({ message: "Participant removed from event successfully." });
};

// Admin: Delete participant (removes user & all their event registrations)
const deleteParticipant = (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Participant not found." });
  }

  users.splice(userIndex, 1);
  saveUsers(users);

  let registrations = getRegistrations();
  registrations = registrations.filter((r) => r.userId !== userId);
  saveRegistrations(registrations);

  res.status(200).json({ message: "Participant and all associated registrations deleted." });
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventParticipants,
  getAllParticipants,
  updateParticipant,
  removeParticipantFromEvent,
  deleteParticipant,
};
