"use client";

import { useEffect, useState } from "react";

const COLORS = {
  Available: "#4d9de0",
  Sold: "#3dd68c",
  Pending: "#f5a623",
  Rented: "#a78bfa",
};

export default function PropertyStatus() {
  const [counts, setCounts] = useState({
    Available: 0,
    Sold: 0,
    Pending: 0,
    Rented: 0,
    total: 0,
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listing")
      .then((r) => r.json())
      .then((d) => {
        const s = d?.stats || {};
        const properties = d?.data || [];

        // 🔥 STATUS COUNTS
        const available = s.ACTIVE || 0;
        const sold = s.SOLD || 0;
        const pending =
          (s.PENDING_SITE_VISIT || 0) +
          (s.IN_PROGRESS || 0) +
          (s.PROCESSING || 0);
        const rented = s.DEACTIVE || 0;

        const total = available + sold + pending + rented;

        setCounts({
          Available: available,
          Sold: sold,
          Pending: pending,
          Rented: rented,
          total,
        });

        // 🔥 CITY REVENUE CALCULATION
        const cityMap = {};

        properties.forEach((p) => {
          const city = p.city?.cityName || "Unknown";

          if (!cityMap[city]) {
            cityMap[city] = 0;
          }

          cityMap[city] += Number(p.propertyRent || 0);
        });

        // 🔥 Convert to array
        const cityArr = Object.entries(cityMap).map(([name, value]) => ({
          name,
          value,
        }));

        // 🔥 Sort descending
        cityArr.sort((a, b) => b.value - a.value);

        // 🔥 Normalize for UI
        const max = Math.max(...cityArr.map((c) => c.value), 1);

        const formatted = cityArr.slice(0, 5).map((c, i) => ({
          name: c.name,
          val: `₹${c.value.toLocaleString()}`,
          pct: (c.value / max) * 100,
          color: [
            "var(--gold)",
            "var(--blue)",
            "var(--green)",
            "var(--purple)",
            "var(--orange)",
          ][i % 5],
        }));

        setCities(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const { Available, Sold, Pending, Rented, total } = counts;

  const circumference = 2 * Math.PI * 40;

  const segments = [
    { key: "Available", color: COLORS.Available, count: Available },
    { key: "Sold", color: COLORS.Sold, count: Sold },
    { key: "Pending", color: COLORS.Pending, count: Pending },
    { key: "Rented", color: COLORS.Rented, count: Rented },
  ];

  let offset = 0;

  return (
    <div className="ps-card">
      {/* HEADER */}
      <div className="ps-header">
        <div className="ps-title">Property Status</div>
        <span className="ps-badge">{total} Total</span>
      </div>

      {/* MAIN */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="ps-main">
            {/* RING */}
            <div className="ps-ring">
              <svg
                viewBox="0 0 100 100"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />

                {total > 0 &&
                  segments.map((seg) => {
                    const arc = (seg.count / total) * circumference;

                    const circle = (
                      <circle
                        key={seg.key}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="12"
                        strokeDasharray={`${arc} ${circumference - arc}`}
                        strokeDashoffset={-offset}
                      />
                    );

                    offset += arc;
                    return circle;
                  })}
              </svg>

              <div className="ps-center">
                <div className="ps-center-val">{total}</div>
                <div className="ps-center-label">Listings</div>
              </div>
            </div>

            {/* LEGEND */}
            <div className="ps-legend">
              {segments.map((seg) => (
                <div key={seg.key} className="ps-leg-row">
                  <div className="ps-dot" style={{ background: seg.color }} />
                  <div className="ps-leg-name">{seg.key}</div>
                  <div className="ps-leg-val">{seg.count}</div>
                  <div className="ps-leg-pct">
                    {total ? Math.round((seg.count / total) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ps-divider" />

          {/* CITY SECTION */}
          <div className="ps-city-title">Revenue by City</div>

          <div className="ps-city-list">
            {cities.length === 0 ? (
              <p>No data</p>
            ) : (
              cities.map((c, i) => (
                <div key={c.name} className="ps-city-row">
                  <div
                    className="ps-rank"
                    style={{
                      color: i < 2 ? "var(--gold)" : "var(--text3)",
                    }}
                  >
                    {i + 1}
                  </div>

                  <div className="ps-city-name">{c.name}</div>

                  <div className="ps-bar">
                    <div
                      className="ps-bar-fill"
                      style={{
                        width: `${c.pct}%`,
                        background: c.color,
                      }}
                    />
                  </div>

                  <div className="ps-city-val">{c.val}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
