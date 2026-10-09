import { Link } from "react-router-dom";

const inr = (n) => {
  if (!n) return "Not raising yet";
  if (n >= 1e7) return `₹${+(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${+(n / 1e5).toFixed(2)}L`;
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

const playIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const PitchCard = ({ pitch, showVotes = false }) => {
  const ownerName = pitch.owner?.fullName || "Founder";
  const equityPct = pitch.equityOfferedBps
    ? `${(pitch.equityOfferedBps / 100).toFixed(0)}%`
    : null;
  const askStr = pitch.askAmountInr
    ? `${inr(pitch.askAmountInr)}${equityPct ? ` for ${equityPct}` : ""}`
    : "Not raising yet";

  const lookingStr =
    pitch.lookingFor && pitch.lookingFor.length > 0
      ? pitch.lookingFor.join(", ")
      : "Connections";

  return (
    <article className="card post">
      <div className="row g12 center">
        <div className="avatar" style={{ "--s": "40px" }}>
          {initials(ownerName)}
        </div>
        <div>
          <div className="fw5">
            <span className="plain">{ownerName}</span>
          </div>
          <div className="small muted">
            {pitch.category} · {pitch.stage}
          </div>
        </div>
      </div>

      <p className="caption">{pitch.tagline || pitch.title}</p>

      <Link
        to={`/pitches/${pitch._id}`}
        className="thumb"
        style={{ "--h": "220px" }}
      >
        {pitch.video?.thumbnailUrl ? (
          <img
            src={pitch.video.thumbnailUrl}
            alt={pitch.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <span className="thumb-title">{pitch.title}</span>
        <span className="thumb-play">{playIcon}</span>
      </Link>

      <div className="offer">
        <span className="t">
          {pitch.stage} stage · looking for {lookingStr}
        </span>
        <span className="row g14 center">
          <b className="lime">{askStr}</b>
          <Link
            to={`/pitches/${pitch._id}`}
            className="btn btn-primary btn-sm"
          >
            View pitch
          </Link>
        </span>
      </div>

      {showVotes && (
        <div className="actions">
          <span className="row wrap center g14 small muted">
            <span>↑ {pitch.upvoteCount || 0}</span>
            <span>↓ {pitch.downvoteCount || 0}</span>
            <span className="lime">Score: {pitch.score || 0}</span>
          </span>
        </div>
      )}
    </article>
  );
};

export default PitchCard;
