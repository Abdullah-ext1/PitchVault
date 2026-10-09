import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PitchCard from "../components/PitchCard";
import PitchFilters from "../components/PitchFilters";
import Pagination from "../components/Pagination";

const Discover = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pitches, setPitches] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const filters = {
    sort: searchParams.get("sort") || "trending",
    category: searchParams.get("category") || "",
    stage: searchParams.get("stage") || "",
    lookingFor: searchParams.get("lookingFor") || "",
    q: searchParams.get("q") || "",
    page: searchParams.get("page") || "1",
  };

  useEffect(() => {
    fetchPitches();
  }, [searchParams]);

  const fetchPitches = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params[key] = filters[key];
      });

      const response = await API.get("/pitches", { params });
      setPitches(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch pitches");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedParams = { ...filters, ...newFilters, page: "1" };
    Object.keys(updatedParams).forEach((key) => {
      if (!updatedParams[key]) delete updatedParams[key];
    });
    setSearchParams(updatedParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange({ q: searchQuery });
  };

  const handlePageChange = (page) => {
    handleFilterChange({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-container page-narrow col g24">
      {/* Sort tabs */}
      <div className="row wrap g10" role="group" aria-label="Sort pitches">
        {[
          ["trending", "Trending"],
          ["new", "New"],
          ["top", "Top"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`chip ${filters.sort === key ? "active" : ""}`}
            aria-pressed={filters.sort === key}
            onClick={() => handleFilterChange({ sort: key })}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Founder Composer Prompt */}
      {user?.role === "founder" && (
        <Link className="card composer" to="/pitches/new">
          <div className="avatar" style={{ "--s": "32px" }}>
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "F"}
          </div>
          <span className="fake">Share a pitch with investors...</span>
          <span className="btn btn-primary btn-sm">Post</span>
        </Link>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearch} className="row g10">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, problem or idea"
          aria-label="Search pitches"
          className="input input-surface grow"
        />
        <button type="submit" className="btn btn-outline btn-sm">
          Search
        </button>
      </form>

      {/* Filter chips & selectors */}
      <PitchFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Feed content */}
      {loading ? (
        <div className="card empty">
          <p className="t3">Loading pitches...</p>
        </div>
      ) : error ? (
        <div className="err" role="alert">
          {error}
        </div>
      ) : pitches.length === 0 ? (
        <div className="card empty">
          <div className="card-title">No pitches match</div>
          <p className="t3">
            Try a different search term, or clear your filters.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ alignSelf: "flex-start", marginTop: "8px" }}
            onClick={() => {
              setSearchQuery("");
              handleFilterChange({
                q: "",
                category: "",
                stage: "",
                lookingFor: "",
              });
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="col g18">
          {pitches.map((pitch) => (
            <PitchCard key={pitch._id} pitch={pitch} showVotes />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Discover;
