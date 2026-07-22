import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../services/eventService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
      const data = await eventService.getAll({ search, category });
      setEvents(data.events);
    } catch {
      showToast("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="container">
      <h1 className="page-title">Explore Events</h1>

      {/* Filter and Search */}
      <div className="filter-card card">
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="filter-group flex-2">
            <label>Search Events</label>
            <input
              type="text"
              placeholder="Search by event title, location, organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group flex-1">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-buttons">
            <button type="submit" className="btn btn-primary btn-small">
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                setSearch("");
                setCategory("All");
                eventService.getAll().then((d) => setEvents(d.events));
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : events.length === 0 ? (
        <EmptyState title="No events found" message="Try searching with different terms." />
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
                {event.description.length > 130
                  ? event.description.substring(0, 130) + "..."
                  : event.description}
              </p>

              <div className="card-seats-info">
                <span>Available Seats: <strong>{event.availableSeats}</strong> / {event.totalSeats}</span>
                <span className={`status-pill ${event.availableSeats > 0 ? "status-open" : "status-full"}`}>
                  {event.availableSeats > 0 ? "Seats Available" : "Sold Out"}
                </span>
              </div>

              <div className="card-footer">
                <Link to={`/events/${event.id}`} className="btn btn-primary btn-small">
                  View Details & Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
