const { getEvents, getUsers, getRegistrations } = require("../data/db");

const getDashboardStats = (req, res) => {
  const events = getEvents();
  const users = getUsers();
  const registrations = getRegistrations();

  const totalEvents = events.length;
  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalParticipants = registrations.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingEvents = events.filter((e) => e.date >= todayStr).length;

  res.status(200).json({
    totalEvents,
    totalUsers,
    totalParticipants,
    upcomingEvents,
  });
};

const getEventStats = (req, res) => {
  const events = getEvents();
  const registrations = getRegistrations();

  const eventStats = events.map((event) => {
    const registeredCount = registrations.filter((r) => r.eventId === event.id).length;
    const totalSeats = Number(event.totalSeats) || 50;
    const occupancyRate = totalSeats > 0 ? ((registeredCount / totalSeats) * 100).toFixed(1) : 0;
    return {
      id: event.id,
      title: event.title,
      category: event.category,
      date: event.date,
      totalSeats,
      registeredCount,
      occupancyRate: `${occupancyRate}%`,
    };
  });

  res.status(200).json({
    totalEvents: events.length,
    totalRegistrations: registrations.length,
    eventStats,
  });
};

module.exports = {
  getDashboardStats,
  getEventStats,
};
