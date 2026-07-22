import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async (query = "") => {
    setLoading(true);
    try {
      const res = await API.get(`/events${query ? `?search=${query}` : ""}`);
      setEvents(res.data.events);
    } catch {
      setMessage("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      setMessage("Event deleted successfully.");
      setEvents(events.filter((e) => e.id !== id));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete event.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const canModify = (event) => {
    return isAdmin || event.createdBy === user?.id;
  };

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search events by title, category, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              fetchEvents();
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Messages */}
      {message && (
        <div
          className={`message ${
            message.includes("success") ? "message-success" : "message-error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && <p style={{ textAlign: "center", color: "#888" }}>Loading events...</p>}

      {/* Events List */}
      {!loading && events.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>Create a new event to get started!</p>
        </div>
      )}

      {!loading &&
        events.map((event) => (
          <div className="card" key={event.id}>
            <div className="card-header">
              <div>
                <h3 className="card-title">{event.title}</h3>
                <p className="card-meta">
                  📅 {event.date} &nbsp;|&nbsp; 📍 {event.location} &nbsp;|&nbsp; 👤{" "}
                  {event.organizer}
                </p>
              </div>
              <span className="badge">{event.category}</span>
            </div>

            <p className="card-description">
              {event.description.length > 150
                ? event.description.substring(0, 150) + "..."
                : event.description}
            </p>

            <div className="card-footer">
              <Link to={`/events/${event.id}`} className="btn btn-primary btn-small">
                View Details
              </Link>
              {canModify(event) && (
                <>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Dashboard;
