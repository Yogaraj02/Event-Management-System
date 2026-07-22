import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { registrationService } from "../../services/registrationService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const MyEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegisteredEvents(data.registeredEvents);
    } catch {
      showToast("Failed to load registered events", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancelRegistration = async (eventId, title) => {
    if (!window.confirm(`Cancel registration for "${title}"?`)) return;

    try {
      await registrationService.cancel(eventId);
      showToast("Registration cancelled successfully", "success");
      setRegisteredEvents(registeredEvents.filter((e) => e.id !== eventId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel registration", "error");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">My Registered Events</h1>

      {loading ? (
        <LoadingSpinner message="Loading your registered events..." />
      ) : registeredEvents.length === 0 ? (
        <EmptyState
          title="No registered events"
          message="You haven't registered for any events yet. Explore events and sign up!"
        />
      ) : (
        <div className="events-grid">
          {registeredEvents.map((event) => (
            <div className="card" key={event.registrationId}>
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

              <div className="card-meta" style={{ marginTop: "10px", color: "#137333" }}>
                Registered on: {new Date(event.registeredAt).toLocaleDateString()}
              </div>

              <div className="card-footer">
                <Link to={`/events/${event.id}`} className="btn btn-secondary btn-small">
                  View Details
                </Link>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleCancelRegistration(event.id, event.title)}
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
