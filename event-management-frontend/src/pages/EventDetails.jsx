import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch {
        setError("Event not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="message message-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {event.title}
          </h1>
          <span className="badge">{event.category}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">📅 Date</span>
          <span className="detail-value">{event.date}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">⏰ Time</span>
          <span className="detail-value">{event.time || "Not specified"}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">📍 Location</span>
          <span className="detail-value">{event.location}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">👤 Organizer</span>
          <span className="detail-value">{event.organizer}</span>
        </div>

        <div className="detail-row" style={{ borderBottom: "none" }}>
          <span className="detail-label">📝 Description</span>
          <span className="detail-value">{event.description}</span>
        </div>

        <div style={{ marginTop: "24px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
