import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventService } from "../../services/eventService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../hooks/useToast";

const EditEvent = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Technology",
    organizer: "",
    totalSeats: 50,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Cultural",
    "Sports",
    "Academic",
    "Workshop",
    "Seminar",
    "Other",
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        const e = data.event;
        setForm({
          title: e.title,
          description: e.description,
          date: e.date,
          time: e.time || "",
          location: e.location,
          category: e.category,
          organizer: e.organizer || "",
          totalSeats: e.totalSeats || 50,
        });
      } catch {
        showToast("Failed to fetch event details", "error");
        navigate("/admin/events");
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id, navigate, showToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Event Name is required", "error");
      return;
    }
    if (!form.description.trim()) {
      showToast("Description is required", "error");
      return;
    }
    if (!form.date) {
      showToast("Date cannot be empty", "error");
      return;
    }
    if (!form.location.trim()) {
      showToast("Location is required", "error");
      return;
    }

    setLoading(true);
    try {
      await eventService.update(id, form);
      showToast("Event updated successfully!", "success");
      navigate("/admin/events");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update event", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner message="Loading event details..." />;

  return (
    <div className="container">
      <div className="form-container">
        <div className="card">
          <h1 className="page-title">Edit Event</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Event Name *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="date">Date *</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Venue / Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="organizer">Organizer</label>
                <input
                  id="organizer"
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="totalSeats">Total Available Seats</label>
                <input
                  id="totalSeats"
                  type="number"
                  name="totalSeats"
                  min="1"
                  value={form.totalSeats}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Update Event"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/admin/events")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
