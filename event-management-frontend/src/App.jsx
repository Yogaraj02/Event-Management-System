import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import ManageParticipants from "./pages/admin/ManageParticipants";
import ManageUsers from "./pages/admin/ManageUsers";
import Reports from "./pages/admin/Reports";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import EventList from "./pages/user/EventList";
import EventDetails from "./pages/user/EventDetails";
import MyEvents from "./pages/user/MyEvents";

const App = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Starting Event Portal..." />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />

        {/* Dashboard root router */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {isAdmin ? <AdminDashboard /> : <UserDashboard />}
            </ProtectedRoute>
          }
        />

        {/* Shared Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />

        {/* User Specific Routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        {/* Admin Specific Routes */}
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/create"
          element={
            <ProtectedRoute adminOnly={true}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/edit/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/participants"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageParticipants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute adminOnly={true}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
