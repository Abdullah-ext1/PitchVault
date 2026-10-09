import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/discover");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="h1">Log in</h1>
        {error && (
          <div className="err" role="alert">
            {error}
          </div>
        )}

        <label className="field">
          Email
          <input
            className="input"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          Password
          <input
            className="input"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button
          className="btn btn-primary btn-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log in"}
        </button>

        <div className="small muted">
          New here?{" "}
          <Link to="/register" style={{ color: "var(--text)" }}>
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
