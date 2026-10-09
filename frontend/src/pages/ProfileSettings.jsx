import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    linkedinUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        bio: user.bio || "",
        linkedinUrl: user.linkedinUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch("/users/me", formData);
      setSuccess("Your profile is up to date.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-narrow col g20">
      <h1 className="h1">Settings</h1>

      {success && (
        <div className="notice" role="status">
          <b>Saved.</b> <span className="t3">{success}</span>
        </div>
      )}

      {error && (
        <div className="err" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="col g18" noValidate>
        <section className="card">
          <h2 className="card-title">Profile</h2>

          <label className="field">
            Display name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="input"
              required
            />
          </label>

          <label className="field">
            Email
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="input"
              style={{ opacity: 0.6 }}
            />
            <span className="help">Email cannot be changed.</span>
          </label>

          <label className="field">
            Role
            <input
              type="text"
              value={
                user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : "Founder"
              }
              disabled
              className="input"
              style={{ opacity: 0.6 }}
            />
            <span className="help">
              Set when you signed up. It cannot be changed.
            </span>
          </label>

          <label className="field">
            LinkedIn
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </label>

          <label className="field">
            Bio
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              className="input"
              style={{ minHeight: "80px" }}
              placeholder="Tell us about yourself..."
            />
            <span className="help">
              {formData.bio.length}/500 characters
            </span>
          </label>
        </section>

        <div className="row g12">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <Link to="/" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
