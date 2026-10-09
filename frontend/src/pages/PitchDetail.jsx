import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import VideoPlayer from "../components/VideoPlayer";
import VoteButtons from "../components/VoteButtons";

const inr = (n) => {
  if (!n) return "Not raising yet";
  if (n >= 1e7) return `₹${+(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${+(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const inrFull = (n) => {
  if (!n) return "Not raising yet";
  return `₹${n.toLocaleString("en-IN")}`;
};

const initials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const PitchDetail = () => {
  const { pitchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPitch();
  }, [pitchId]);

  const fetchPitch = async () => {
    try {
      const response = await API.get(`/pitches/${pitchId}`);
      setPitch(response.data.data.pitch);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pitch");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this pitch? Its votes go with it.")) return;

    setDeleting(true);
    try {
      await API.delete(`/pitches/${pitchId}`);
      navigate("/my-pitches");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete pitch");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card empty">
        <p className="t3">Loading pitch...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card empty">
        <div className="err" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-outline btn-sm" style={{ marginTop: "12px" }}>
          Back to Discover
        </Link>
      </div>
    );
  }

  if (!pitch) return null;

  const isOwner = user?._id === pitch.owner?._id;
  const equityPct = pitch.equityOfferedBps
    ? `${(pitch.equityOfferedBps / 100).toFixed(2)}%`
    : null;
  const askFormatted = pitch.askAmountInr
    ? inr(pitch.askAmountInr)
    : "Not raising yet";
  const ownerName = pitch.owner?.fullName || "Founder";

  return (
    <div className="page-container page-wide col g24">
      <Link to="/" className="back">
        ← Back to Discover
      </Link>

      <div className="detail">
        <div className="detail-main">
          {pitch.video?.secureUrl && (
            <VideoPlayer
              videoUrl={pitch.video.secureUrl}
              title={pitch.title}
            />
          )}

          <h1 className="h1">{pitch.title}</h1>

          <div className="row g12 center">
            <div className="avatar" style={{ "--s": "40px" }}>
              {initials(ownerName)}
            </div>
            <div>
              <div className="fw5">{ownerName}</div>
              <div className="small muted">
                Founder · {pitch.owner?.bio || "Pitch Vault Founder"}
              </div>
            </div>
          </div>

          <div className="desc">
            <div>
              <div className="small muted" style={{ marginBottom: "4px" }}>
                Problem
              </div>
              <p>{pitch.problem}</p>
            </div>
            <div>
              <div className="small muted" style={{ marginBottom: "4px" }}>
                Solution
              </div>
              <p>{pitch.solution}</p>
            </div>
          </div>

          <section className="card">
            <h2 className="card-title">The ask</h2>
            <dl className="kv">
              <div>
                <dt>Raising</dt>
                <dd>{pitch.askAmountInr ? inrFull(pitch.askAmountInr) : "Not raising yet"}</dd>
              </div>
              <div>
                <dt>Equity offered</dt>
                <dd>{equityPct || "None"}</dd>
              </div>
              <div>
                <dt>Stage</dt>
                <dd>{pitch.stage}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{pitch.category}</dd>
              </div>
              {pitch.websiteUrl && (
                <div>
                  <dt>Website</dt>
                  <dd>
                    <a
                      href={pitch.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pitch.websiteUrl}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="card">
            <h2 className="card-title">Looking for</h2>
            <div className="row wrap g8">
              {pitch.lookingFor?.map((item) => (
                <span key={item} className="pill">
                  {item}
                </span>
              ))}
            </div>
            <p className="t3" style={{ lineHeight: 1.5, marginTop: "8px" }}>
              Contact details are shared only when an introduction request is accepted,
              and only with the two people involved.
            </p>
          </section>
        </div>

        <aside className="card detail-aside">
          <div className={`price ${pitch.askAmountInr ? "" : "off"}`}>
            {askFormatted}
          </div>
          {equityPct && (
            <div className="small muted" style={{ marginTop: "-8px" }}>
              for {equityPct} equity
            </div>
          )}

          <div className="row wrap g8">
            <span className="pill">{pitch.stage}</span>
            <span className="pill">{pitch.category}</span>
          </div>

          {isOwner ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-outline danger"
            >
              {deleting ? "Deleting..." : "Delete pitch"}
            </button>
          ) : !user ? (
            <Link to="/login" className="btn btn-primary btn-lg">
              Log in to request an intro
            </Link>
          ) : user.role === "investor" ? (
            <Link to="/inbox" className="btn btn-primary btn-lg">
              Request introduction
            </Link>
          ) : null}

          <div className="row wrap g8">
            <VoteButtons
              pitchId={pitch._id}
              initialUpvotes={pitch.upvoteCount}
              initialDownvotes={pitch.downvoteCount}
              initialScore={pitch.score}
              initialMyVote={0}
              isOwner={isOwner}
            />
          </div>

          <div className="small muted">
            {isOwner
              ? "Votes show up on your dashboard."
              : user?.role === "investor"
              ? "Your email stays hidden until the founder accepts."
              : "Introductions are between founders and investors."}
          </div>

          {pitch.websiteUrl && (
            <a
              className="small"
              href={pitch.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {pitch.websiteUrl}
            </a>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PitchDetail;
