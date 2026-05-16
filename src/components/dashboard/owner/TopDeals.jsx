"use client";

import React from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function TopDeals({ role = "BROKER" }) {
  const { data, loading, page, setPage, totalPages } = usePaginatedFetch(
    "/api/client-activity?limit=5"
  );

  // 🔥 Transform API Data → UI Format
  const deals = (data || []).map((item) => {
    const statusColor =
      item.status === "CLOSED"
        ? "var(--green)"
        : item.status === "NEGOTIATING"
          ? "var(--blue)"
          : item.status === "SITE_VISIT"
            ? "var(--blue)"
            : "var(--orange)";

    return {
      id: item.id,
      name: item.property?.propertyTitle || "N/A",
      location: item.property?.location || item.property?.city || "N/A",
      price: item.property?.propertyRent
        ? `₹${Number(item.property.propertyRent).toLocaleString()}`
        : "N/A",

      broker: item.broker?.user?.name || "N/A",
      owner: item.owner?.user?.name || "N/A",

      status: item.status?.replace("_", " ") || "N/A",
      statusColor,
    };
  });

  return (
    <div className="d-card">
      {/* 🔥 HEADER */}
      <div className="d-header">
        <div className="d-title">Top Active Deals</div>
        <span className="d-link">View all →</span>
      </div>

      {/* 🔥 CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : deals.length === 0 ? (
        <p>No deals found</p>
      ) : (
        deals.map((d) => (
          <div
            key={d.id}
            className="d-row d-gap-md"
            style={{ padding: "11px 0", alignItems: "center" }}
          >
            {/* ICON */}
            <div
              className="d-row"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "var(--bg3)",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🏠
            </div>

            {/* PROPERTY INFO */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{d.name}</div>

              <div className="d-label">{d.location}</div>

              {/* 🔥 ROLE BASED DISPLAY */}
              <div className="d-label">
                {role === "BROKER"
                  ? `Owner: ${d.owner}`
                  : `Broker: ${d.broker}`}
              </div>
            </div>

            {/* PRICE */}
            <div style={{ color: "var(--gold2)", fontWeight: 500 }}>
              {d.price}
            </div>

            {/* STATUS */}
            <span
              className="d-badge"
              style={{
                background: `${d.statusColor}22`,
                color: d.statusColor,
                fontSize: "10px",
                padding: "4px 10px",
                borderRadius: "12px",
                fontWeight: 500,
              }}
            >
              {d.status}
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
