"use client";

import React, { useEffect, useState } from "react";

/* ================= TYPES ================= */
type Visit = {
  id: number;
  status: "INQUIRY" | "PENDING" | "COMPLETED" | "CANCELLED";
  property?: {
    title?: string;
    city?: string;
  };
  broker?: {
    user?: {
      name?: string;
    };
  };
  owner?: {
    user?: {
      name?: string;
    };
  };
};

export default function ScheduledVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "completed" | "all">(
    "upcoming"
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  /* ================= FETCH ================= */
  const fetchVisits = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/client-activity?page=${page}&limit=${limit}`
      );

      const data = await res.json();

      // ✅ Safe handling
      setVisits(Array.isArray(data?.data) ? data.data : []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [page]);

  /* ================= FILTER ================= */
  const filtered = (visits || []).filter((v) => {
    if (filter === "upcoming")
      return v.status === "INQUIRY" || v.status === "PENDING";

    if (filter === "completed")
      return v.status === "COMPLETED" || v.status === "CANCELLED";

    return true;
  });

  return (
    <div className="col-xl-6 col-xxl-6">
      <div className="card card-h-100">
        {/* ================= HEADER ================= */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Visits</h5>

          <div className="d-flex gap-1">
            {["upcoming", "completed", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`btn btn-sm ${
                  filter === f ? "btn-primary" : "btn-light"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="card-body">
          {loading && <p>Loading...</p>}

          {!loading && filtered.length === 0 && (
            <p className="text-muted">No visits found</p>
          )}

          {!loading &&
            filtered.map((visit) => (
              <div key={visit.id} className="border p-3 mb-2 rounded">
                <h6 className="mb-1">{visit.property?.title || "No Title"}</h6>

                <p className="text-muted mb-2">
                  {visit.property?.city || "No Location"}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-info">{visit.status}</span>

                  {visit.broker && (
                    <span className="badge bg-secondary">
                      Broker: {visit.broker.user?.name || "N/A"}
                    </span>
                  )}

                  {visit.owner && (
                    <span className="badge bg-dark">
                      Owner: {visit.owner.user?.name || "N/A"}
                    </span>
                  )}
                </div>
              </div>
            ))}

          {/* ================= PAGINATION ================= */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              className="btn btn-sm btn-outline-primary"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
