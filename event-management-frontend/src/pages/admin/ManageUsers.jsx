import { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../hooks/useToast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user", phone: "" });

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll({ search });
      setUsers(data.users);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      await userService.delete(id);
      showToast("User deleted successfully", "success");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone === "N/A" ? "" : user.phone,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.update(editingUser.id, editForm);
      showToast("User updated successfully", "success");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update user", "error");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">User Management</h1>

      {/* Search Bar */}
      <div className="filter-card card">
        <form onSubmit={handleSearchSubmit} className="filter-form">
          <div className="filter-group flex-2">
            <label>Search Users</label>
            <input
              type="text"
              placeholder="Search by user name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                userService.getAll().then((d) => setUsers(d.users));
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" message="Try searching for a different term." />
      ) : (
        <div className="table-responsive card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-admin" : ""}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.phone}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => openEditModal(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteUser(u.id, u.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>Edit User Details</h3>
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
                <label>Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
                  onClick={() => setEditingUser(null)}
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

export default ManageUsers;
