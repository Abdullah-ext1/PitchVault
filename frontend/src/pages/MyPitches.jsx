import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const MyPitches = () => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyPitches();
  }, []);

  const fetchMyPitches = async () => {
    try {
      const response = await API.get("/pitches/mine");
      setPitches(response.data.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pitches");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card empty">
        <p className="t3">Loading your pitches...</p>
      </div>
    );
  }

  const totalScore = pitches.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalUpvotes = pitches.reduce((sum, p) => sum + (p.upvoteCount || 0), 0);
  const totalDownvotes = pitches.reduce((sum, p) => sum + (p.downvoteCount || 0), 0);

  return (
    <div className="page-container page-wide col g24">
      <div className="row wrap g12 center between">
        <h1 className="h1">My pitches</h1>
        <Link to="/pitches/new" className="btn btn-primary">
          Post a pitch
        </Link>
      </div>

      {error && (
        <div className="err" role="alert">
          {error}
        </div>
      )}

      {/* Stats summary */}
      <div className="stats">
        <div className="card stat">
          <div className="l">Pitches live</div>
          <div className="v">{pitches.length}</div>
        </div>
        <div className="card stat">
          <div className="l">Net votes</div>
          <div className="v">{totalScore >= 0 ? `+${totalScore}` : totalScore}</div>
        </div>
        <div className="card stat">
          <div className="l">Upvotes</div>
          <div className="v">{totalUpvotes}</div>
        </div>
        <div className="card stat">
          <div className="l">Downvotes</div>
          <div className="v">{totalDownvotes}</div>
        </div>
      </div>

      {/* Pitch list */}
      {pitches.length === 0 ? (
        <div className="card empty">
          <div className="card-title">You haven't posted any pitches yet</div>
          <p className="t3">
            Post a short video pitch to share what you are building with investors.
          </p>
          <Link
            to="/pitches/new"
            className="btn btn-primary"
            style={{ alignSelf: "flex-start", marginTop: "8px" }}
          >
            Post your first pitch
          </Link>
        </div>
      ) : (
        <section className="card">
          <h2 className="card-title">Your pitches</h2>
          <div>
            {pitches.map((pitch) => (
              <div key={pitch._id} className="list-row">
                <div>
                  <Link
                    to={`/pitches/${pitch._id}`}
                    className="plain fw5"
                    style={{ marginRight: "12px" }}
                  >
                    {pitch.title}
                  </Link>
                  <span className="small muted">
                    {pitch.stage} · {pitch.category}
                  </span>
                </div>
                <div className="row g14 center">
                  <span className="lime fw5">
                    {(pitch.score || 0) >= 0
                      ? `+${pitch.score || 0}`
                      : pitch.score || 0}
                  </span>
                  <Link
                    to={`/pitches/${pitch._id}/edit`}
                    className="small"
                    style={{ color: "var(--text)" }}
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/pitches/${pitch._id}`}
                    className="small"
                    style={{ color: "var(--lime)" }}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MyPitches;
