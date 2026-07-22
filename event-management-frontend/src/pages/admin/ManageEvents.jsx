import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "All",
    "Technology",
    "Cultural",
    "Sports",
    "Academic",
    "Workshop",
    "Seminar",
    "Other",
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAll({ search, category, date });
      setEvents(data.events);
    } catch {
      showToast("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, date]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setDate("");
    eventService.getAll().then((data) => setEvents(data.events));
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await eventService.delete(id);
      showToast("Event deleted successfully", "success");
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete event", "error");
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Event Management</h1>
        <Link to="/admin/events/create" className="btn btn-primary">
          + Create Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="filter-card card">
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="filter-group flex-2">
            <label>Search Events</label>
            <input
              type="text"
              placeholder="Search by title, location, organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button type="submit" className="btn btn-primary btn-small">
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={handleClearFilters}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState title="No events found" message="Try adjusting your search or filters." />
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div className="card" key={event.id}>
              <div className="card-header">
                <div>
                  <h3 className="card-title">{event.title}</h3>
                  <p className="card-meta">
                    📅 {event.date} at {event.time} &nbsp;|&nbsp; 📍 {event.location}
                  </p>
                </div>
                <span className="badge">{event.category}</span>
              </div>

              <p className="card-description">
                {event.description.length > 120
                  ? event.description.substring(0, 120) + "..."
                  : event.description}
              </p>

              <div className="card-seats-info">
                <span>Seats: <strong>{event.registeredCount}</strong> / {event.totalSeats} registered</span>
                <span className={`status-pill ${event.availableSeats > 0 ? "status-open" : "status-full"}`}>
                  {event.availableSeats > 0 ? `${event.availableSeats} Available` : "Full"}
                </span>
              </div>

              <div className="card-footer">
                <Link to={`/events/${event.id}`} className="btn btn-secondary btn-small">
                  View Details
                </Link>
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(event.id, event.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
