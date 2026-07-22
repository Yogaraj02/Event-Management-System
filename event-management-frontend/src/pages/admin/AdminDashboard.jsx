import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reportService } from "../../services/reportService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../hooks/useToast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reportService.getDashboardStats();
        setStats(data);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to load dashboard stats", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  if (loading) return <LoadingSpinner message="Loading Admin Dashboard..." />;

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-details">
            <h3>{stats?.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-details">
            <h3>{stats?.totalParticipants || 0}</h3>
            <p>Total Registrations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>{stats?.upcomingEvents || 0}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <h2 style={{ marginTop: "30px", marginBottom: "15px", color: "#333", fontSize: "1.2rem" }}>
        Quick Management
      </h2>
      <div className="admin-actions-grid">
        <Link to="/admin/events" className="admin-action-card">
          <h3>🎪 Manage Events</h3>
          <p>Create, edit, delete, filter, and search events</p>
        </Link>
        <Link to="/admin/participants" className="admin-action-card">
          <h3>📋 Manage Participants</h3>
          <p>View registered participants, edit info, or remove registrations</p>
        </Link>
        <Link to="/admin/users" className="admin-action-card">
          <h3>👤 Manage Users</h3>
          <p>View, search, edit roles, or delete system users</p>
        </Link>
        <Link to="/admin/reports" className="admin-action-card">
          <h3>📊 View Reports</h3>
          <p>View registration analytics and occupancy rates per event</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
