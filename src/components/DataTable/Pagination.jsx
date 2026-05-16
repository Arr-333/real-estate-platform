export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="d-flex justify-content-between mt-3">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="btn btn-sm btn-outline-primary"
      >
        Prev
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        className="btn btn-sm btn-outline-primary"
      >
        Next
      </button>
    </div>
  );
}
