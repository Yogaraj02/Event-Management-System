import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import { registrationService } from "../../services/registrationService";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../hooks/useToast";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchEventAndStatus = async () => {
    setLoading(true);
    try {
      const data = await eventService.getById(id);
      setEvent(data.event);

      if (isAuthenticated && !isAdmin) {
        const myRegs = await registrationService.getMyRegistrations();
        const registered = myRegs.registeredEvents.some(
          (regEvent) => regEvent.id === parseInt(id)
        );
        setIsRegistered(registered);
      }
    } catch {
      showToast("Event not found or failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndStatus();
  }, [id, isAuthenticated, isAdmin]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showToast("Please login to register for events", "error");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await registrationService.register(event.id);
      showToast("Successfully registered for event!", "success");
      setIsRegistered(true);
      fetchEventAndStatus();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register for event", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;

    setActionLoading(true);
    try {
      await registrationService.cancel(event.id);
      showToast("Registration cancelled successfully", "success");
      setIsRegistered(false);
      fetchEventAndStatus();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel registration", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Event Details..." />;

  if (!event) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: "40px" }}>
          <h2>Event Not Found</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: "15px" }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card event-details-card">
        {/* Header */}
        <div className="event-details-header">
          <div>
            <h1 className="event-details-title">{event.title}</h1>
            <span className="badge">{event.category}</span>
          </div>
          {isRegistered && <span className="status-pill status-registered">✓ You are Registered</span>}
        </div>

        {/* Details Grid */}
        <div className="detail-rows">
          <div className="detail-row">
            <span className="detail-label">📅 Date</span>
            <span className="detail-value">{event.date}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">⏰ Time</span>
            <span className="detail-value">{event.time || "Not specified"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">📍 Venue / Location</span>
            <span className="detail-value">{event.location}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">👤 Organizer</span>
            <span className="detail-value">{event.organizer || "College Management"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">🎟️ Total Seats</span>
            <span className="detail-value">{event.totalSeats} seats</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">📊 Registrations</span>
            <span className="detail-value">
              <strong>{event.registeredCount}</strong> participants registered
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">🪑 Available Seats</span>
            <span className="detail-value">
              <strong style={{ color: event.availableSeats > 0 ? "#137333" : "#c5221f" }}>
                {event.availableSeats}
              </strong>{" "}
              seats remaining
            </span>
          </div>

          <div className="detail-row description-row">
            <span className="detail-label">📝 Description</span>
            <div className="detail-value description-text">{event.description}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="event-details-actions">
          {!isAdmin && (
            <>
              {isRegistered ? (
                <button
                  className="btn btn-danger"
                  onClick={handleCancelRegistration}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Cancelling..." : "Cancel Registration"}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleRegister}
                  disabled={actionLoading || event.availableSeats <= 0}
                >
                  {actionLoading
                    ? "Registering..."
                    : event.availableSeats <= 0
                    ? "Event Full"
                    : "Register for Event"}
                </button>
              )}
            </>
          )}

          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
