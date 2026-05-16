"use client";

import React from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function CommissionBreakdown() {
  const { data, loading, page, setPage, totalPages } = usePaginatedFetch(
    "/api/owndashboard/brokdetail?limit=5"
  );

  const brokers = data || [];

  return (
    <div className="d-card">
      <div className="d-header">
        <div className="d-title">Your Brokers</div>
      </div>

      {/* 🔥 LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : brokers.length === 0 ? (
        <p>No brokers found</p>
      ) : (
        brokers.map((b) => (
          <div
            key={b.brokerId}
            className="d-row d-gap-md"
            style={{ padding: "12px 0", alignItems: "center" }}
          >
            {/* ICON */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--bg3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              👨‍💼
            </div>

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{b.name}</div>

              <div className="d-label">
                Properties handled: {b.totalProperties}
              </div>
            </div>

            {/* STATUS */}
            <span
              className="d-badge"
              style={{
                background: "rgba(52,152,219,0.12)",
                color: "var(--blue)",
              }}
            >
              Active
            </span>
          </div>
        ))
      )}

      {/* 🔥 PAGINATION */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          ⬅ Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
