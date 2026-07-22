import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import LoadingSpinner from "../../components/LoadingSpinner";

const UserDashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myRegistrationsCount, setMyRegistrationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsData = await eventService.getAll();
        const myRegsData = await registrationService.getMyRegistrations();
        setUpcomingEvents(eventsData.events.slice(0, 3));
        setMyRegistrationsCount(myRegsData.registeredEvents.length);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Dashboard..." />;

  return (
    <div className="container">
      <div className="welcome-banner card">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Explore upcoming campus events, register in one click, and manage your schedules.</p>
      </div>

      <div className="stats-grid" style={{ margin: "24px 0" }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-details">
            <h3>{upcomingEvents.length}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-details">
            <h3>{myRegistrationsCount}</h3>
            <p>My Registrations</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ color: "#333", fontSize: "1.2rem" }}>Featured Events</h2>
        <Link to="/events" className="btn btn-secondary btn-small">
          View All Events →
        </Link>
      </div>

      <div className="events-grid">
        {upcomingEvents.map((event) => (
          <div className="card" key={event.id}>
            <div className="card-header">
              <div>
                <h3 className="card-title">{event.title}</h3>
                <p className="card-meta">📅 {event.date} &nbsp;|&nbsp; 📍 {event.location}</p>
              </div>
              <span className="badge">{event.category}</span>
            </div>

            <p className="card-description">
              {event.description.length > 100
                ? event.description.substring(0, 100) + "..."
                : event.description}
            </p>

            <div className="card-footer">
              <Link to={`/events/${event.id}`} className="btn btn-primary btn-small">
                View Event Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
