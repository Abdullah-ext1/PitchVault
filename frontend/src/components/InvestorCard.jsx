import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initials = (name) => {
  if (!name) return "INV";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const InvestorCard = ({ investor }) => {
  const { user } = useAuth();
  const name = investor.fullName || investor.name || "Investor";
  const firm = investor.firm || "Independent angel";
  const sectors = investor.sectors || ["FinTech", "SaaS"];
  const stages = investor.stages || ["MVP", "Launched"];

  return (
    <div className="card" style={{ padding: "18px", gap: "12px" }}>
      <div className="row g12 center">
        <div className="avatar" style={{ "--s": "44px" }}>
          {initials(name)}
        </div>
        <div>
          <div className="fw5">{name}</div>
          <div className="small muted">{firm}</div>
        </div>
      </div>

      <div className="trio">
        <div>
          <span>Sectors</span>
          <span>{sectors.join(", ")}</span>
        </div>
        <div>
          <span>Stages</span>
          <span>{stages.join(", ")}</span>
        </div>
        <div>
          <span>Status</span>
          <span>Taking intros</span>
        </div>
      </div>

      <div className="row between center wrap g8">
        <span className="lime fw5">Active</span>
        <span className="row g8">
          {user?.role === "founder" && (
            <Link to="/inbox" className="btn btn-primary btn-sm">
              Request intro
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default InvestorCard;
