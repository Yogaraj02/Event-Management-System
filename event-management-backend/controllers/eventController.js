const { getEvents, saveEvents, getRegistrations, getNextId } = require("../data/db");
const { isValidDate } = require("../utils/helpers");

const getAllEvents = (req, res) => {
  const { search, category, date } = req.query;
  let events = getEvents();
  const registrations = getRegistrations();

  // Enrich with registration counts
  let enrichedEvents = events.map((event) => {
    const eventRegs = registrations.filter((r) => r.eventId === event.id);
    const registeredCount = eventRegs.length;
    const totalSeats = Number(event.totalSeats) || 50;
    const availableSeats = Math.max(0, totalSeats - registeredCount);
    return {
      ...event,
      registeredCount,
      totalSeats,
      availableSeats,
    };
  });

  // Filtering
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    enrichedEvents = enrichedEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
    );
  }

  if (category && category.trim() && category !== "All") {
    enrichedEvents = enrichedEvents.filter(
      (e) => e.category.toLowerCase() === category.trim().toLowerCase()
    );
  }

  if (date && date.trim()) {
    enrichedEvents = enrichedEvents.filter((e) => e.date === date.trim());
  }

  // Sort by date (ascending)
  enrichedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.status(200).json({ events: enrichedEvents, total: enrichedEvents.length });
};

const getEventById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid event ID." });

  const events = getEvents();
  const event = events.find((e) => e.id === id);

  if (!event) return res.status(404).json({ message: "Event not found." });

  const registrations = getRegistrations();
  const eventRegs = registrations.filter((r) => r.eventId === event.id);
  const registeredCount = eventRegs.length;
  const totalSeats = Number(event.totalSeats) || 50;
  const availableSeats = Math.max(0, totalSeats - registeredCount);

  res.status(200).json({
    event: {
      ...event,
      registeredCount,
      totalSeats,
      availableSeats,
    },
  });
};

const createEvent = (req, res) => {
  const { title, description, date, time, location, category, organizer, totalSeats } = req.body;

  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({
      message: "Event Name, Description, Date, Location, and Category are required.",
    });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({ message: "Event Name must be at least 3 characters." });
  }

  if (description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters." });
  }

  if (!isValidDate(date)) {
    return res.status(400).json({ message: "Invalid date format (YYYY-MM-DD required)." });
  }

  const events = getEvents();

  const newEvent = {
    id: getNextId(events),
    title: title.trim(),
    description: description.trim(),
    date: date.trim(),
    time: time ? time.trim() : "10:00",
    location: location.trim(),
    category: category.trim(),
    organizer: organizer ? organizer.trim() : req.user.name,
    createdBy: req.user.id,
    totalSeats: Number(totalSeats) > 0 ? Number(totalSeats) : 50,
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  saveEvents(events);

  res.status(201).json({
    message: "Event created successfully.",
    event: { ...newEvent, registeredCount: 0, availableSeats: newEvent.totalSeats },
  });
};

const updateEvent = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid event ID." });

  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) return res.status(404).json({ message: "Event not found." });

  const { title, description, date, time, location, category, organizer, totalSeats } = req.body;

  if (title && title.trim().length < 3) {
    return res.status(400).json({ message: "Event Name must be at least 3 characters." });
  }

  if (description && description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters." });
  }

  if (date && !isValidDate(date)) {
    return res.status(400).json({ message: "Invalid date format (YYYY-MM-DD required)." });
  }

  if (title) events[index].title = title.trim();
  if (description) events[index].description = description.trim();
  if (date) events[index].date = date.trim();
  if (time) events[index].time = time.trim();
  if (location) events[index].location = location.trim();
  if (category) events[index].category = category.trim();
  if (organizer) events[index].organizer = organizer.trim();
  if (totalSeats !== undefined && Number(totalSeats) > 0) {
    events[index].totalSeats = Number(totalSeats);
  }

  saveEvents(events);

  const registrations = getRegistrations();
  const regCount = registrations.filter((r) => r.eventId === id).length;

  res.status(200).json({
    message: "Event updated successfully.",
    event: {
      ...events[index],
      registeredCount: regCount,
      availableSeats: Math.max(0, events[index].totalSeats - regCount),
    },
  });
};

const deleteEvent = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid event ID." });

  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);

  if (index === -1) return res.status(404).json({ message: "Event not found." });

  // Remove event
  events.splice(index, 1);
  saveEvents(events);

  // Clean up associated registrations
  let registrations = getRegistrations();
  registrations = registrations.filter((r) => r.eventId !== id);

  res.status(200).json({ message: "Event deleted successfully." });
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
