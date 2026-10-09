import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import UploadProgress from "../components/UploadProgress";

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

const PitchCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError("Video file size must not exceed 50MB");
      return;
    }

    if (!["video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
      setError("Only MP4, WebM, and MOV video formats are supported");
      return;
    }

    setVideoFile(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation matching backend constraints
    const titleTrim = formData.title.trim();
    const taglineTrim = formData.tagline.trim();
    const problemTrim = formData.problem.trim();
    const solutionTrim = formData.solution.trim();

    if (titleTrim.length < 5) {
      setError("Title must be at least 5 characters long (currently " + titleTrim.length + ")");
      return;
    }

    if (taglineTrim.length < 10) {
      setError("One line summary must be at least 10 characters long (currently " + taglineTrim.length + ")");
      return;
    }

    if (problemTrim.length < 20) {
      setError("The problem description must be at least 20 characters long (currently " + problemTrim.length + ")");
      return;
    }

    if (solutionTrim.length < 20) {
      setError("What you built must be at least 20 characters long (currently " + solutionTrim.length + ")");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.stage) {
      setError("Please select a stage");
      return;
    }

    if (!videoFile) {
      setError("Video file is required");
      return;
    }

    if (formData.lookingFor.length === 0) {
      setError("Please select at least one option for 'Looking For'");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", titleTrim);
    data.append("tagline", taglineTrim);
    data.append("problem", problemTrim);
    data.append("solution", solutionTrim);
    data.append("category", formData.category);
    data.append("stage", formData.stage);

    formData.lookingFor.forEach((item) => {
      data.append("lookingFor", item);
    });

    if (formData.askAmountInr) {
      data.append("askAmountInr", formData.askAmountInr);
    }

    if (formData.equityOfferedBps) {
      data.append("equityOfferedBps", formData.equityOfferedBps);
    }

    if (formData.websiteUrl && formData.websiteUrl.trim()) {
      let url = formData.websiteUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      data.append("websiteUrl", url);
    }

    data.append("video", videoFile);

    try {
      const response = await API.post("/pitches", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      navigate(`/pitches/${response.data.data.pitch._id}`);
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMsg = err.response.data.errors
          .map((e) => e.message || `${e.field} is invalid`)
          .join(" • ");
        setError(errorMsg);
      } else {
        setError(err.response?.data?.message || "Failed to create pitch");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="page-container page-narrow col g24">
      <h1 className="h1">Post a pitch</h1>

      <form onSubmit={handleSubmit} className="col g20" noValidate>
        {error && (
          <div
            className="err"
            role="alert"
            style={{
              padding: "12px 16px",
              background: "rgba(255, 122, 89, 0.12)",
              border: "1px solid var(--coral)",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <section className="card">
          <h2 className="card-title">Details</h2>
          <label className="field">
            Name * (minimum 5 characters)
            <input
              type="text"
              name="title"
              required
              minLength={5}
              maxLength={60}
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. ClinicNote"
            />
          </label>

          <label className="field">
            One line summary * (minimum 10 characters)
            <input
              type="text"
              name="tagline"
              required
              minLength={10}
              maxLength={120}
              value={formData.tagline}
              onChange={handleChange}
              className="input"
              placeholder="What it does, in one sentence"
            />
            <span className="help">
              What it does in one sentence. (min 10 characters, current:{" "}
              {formData.tagline.trim().length})
            </span>
          </label>

          <label className="field">
            The problem * (minimum 20 characters)
            <textarea
              name="problem"
              required
              minLength={20}
              maxLength={500}
              value={formData.problem}
              onChange={handleChange}
              className="input"
              placeholder="Describe the problem you are solving (at least 20 characters)"
            />
            <span className="help">
              Current length: {formData.problem.trim().length}/500 (min 20)
            </span>
          </label>

          <label className="field">
            What you built * (minimum 20 characters)
            <textarea
              name="solution"
              required
              minLength={20}
              maxLength={500}
              value={formData.solution}
              onChange={handleChange}
              className="input"
              placeholder="Describe your product and solution (at least 20 characters)"
            />
            <span className="help">
              Current length: {formData.solution.trim().length}/500 (min 20)
            </span>
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
          <div
            className={`drop ${videoFile ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <span>
              {videoFile
                ? `${videoFile.name} · ${(
                    videoFile.size /
                    1024 /
                    1024
                  ).toFixed(1)} MB`
                : "Drop your pitch video here or click to choose"}
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              hidden
            />
          </div>
          <div className="help">
            MP4, WebM or MOV. Up to 50 MB and two minutes.
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">The ask</h2>
          <fieldset>
            <legend className="legend">What are you looking for? *</legend>
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
                placeholder="5000000"
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
                placeholder="6"
              />
            </label>
          </div>

          <label className="field">
            Website (optional)
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com"
            />
          </label>
        </section>

        <UploadProgress progress={uploadProgress} />

        <div className="row g12">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
          <Link to="/my-pitches" className="btn btn-outline btn-lg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PitchCreate;
