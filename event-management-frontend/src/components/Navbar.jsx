import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📅 Event Portal
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              // Admin Nav Links
              <>
                <Link to="/" className={isActive("/")}>
                  Dashboard
                </Link>
                <Link to="/admin/events" className={isActive("/admin/events")}>
                  Events
                </Link>
                <Link to="/admin/participants" className={isActive("/admin/participants")}>
                  Participants
                </Link>
                <Link to="/admin/users" className={isActive("/admin/users")}>
                  Users
                </Link>
                <Link to="/admin/reports" className={isActive("/admin/reports")}>
                  Reports
                </Link>
              </>
            ) : (
              // User Nav Links
              <>
                <Link to="/" className={isActive("/")}>
                  Dashboard
                </Link>
                <Link to="/events" className={isActive("/events")}>
                  Events
                </Link>
                <Link to="/my-events" className={isActive("/my-events")}>
                  My Registered Events
                </Link>
              </>
            )}
            <Link to="/profile" className={isActive("/profile")}>
              Profile
            </Link>
            <span className="user-badge">{isAdmin ? "Admin" : user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
            <Link to="/register" className={isActive("/register")}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
