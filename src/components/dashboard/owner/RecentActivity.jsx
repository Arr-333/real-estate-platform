"use client";

import React from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function RecentActivity() {
  const { data, loading, page, setPage, totalPages } = usePaginatedFetch(
    "/api/client-activity?limit=5"
  );

  const activities = data || [];

  return (
    <div className="d-card">
      <div className="d-title">Recent Activity</div>

      {/* 🔥 LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p>No activity found</p>
      ) : (
        activities.map((item) => {
          const color =
            item.status === "CLOSED"
              ? "var(--green)"
              : item.status === "NEGOTIATING"
                ? "var(--blue)"
                : item.status === "SITE_VISIT"
                  ? "var(--blue)"
                  : "var(--orange)";

          return (
            <div key={item.id} className="d-row d-gap-md">
              {/* DOT */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  marginTop: 6,
                }}
              />

              {/* CONTENT */}
              <div>
                {/* TEXT */}
                <div>
                  {item.customer?.user?.name || "Unknown"} —{" "}
                  {item.property?.propertyTitle || "N/A"} —{" "}
                  {item.status?.replace("_", " ")}—{" "}
                  {item.property?.propertyUpdatedOn || "N/A"}
                </div>

                {/* BROKER */}
                <span
                  className="d-badge"
                  style={{
                    background: `${color}22`,
                    color: color,
                  }}
                >
                  {item.broker?.user?.name || "N/A"}
                </span>

                {/* TIME */}
                <div className="d-label">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })
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
