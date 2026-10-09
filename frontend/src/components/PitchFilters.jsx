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

const PitchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="col g14">
      {/* Category chips */}
      <div
        className="row wrap g8"
        role="group"
        aria-label="Filter by category"
      >
        <button
          type="button"
          className={`chip ${!filters.category ? "active" : ""}`}
          aria-pressed={!filters.category}
          onClick={() => onFilterChange({ category: "" })}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${filters.category === cat ? "active" : ""}`}
            aria-pressed={filters.category === cat}
            onClick={() =>
              onFilterChange({
                category: filters.category === cat ? "" : cat,
              })
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stage and Looking for dropdowns */}
      <div className="row wrap g12">
        <label className="field" style={{ flex: "1 1 180px" }}>
          Stage
          <select
            value={filters.stage || ""}
            onChange={(e) => onFilterChange({ stage: e.target.value })}
            className="input input-surface"
          >
            <option value="">All Stages</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </label>

        <label className="field" style={{ flex: "1 1 180px" }}>
          Looking for
          <select
            value={filters.lookingFor || ""}
            onChange={(e) => onFilterChange({ lookingFor: e.target.value })}
            className="input input-surface"
          >
            <option value="">All Options</option>
            {lookingForOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default PitchFilters;
