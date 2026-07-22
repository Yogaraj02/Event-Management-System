import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const EditEvent = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Technology",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
        const res = await API.get(`/events/${id}`);
        const event = res.data.event;
        setForm({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time || "",
          location: event.location,
          category: event.category,
        });
      } catch {
        setError("Failed to load event details.");
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.title.trim() || !form.description.trim() || !form.date || !form.location.trim()) {
      setError("Title, description, date, and location are required.");
      return;
    }

    if (form.title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (form.description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      await API.put(`/events/${id}`, form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "60px 0" }}>
        <p>Loading event...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="card">
          <h1 className="page-title">Edit Event</h1>

          {error && <div className="message message-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter event title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the event (min 10 characters)"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="Enter venue/location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
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

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Event"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
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
