import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InvestorCard from "../components/InvestorCard";

const sectorsList = [
  "All",
  "FinTech",
  "HealthTech",
  "EdTech",
  "SaaS",
  "AI",
  "Consumer",
  "Climate",
];

const Investors = () => {
  const { user } = useAuth();
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await API.get("/investors");
      setInvestors(response.data.data.items || response.data.data || []);
    } catch (err) {
      // Endpoint may not be seeded or configured on backend yet
      setInvestors([]);
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestors = investors.filter((inv) => {
    const matchesSector =
      selectedSector === "All" ||
      (inv.sectors && inv.sectors.includes(selectedSector));
    const s = search.trim().toLowerCase();
    const matchesSearch =
      !s ||
      (inv.fullName && inv.fullName.toLowerCase().includes(s)) ||
      (inv.firm && inv.firm.toLowerCase().includes(s));
    return matchesSector && matchesSearch;
  });

  return (
    <div className="page-container page-wide col g24">
      <div className="row wrap g12 center between">
        <h1 className="h1">Investors</h1>
        {!user ? (
          <Link to="/register" className="btn btn-primary">
            Join as an investor
          </Link>
        ) : user.role === "investor" ? (
          <Link to="/settings/profile" className="btn btn-primary">
            Edit your listing
          </Link>
        ) : null}
      </div>

      <input
        className="input input-surface"
        type="search"
        placeholder="Search by name or firm"
        aria-label="Search investors"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row wrap g8" role="group" aria-label="Filter by sector">
        {sectorsList.map((sector) => (
          <button
            key={sector}
            type="button"
            className={`chip ${selectedSector === sector ? "active" : ""}`}
            aria-pressed={selectedSector === sector}
            onClick={() => setSelectedSector(sector)}
          >
            {sector}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card empty">
          <p className="t3">Loading investors...</p>
        </div>
      ) : error ? (
        <div className="err" role="alert">
          {error}
        </div>
      ) : filteredInvestors.length === 0 ? (
        <div className="card empty">
          <div className="card-title">No investors found</div>
          <p className="t3">
            {investors.length === 0
              ? "The investor directory will display verified investors taking introductions."
              : "Try another sector or clear your search."}
          </p>
        </div>
      ) : (
        <div className="cards-2">
          {filteredInvestors.map((inv, idx) => (
            <InvestorCard key={inv._id || idx} investor={inv} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Investors;
