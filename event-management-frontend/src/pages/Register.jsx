import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showToast("Name, email, and password are required.", "error");
      return;
    }

    if (form.name.trim().length < 2) {
      showToast("Name must be at least 2 characters.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      showToast("Registration successful! Welcome aboard.", "success");
      navigate("/");
    } catch (err) {
      if (!err.response) {
        showToast("Unable to connect to server. Please ensure the backend (port 5000) is running.", "error");
      } else {
        showToast(err.response.data?.message || "Registration failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>User Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Alex Johnson"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (optional)</label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
