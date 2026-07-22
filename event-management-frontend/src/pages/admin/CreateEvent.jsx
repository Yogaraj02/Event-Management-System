import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import { useToast } from "../../hooks/useToast";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "10:00",
    location: "",
    category: "Technology",
    organizer: "",
    totalSeats: 50,
  });
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
    if (form.title.trim().length < 3) {
      showToast("Event Name must be at least 3 characters", "error");
      return;
    }
    if (form.description.trim().length < 10) {
      showToast("Description must be at least 10 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await eventService.create(form);
      showToast("Event created successfully!", "success");
      navigate("/admin/events");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create event", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="card">
          <h1 className="page-title">Create New Event</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Event Name *</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Annual Tech Symposium"
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
                placeholder="e.g. Main Auditorium, Block C"
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
                  placeholder="e.g. Computer Science Dept"
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
                  max="1000"
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
                placeholder="Provide event details, eligibility, schedule..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
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

export default CreateEvent;
