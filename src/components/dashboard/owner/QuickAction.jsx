import React from "react";

const ACTIONS = [
  {
    emoji: "➕",
    title: "Onboard Broker",
    desc: "Add a new broker to the team with RERA verification and target assignment.",
  },
  {
    emoji: "📊",
    title: "Generate P&L Report",
    desc: "Export monthly or quarterly revenue, commission and expense breakdown.",
  },
  {
    emoji: "🎯",
    title: "Set Broker Targets",
    desc: "Assign monthly deal and revenue targets to individual brokers for Q1.",
  },
  {
    emoji: "🔍",
    title: "Audit Deals",
    desc: "Review flagged transactions, pending legal docs, and compliance status.",
  },
];

export default function QuickAction() {
  return (
    <>
      <div className="d-title" style={{ marginBottom: 12 }}>
        Owner Quick Actions
      </div>

      <div className="d-grid-4">
        {ACTIONS.map((a) => (
          <div
            key={a.title}
            className="d-col d-gap-sm"
            style={{
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "var(--bg3)",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 22 }}>{a.emoji}</div>
            <div>{a.title}</div>
            <div className="d-label">{a.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
