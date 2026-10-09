import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const samplePitches = [
  {
    _id: "clinicnote",
    title: "ClinicNote",
    founderName: "Rhea Kapoor",
    category: "HealthTech",
    askText: "₹50L for 6%",
    duration: "1:24",
    link: "/discover",
  },
  {
    _id: "ledgerlite",
    title: "LedgerLite",
    founderName: "Sana Sheikh",
    category: "FinTech",
    askText: "₹1.2Cr for 10%",
    duration: "1:58",
    link: "/discover",
  },
  {
    _id: "tiffintrack",
    title: "TiffinTrack",
    founderName: "Arjun Mehta",
    category: "Consumer",
    askText: "₹30L for 8%",
    duration: "1:41",
    link: "/discover",
  },
];

const inr = (n) => {
  if (!n) return "Not raising yet";
  if (n >= 1e7) return `₹${+(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${+(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const playIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);

const Landing = () => {
  const [featuredPitches, setFeaturedPitches] = useState([]);
  const [latestPitch, setLatestPitch] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Fetch top featured pitches
  useEffect(() => {
    const fetchTopPitches = async () => {
      try {
        const response = await API.get("/pitches", {
          params: { sort: "top", limit: 3 },
        });
        const items = response.data?.data?.items || [];
        if (items.length > 0) {
          setFeaturedPitches(items);
        } else {
          setFeaturedPitches([]);
        }
      } catch (err) {
        setFeaturedPitches([]);
      }
    };
    fetchTopPitches();
  }, []);

  // Fetch the latest pitch video and poll to update when a new one is uploaded
  useEffect(() => {
    const fetchLatestPitch = async () => {
      try {
        const response = await API.get("/pitches", {
          params: { sort: "new", limit: 1 },
        });
        const items = response.data?.data?.items || [];
        if (items.length > 0 && items[0].video?.secureUrl) {
          setLatestPitch(items[0]);
        }
      } catch (err) {
        console.error("Failed to load latest pitch:", err);
      }
    };

    fetchLatestPitch();
    const interval = setInterval(fetchLatestPitch, 15000);
    return () => clearInterval(interval);
  }, []);

  const displayPitches =
    featuredPitches.length > 0
      ? featuredPitches.slice(0, 3).map((p) => ({
          _id: p._id,
          title: p.title,
          founderName: p.owner?.fullName || "Founder",
          category: p.category,
          askText: p.askAmountInr
            ? `${inr(p.askAmountInr)}${
                p.equityOfferedBps
                  ? ` for ${(p.equityOfferedBps / 100).toFixed(0)}%`
                  : ""
              }`
            : "Not raising yet",
          thumbnailUrl: p.video?.thumbnailUrl,
          duration: p.video?.durationSec
            ? `${Math.floor(p.video.durationSec / 60)}:${String(
                Math.floor(p.video.durationSec % 60)
              ).padStart(2, "0")}`
            : "1:30",
          link: `/pitches/${p._id}`,
        }))
      : samplePitches;

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Made by founders, for investors</div>
          <h1>Show your startup. Get introduced.</h1>
          <p>
            Founders upload a short video and say what they need. Investors
            browse, vote on what stands out and ask for an introduction. Nobody
            sees an email address until someone says yes.
          </p>
          <div className="row wrap g14">
            <Link to="/discover" className="btn btn-primary btn-hero">
              Browse pitches
            </Link>
            <Link to="/pitches/new" className="btn btn-outline btn-hero">
              Post your first pitch
            </Link>
          </div>
        </div>

        {/* Dynamic Continuous Video Box */}
        <div className="mock" aria-hidden="false">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>

          <div
            className="thumb"
            style={{
              "--h": "210px",
              position: "relative",
              background: "#000",
              overflow: "hidden",
            }}
          >
            {latestPitch?.video?.secureUrl ? (
              <video
                src={latestPitch.video.secureUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <span className="thumb-play">{playIcon}</span>
            )}

            <span
              className="thumb-title"
              style={{
                zIndex: 2,
                background: "rgba(15, 16, 18, 0.78)",
                padding: "3px 8px",
                borderRadius: "4px",
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              {latestPitch?.title || "ClinicNote"}
            </span>

            <span
              className="thumb-dur"
              style={{
                zIndex: 2,
                background: "rgba(15, 16, 18, 0.8)",
                padding: "3px 7px",
                borderRadius: "6px",
                color: "var(--lime)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {latestPitch?.video?.durationSec
                ? `${Math.floor(latestPitch.video.durationSec / 60)}:${String(
                    Math.floor(latestPitch.video.durationSec % 60)
                  ).padStart(2, "0")}`
                : "1:24"}
            </span>
          </div>

          <div className="tracks">
            <div className="track">
              <span className="clip lime" style={{ width: "34%" }}>
                Problem
              </span>
              <span className="clip blue" style={{ width: "22%" }}>
                Demo
              </span>
              <span className="clip lime" style={{ width: "30%" }}>
                Traction
              </span>
            </div>
            <div className="track" style={{ paddingLeft: "12%" }}>
              <span className="clip coral" style={{ width: "26%" }}>
                The ask
              </span>
              <span className="clip blue" style={{ width: "40%" }}>
                Team
              </span>
            </div>
            <div className="track">
              <span className="clip gray" style={{ width: "70%" }}>
                Captions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - placed first right after Hero */}
      <section className="how" id="how">
        <div className="how-inner">
          <h2 className="l-h2" style={{ marginBottom: "36px" }}>
            How it works
          </h2>
          <div className="steps">
            <div>
              <div className="num">01</div>
              <div
                className="fw5"
                style={{ fontSize: "18px", marginBottom: "8px" }}
              >
                Record a short pitch
              </div>
              <p>
                Up to two minutes. Say what you built, who it is for and what
                you need.
              </p>
            </div>
            <div>
              <div className="num">02</div>
              <div
                className="fw5"
                style={{ fontSize: "18px", marginBottom: "8px" }}
              >
                Let people vote
              </div>
              <p>
                Anyone signed in can upvote or downvote. The pitches people
                respond to move up the feed.
              </p>
            </div>
            <div>
              <div className="num">03</div>
              <div
                className="fw5"
                style={{ fontSize: "18px", marginBottom: "8px" }}
              >
                Make the introduction
              </div>
              <p>
                Investors ask founders for an intro, and founders can ask
                investors. Emails open up once it is accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pitches Section */}
      <section className="l-sec">
        <h2 className="l-h2">Featured pitches</h2>
        <div className="grid-cards">
          {displayPitches.map((p) => (
            <div key={p._id} className="p-card">
              <Link
                to={p.link}
                className="thumb"
                style={{ "--h": "180px", display: "flex" }}
              >
                {p.thumbnailUrl ? (
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
                <span className="thumb-title">{p.title}</span>
                <span className="thumb-play">{playIcon}</span>
                <span className="thumb-dur">{p.duration}</span>
              </Link>
              <div className="p-body">
                <div
                  className="fw5"
                  style={{ fontSize: "17px", marginBottom: "6px" }}
                >
                  {p.title}
                </div>
                <div
                  className="small muted"
                  style={{ fontSize: "14px", marginBottom: "16px" }}
                >
                  by {p.founderName} · {p.category}
                </div>
                <div className="row between center">
                  <span className="lime fw5">{p.askText}</span>
                  <Link
                    to={p.link}
                    style={{ fontSize: "14px", color: "var(--text)" }}
                  >
                    View pitch
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For Investors Section */}
      <section className="sell" id="investors">
        <div style={{ flex: "1 1 380px" }}>
          <h2 className="l-h2" style={{ marginBottom: "12px" }}>
            Looking for teams to back?
          </h2>
          <p>
            Set your sectors, stages and cheque size once. Founders can ask you
            for an introduction, and you can ask them.
          </p>
        </div>
        <Link to="/register" className="btn btn-primary btn-hero">
          Join as an investor
        </Link>
      </section>

      {/* Footer */}
      <footer className="l-foot">
        <span className="muted">© Pitch Vault</span>
        <div className="links">
          <Link to="/">Terms</Link>
          <Link to="/">Privacy</Link>
          <Link to="/">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
