"use client";

import React, { useState, useEffect } from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function ClientList() {
  const [filter, setFilter] = useState("ALL");

  // 🔥 Client List Pagination
  const {
    data: clientData,
    page: clientPage,
    setPage: setClientPage,
    totalPages: clientTotalPages,
    loading: clientLoading,
  } = usePaginatedFetch("/api/client-activity?limit=5");

  // 🔥 Activity Pagination
  const { data, page, setPage, totalPages, loading } = usePaginatedFetch(
    "/api/client-activity?limit=5"
  );

  const activities = data || [];
  const clientActivities = clientData || [];

  // 🔥 PIPELINE STATS (CORRECT - FULL DATA)
  const [pipelineStats, setPipelineStats] = useState([]);

  useEffect(() => {
    fetch("/api/other/stats")
      .then((res) => res.json())
      .then(setPipelineStats);
  }, []);

  const pipelineMap = {
    INQUIRY: 0,
    SITE_VISIT: 0,
    NEGOTIATING: 0,
    DOCS: 0,
    CLOSED: 0,
  };

  pipelineStats.forEach((item) => {
    pipelineMap[item.status] = item._count.status;
  });

  const total = Object.values(pipelineMap).reduce((a, b) => a + b, 0);

  const pipelineData = [
    {
      stage: "Inquiry",
      count: pipelineMap.INQUIRY,
      width: (pipelineMap.INQUIRY / total) * 100 || 0,
      color: "#c8a97e",
    },
    {
      stage: "Site Visit",
      count: pipelineMap.SITE_VISIT,
      width: (pipelineMap.SITE_VISIT / total) * 100 || 0,
      color: "#3498db",
    },
    {
      stage: "Negotiation",
      count: pipelineMap.NEGOTIATING,
      width: (pipelineMap.NEGOTIATING / total) * 100 || 0,
      color: "#9b59b6",
    },
    {
      stage: "Docs",
      count: pipelineMap.DOCS,
      width: (pipelineMap.DOCS / total) * 100 || 0,
      color: "#f39c12",
    },
    {
      stage: "Closed",
      count: pipelineMap.CLOSED,
      width: (pipelineMap.CLOSED / total) * 100 || 0,
      color: "#2ecc71",
    },
  ];

  // 🔥 CLIENT LIST
  const clients = clientActivities.map((item) => ({
    id: item.id,
    name: item.customer?.user?.name || "Unknown",
    type: "BUYER",
    property: item.property?.propertyTitle || "N/A",
    status: item.status,
  }));

  const filteredClients =
    filter === "ALL" ? clients : clients.filter((c) => c.type === filter);

  const statusClass = {
    HOT: "status-hot",
    ACTIVE: "status-active",
    NEGOTIATING: "status-pending",
    CLOSED: "status-closed",
    PENDING: "status-pending",
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className="grid-a">
      {/* 🔥 CLIENT LIST */}
      <div className="card">
        <div className="sec">
          <div className="sec-title">Client List</div>
          <div className="sec-link">View all →</div>
        </div>

        {/* FILTER */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
          {["ALL", "BUYER", "SELLER", "RENTER"].map((type) => (
            <span
              key={type}
              onClick={() => setFilter(type)}
              style={{
                fontSize: "10px",
                padding: "3px 10px",
                borderRadius: "10px",
                cursor: "pointer",
                background: filter === type ? "#e8f4fd" : "#eee",
                color: filter === type ? "#1a5fa8" : "inherit",
              }}
            >
              {type}
            </span>
          ))}
        </div>

        {/* CLIENT ROWS */}
        {clientLoading ? (
          <p>Loading...</p>
        ) : filteredClients.length === 0 ? (
          <p>No clients</p>
        ) : (
          filteredClients.map((c) => (
            <div className="client-row" key={c.id}>
              <div className="cl-av">{getInitials(c.name)}</div>

              <div>
                <div className="cl-name">{c.name}</div>
                <div className="cl-type">
                  {c.type} · {c.property}
                </div>
              </div>

              <span className={`cl-status ${statusClass[c.status] || ""}`}>
                {c.status}
              </span>
            </div>
          ))
        )}

        {/* 🔥 CLIENT PAGINATION */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setClientPage((p) => p - 1)}
            disabled={clientPage === 1}
          >
            ⬅
          </button>

          <span>
            {clientPage} / {clientTotalPages}
          </span>

          <button
            onClick={() => setClientPage((p) => p + 1)}
            disabled={clientPage === clientTotalPages}
          >
            ➡
          </button>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* 🔥 PIPELINE */}
        <div className="card">
          <div className="sec">
            <div className="sec-title">Deal Pipeline</div>
          </div>

          {pipelineData.map((p, i) => (
            <div className="pipe-item" key={i}>
              <div className="pipe-stage">{p.stage}</div>
              <div className="pipe-bar-wrap">
                <div
                  className="pipe-bar"
                  style={{ width: `${p.width}%`, background: p.color }}
                />
              </div>
              <div className="pipe-count">{p.count}</div>
            </div>
          ))}
        </div>

        {/* 🔥 RECENT ACTIVITY */}
        <div className="card">
          <div className="sec">
            <div className="sec-title">Recent Activity</div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : activities.length === 0 ? (
            <p>No activity found</p>
          ) : (
            activities.map((item) => (
              <div className="act-item" key={item.id}>
                <div className="act-dot" />
                <div>
                  <div className="act-text">
                    {item.customer?.user?.name || "Unknown"} —{" "}
                    {item.property?.propertyTitle || "N/A"}—{" "}
                    {item.status || "N/A"}
                  </div>
                  <div className="act-time">
                    {new Date(item.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* 🔥 ACTIVITY PAGINATION */}
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
      </div>
    </div>
  );
}
