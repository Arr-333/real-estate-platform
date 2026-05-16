"use client";
import React, { useEffect, useState } from "react";

export default function StatusBreakdown() {
  const [data, setData] = useState({
    total: 0,
    available: 0,
    sold: 0,
    pending: 0,
    rented: 0,
  });

  useEffect(() => {
    fetch("/api/listing")
      .then((res) => res.json())
      .then((properties) => {
        const total = properties.data.length;

        const available = properties.data.filter(
          (p) => p.propertyListStatus === "ACTIVE"
        ).length;

        const sold = properties.data.filter(
          (p) => p.propertyListStatus === "SOLD"
        ).length;

        const pending = properties.data.filter(
          (p) => p.propertyListStatus === "PENDING"
        ).length;

        const rented = properties.data.filter(
          (p) => p.propertyListStatus === "RENTED"
        ).length;

        setData({ total, available, sold, pending, rented });
      });
  }, []);

  const { total, available, sold, pending, rented } = data;
  console.log(data);

  // % calculations
  const calcPct = (val) => (total ? Math.round((val / total) * 100) : 0);

  const availablePct = calcPct(available);
  const soldPct = calcPct(sold);
  const pendingPct = calcPct(pending);
  const rentedPct = calcPct(rented);

  // SVG circle math
  const circumference = 2 * Math.PI * 36;

  const getDash = (value) =>
    `${(value / 100) * circumference} ${circumference}`;

  let offset = 0;

  const rings = [
    { color: "#3498db", value: availablePct },
    { color: "#2ecc71", value: soldPct },
    { color: "#f39c12", value: pendingPct },
    { color: "#9b59b6", value: rentedPct },
  ];

  return (
    <div className="col col-lg-4 col-sm-12 card m-2">
      <div className="sec">
        <div className="sec-title">Property Status Breakdown</div>
      </div>

      <div className="status-ring-wrap">
        <div className="ring-chart">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r="36"
              fill="none"
              stroke="var(--color-background-secondary)"
              strokeWidth="10"
            />

            {rings.map((r, i) => {
              const dash = getDash(r.value);
              const circle = (
                <circle
                  key={i}
                  cx="45"
                  cy="45"
                  r="36"
                  fill="none"
                  stroke={r.color}
                  strokeWidth="10"
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                />
              );
              offset += (r.value / 100) * circumference;
              return circle;
            })}
          </svg>

          <div className="ring-center">
            <div className="ring-num">{total}</div>
            <div className="ring-lbl">Total</div>
          </div>
        </div>

        {/* STATUS LIST */}
        <div className="status-list">
          <div className="sl-item">
            <div className="sl-dot" style={{ background: "#3498db" }}></div>
            <div className="sl-label">Available</div>
            <div className="sl-count">{available}</div>
            <div className="sl-pct">{availablePct}%</div>
          </div>

          <div className="sl-item">
            <div className="sl-dot" style={{ background: "#2ecc71" }}></div>
            <div className="sl-label">Sold</div>
            <div className="sl-count">{sold}</div>
            <div className="sl-pct">{soldPct}%</div>
          </div>

          <div className="sl-item">
            <div className="sl-dot" style={{ background: "#f39c12" }}></div>
            <div className="sl-label">Pending</div>
            <div className="sl-count">{pending}</div>
            <div className="sl-pct">{pendingPct}%</div>
          </div>

          <div className="sl-item">
            <div className="sl-dot" style={{ background: "#9b59b6" }}></div>
            <div className="sl-label">Rented</div>
            <div className="sl-count">{rented}</div>
            <div className="sl-pct">{rentedPct}%</div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Career Stats (dummy for now) */}
      <div
        className="sec-title"
        style={{ marginBottom: "10px", fontSize: "12px" }}
      >
        Total Properties Handled (Career)
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "6px",
        }}
      >
        <div className="ss-box">
          <div className="ss-num" style={{ color: "#2ecc71" }}>
            {sold}
          </div>
          <div className="ss-lbl">Sold</div>
        </div>

        <div className="ss-box">
          <div className="ss-num" style={{ color: "#3498db" }}>
            {available}
          </div>
          <div className="ss-lbl">Available</div>
        </div>

        <div className="ss-box">
          <div className="ss-num" style={{ color: "#9b59b6" }}>
            {rented}
          </div>
          <div className="ss-lbl">Rented</div>
        </div>
      </div>
    </div>
  );
}
