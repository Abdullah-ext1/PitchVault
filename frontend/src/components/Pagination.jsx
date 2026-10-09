const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="pager" aria-label="Pages" style={{ marginTop: "12px" }}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="chip"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`chip ${currentPage === page ? "active" : ""}`}
              aria-pressed={currentPage === page}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          );
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return (
            <span
              key={page}
              className="chip"
              style={{ border: 0, padding: "0 8px", cursor: "default" }}
            >
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="chip"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
