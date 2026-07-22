import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || form.name.trim().length < 2) {
      showToast("Name must be at least 2 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.updateProfile(form);
      updateUser(res.user);
      showToast("Profile updated successfully!", "success");
      setEditing(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="profile-card card">
        <h1 className="page-title">User Profile</h1>

        {!editing ? (
          <>
            <div className="profile-info">
              <p>
                <strong>Full Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email Address:</strong> {user.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {user.phone || "Not provided"}
              </p>
              <p>
                <strong>Account Role:</strong>{" "}
                <span className="badge">{user.role.toUpperCase()}</span>
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setForm({ name: user.name, phone: user.phone || "" });
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={user.email} disabled style={{ background: "#f5f5f5" }} />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
