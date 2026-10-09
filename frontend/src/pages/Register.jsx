import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "founder",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
      await register(
        formData.fullName,
        formData.email,
        formData.password,
        formData.role
      );
      navigate("/discover");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1 className="h1">Create an account</h1>
        {error && (
          <div className="err" role="alert">
            {error}
          </div>
        )}

        <fieldset>
          <legend className="legend">I am joining as</legend>
          <div className="roles">
            <label
              className={`role ${
                formData.role === "founder" ? "checked" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="founder"
                checked={formData.role === "founder"}
                onChange={handleChange}
              />
              <span className="fw5">Founder</span>
              <span className="small muted">
                Post pitches and ask investors for intros.
              </span>
            </label>
            <label
              className={`role ${
                formData.role === "investor" ? "checked" : ""
              }`}
            >
              <input
                type="radio"
                name="role"
                value="investor"
                checked={formData.role === "investor"}
                onChange={handleChange}
              />
              <span className="fw5">Investor</span>
              <span className="small muted">
                Browse pitches and list your profile.
              </span>
            </label>
          </div>
          <div className="help" style={{ marginTop: "8px" }}>
            You cannot change this later.
          </div>
        </fieldset>

        <label className="field">
          Full name
          <input
            className="input"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </label>

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
            minLength={8}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="help">At least 8 characters.</span>
        </label>

        <button
          className="btn btn-primary btn-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="small muted">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--text)" }}>
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
