import React from "react";

// ===== BrokerLeaderboard =====
const BROKERS = [
  {
    initials: "RK",
    name: "Rajan Kapoor",
    sub: "Senior · Gurgaon",
    deals: 31,
    rev: "₹2.9Cr",
    conv: "68%",
    convColor: "var(--green)",
    rating: "4.9",
    pct: 88,
    barColor: "var(--gold)",
    bg: "#fdf3e8",
    fg: "#8a5500",
  },
  {
    initials: "SP",
    name: "Sneha Patel",
    sub: "Senior · Delhi",
    deals: 24,
    rev: "₹2.1Cr",
    conv: "61%",
    convColor: "var(--green)",
    rating: "4.7",
    pct: 74,
    barColor: "var(--blue)",
    bg: "#e8f4fd",
    fg: "#1a5fa8",
  },
  {
    initials: "AM",
    name: "Aditya Malhotra",
    sub: "Mid · Noida",
    deals: 17,
    rev: "₹1.4Cr",
    conv: "54%",
    convColor: "var(--green)",
    rating: "4.5",
    pct: 58,
    barColor: "var(--green)",
    bg: "#edf9f0",
    fg: "#1e7e4a",
  },
  {
    initials: "NV",
    name: "Neha Verma",
    sub: "Mid · Gurgaon",
    deals: 13,
    rev: "₹1.1Cr",
    conv: "48%",
    convColor: "var(--orange)",
    rating: "4.3",
    pct: 48,
    barColor: "var(--purple)",
    bg: "#f5eefa",
    fg: "#6c22a8",
  },
  {
    initials: "KS",
    name: "Kabir Singh",
    sub: "Junior · Ghaziabad",
    deals: 9,
    rev: "₹0.72Cr",
    conv: "39%",
    convColor: "var(--red)",
    rating: "4.1",
    pct: 35,
    barColor: "var(--orange)",
    bg: "#fff0f0",
    fg: "#a82222",
  },
  {
    initials: "PT",
    name: "Pradeep Tiwari",
    sub: "Junior · Delhi",
    deals: 6,
    rev: "₹0.51Cr",
    conv: "29%",
    convColor: "var(--red)",
    rating: "3.9",
    pct: 24,
    barColor: "var(--red)",
    bg: "#e8f4fd",
    fg: "#1a5fa8",
  },
];

export default function BrokerLeaderboard() {
  return (
    <div className="d-card">
      <div className="d-header">
        <div className="d-title">Broker Leaderboard — Mar 2026</div>
        <span className="d-link">Manage Team →</span>
      </div>

      {BROKERS.map((b, i) => (
        <div
          key={b.name}
          className="d-row d-gap-md"
          style={{ padding: "9px 0" }}
        >
          <div className="d-value">{i + 1}</div>

          <div className="d-row d-gap-sm" style={{ flex: 1 }}>
            <div className="d-avatar" style={{ background: b.bg, color: b.fg }}>
              {b.initials}
            </div>

            <div>
              <div>{b.name}</div>
              <div className="d-label">{b.sub}</div>

              <div className="d-progress" style={{ width: 80 }}>
                <div
                  className="d-progress-fill"
                  style={{ width: `${b.pct}%`, background: b.barColor }}
                />
              </div>
            </div>
          </div>

          <div>{b.deals}</div>
          <div style={{ color: "var(--gold2)" }}>{b.rev}</div>
          <div style={{ color: b.convColor }}>{b.conv}</div>
          <div>★ {b.rating}</div>
        </div>
      ))}
    </div>
  );
}
