import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const categories = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "SaaS",
  "AI",
  "Consumer",
  "Climate",
  "Other",
];
const stages = ["Idea", "MVP", "Launched", "Revenue"];
const lookingForOptions = [
  "Funding",
  "Mentorship",
  "CoFounder",
  "BetaUsers",
  "Introductions",
];

const PitchEdit = () => {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    problem: "",
    solution: "",
    category: "",
    stage: "",
    lookingFor: [],
    askAmountInr: "",
    equityOfferedBps: "",
    websiteUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPitch();
  }, [pitchId]);

  const fetchPitch = async () => {
    try {
      const response = await API.get(`/pitches/${pitchId}`);
      const p = response.data.data.pitch;
      setFormData({
        title: p.title || "",
        tagline: p.tagline || "",
        problem: p.problem || "",
        solution: p.solution || "",
        category: p.category || "",
        stage: p.stage || "",
        lookingFor: p.lookingFor || [],
        askAmountInr: p.askAmountInr || "",
        equityOfferedBps: p.equityOfferedBps || "",
        websiteUrl: p.websiteUrl || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pitch");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLookingForToggle = (option) => {
    const newLookingFor = formData.lookingFor.includes(option)
      ? formData.lookingFor.filter((item) => item !== option)
      : [...formData.lookingFor, option];
    setFormData({ ...formData, lookingFor: newLookingFor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "") {
        payload[key] = formData[key];
      }
    });

    try {
      await API.patch(`/pitches/${pitchId}`, payload);
      navigate(`/pitches/${pitchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update pitch");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card empty">
        <p className="t3">Loading pitch...</p>
      </div>
    );
  }

  return (
    <div className="page-container page-narrow col g24">
      <h1 className="h1">Edit pitch</h1>

      <form onSubmit={handleSubmit} className="col g20" noValidate>
        {error && (
          <div className="err" role="alert">
            {error}
          </div>
        )}

        <section className="card">
          <h2 className="card-title">Details</h2>
          <label className="field">
            Name *
            <input
              type="text"
              name="title"
              required
              maxLength={60}
              value={formData.title}
              onChange={handleChange}
              className="input"
            />
          </label>

          <label className="field">
            One line summary *
            <input
              type="text"
              name="tagline"
              required
              maxLength={120}
              value={formData.tagline}
              onChange={handleChange}
              className="input"
            />
            <span className="help">What it does, in one sentence.</span>
          </label>

          <label className="field">
            The problem *
            <textarea
              name="problem"
              required
              maxLength={500}
              value={formData.problem}
              onChange={handleChange}
              className="input"
            />
          </label>

          <label className="field">
            What you built *
            <textarea
              name="solution"
              required
              maxLength={500}
              value={formData.solution}
              onChange={handleChange}
              className="input"
            />
          </label>

          <div className="row wrap g14">
            <label className="field" style={{ flex: "1 1 200px" }}>
              Category *
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" style={{ flex: "1 1 200px" }}>
              Stage *
              <select
                name="stage"
                required
                value={formData.stage}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select stage</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">Video</h2>
          <p className="t3" style={{ lineHeight: 1.5 }}>
            The video cannot be changed after posting. To use a different video,
            delete this pitch and post a new one.
          </p>
        </section>

        <section className="card">
          <h2 className="card-title">The ask</h2>
          <fieldset>
            <legend className="legend">What are you looking for?</legend>
            <div className="row wrap g8">
              {lookingForOptions.map((opt) => {
                const isSelected = formData.lookingFor.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`chip ${isSelected ? "active" : ""}`}
                    aria-pressed={isSelected}
                    onClick={() => handleLookingForToggle(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="row wrap g14">
            <label className="field" style={{ flex: "1 1 200px" }}>
              Amount you are raising (₹)
              <input
                type="number"
                name="askAmountInr"
                min="0"
                value={formData.askAmountInr}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label className="field" style={{ flex: "1 1 200px" }}>
              Equity offered (%)
              <input
                type="number"
                name="equityOfferedBps"
                min="0"
                max="100"
                step="0.01"
                value={
                  formData.equityOfferedBps
                    ? formData.equityOfferedBps / 100
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    equityOfferedBps: e.target.value
                      ? parseFloat(e.target.value) * 100
                      : "",
                  })
                }
                className="input"
              />
            </label>
          </div>

          <label className="field">
            Website
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="input"
            />
          </label>
        </section>

        <div className="row g12">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <Link to={`/pitches/${pitchId}`} className="btn btn-outline btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PitchEdit;
