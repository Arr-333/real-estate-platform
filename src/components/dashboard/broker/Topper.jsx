import React from "react";

export default function Topper() {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Broker Dashboard</div>
          <div className="page-sub">
            Monday, 16 March 2026 · Delhi NCR · Last updated: 10:42 AM
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn">⬇ Export</button>
          <button className="btn">📊 Report</button>
          <button className="btn btn-gold">＋ Add Property</button>
        </div>
      </div>
    </>
  );
}
