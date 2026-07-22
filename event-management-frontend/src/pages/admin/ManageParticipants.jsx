import { useState, useEffect } from "react";
import { registrationService } from "../../services/registrationService";
import { eventService } from "../../services/eventService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const ManageParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });

  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      setEvents(data.events);
    } catch {
      // Ignore
    }
  };

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const data = await registrationService.getAllParticipants({
        search,
        eventId: selectedEventId,
      });
      setParticipants(data.participants);
    } catch {
      showToast("Failed to load participants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [selectedEventId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParticipants();
  };

  const handleRemoveFromEvent = async (registrationId, name, eventTitle) => {
    if (!window.confirm(`Remove ${name} from "${eventTitle}"?`)) return;
    try {
      await registrationService.removeFromEvent(registrationId);
      showToast("Participant removed from event", "success");
      setParticipants(participants.filter((p) => p.registrationId !== registrationId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove participant", "error");
    }
  };

  const handleDeleteParticipant = async (userId, name) => {
    if (!window.confirm(`Delete user ${name} and all their event registrations?`)) return;
    try {
      await registrationService.deleteParticipant(userId);
      showToast("Participant deleted successfully", "success");
      setParticipants(participants.filter((p) => p.userId !== userId));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete participant", "error");
    }
  };

  const openEditModal = (participant) => {
    setEditingParticipant(participant);
    setEditForm({
      name: participant.name,
      email: participant.email,
      phone: participant.phone === "N/A" ? "" : participant.phone,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrationService.updateParticipant(editingParticipant.userId, editForm);
      showToast("Participant updated successfully", "success");
      setEditingParticipant(null);
      fetchParticipants();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update participant", "error");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Participant Management</h1>

      {/* Filter and Search Bar */}
      <div className="filter-card card">
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="filter-group flex-2">
            <label>Search Participant</label>
            <input
              type="text"
              placeholder="Search by participant name, email, or event title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group flex-1">
            <label>Filter by Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
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
                setSelectedEventId("");
                registrationService.getAllParticipants().then((d) => setParticipants(d.participants));
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Table View */}
      {loading ? (
        <LoadingSpinner message="Loading participants..." />
      ) : participants.length === 0 ? (
        <EmptyState title="No registered participants found" message="Try searching for a different name or event." />
      ) : (
        <div className="table-responsive card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered Event</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, idx) => (
                <tr key={p.registrationId}>
                  <td>{idx + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td>
                    <span className="badge">{p.eventTitle}</span>
                  </td>
                  <td>{new Date(p.registeredAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEditModal(p)}
                        title="Edit Participant Info"
                      >
                        Edit Info
                      </button>
                      <button
                        className="btn btn-warning btn-small"
                        onClick={() => handleRemoveFromEvent(p.registrationId, p.name, p.eventTitle)}
                        title="Remove from this event"
                      >
                        Remove Event
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteParticipant(p.userId, p.name)}
                        title="Delete Participant User"
                      >
                        Delete User
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingParticipant && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>Edit Participant Info</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingParticipant(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParticipants;
