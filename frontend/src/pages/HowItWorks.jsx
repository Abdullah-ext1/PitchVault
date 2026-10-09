import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="page-container page-wide col g24">
      <div
        className="col g12"
        style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center", paddingTop: "20px" }}
      >
        <div className="eyebrow" style={{ marginBottom: "8px" }}>
          Made by founders, for investors
        </div>
        <h1 className="h1" style={{ fontSize: "42px", lineHeight: "1.1" }}>
          How Pitch Vault works
        </h1>
        <p className="t3" style={{ fontSize: "18px", lineHeight: "1.6" }}>
          Founders upload a short video pitch and share what they need. Anyone
          signed in can vote. Investors and founders can request private introductions
          with contact details revealed only upon mutual acceptance.
        </p>
      </div>

      <div className="how" style={{ borderRadius: "16px", marginTop: "16px" }}>
        <div className="how-inner">
          <div className="steps">
            <div>
              <div className="num">01</div>
              <div
                className="fw5"
                style={{ fontSize: "20px", marginBottom: "8px" }}
              >
                Record a short pitch
              </div>
              <p>
                Up to two minutes. Say what you built, who it is for and what
                you need. Upload MP4, WebM or MOV directly from your device.
              </p>
            </div>
            <div>
              <div className="num">02</div>
              <div
                className="fw5"
                style={{ fontSize: "20px", marginBottom: "8px" }}
              >
                Let people vote
              </div>
              <p>
                Anyone signed in can upvote or downvote. Pitches with positive
                community feedback move up the trending and top feeds.
              </p>
            </div>
            <div>
              <div className="num">03</div>
              <div
                className="fw5"
                style={{ fontSize: "20px", marginBottom: "8px" }}
              >
                Make the introduction
              </div>
              <p>
                Investors can ask founders for an intro, and founders can ask
                investors. Email addresses stay private until the request is accepted.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="row wrap g14 center"
        style={{ justifyContent: "center", marginTop: "24px" }}
      >
        <Link to="/discover" className="btn btn-primary btn-hero">
          Browse pitches
        </Link>
        <Link to="/pitches/new" className="btn btn-outline btn-hero">
          Post your first pitch
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
