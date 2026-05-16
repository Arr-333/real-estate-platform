"use client";
import React, { useEffect, useState } from "react";

export default function Metric() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/listing");
        const data = await res.json();

        console.log("broker 14", data);
        const stateData = data.stats || {};

        // ✅ Safe values
        const active = stateData.ACTIVE || 0;
        const progress = stateData.IN_PROGRESS || 0;
        const sitevisit = stateData.PENDING_SITE_VISIT || 0;
        const processing = stateData.PROCESSING || 0;
        const rejected = stateData.REJECTED || 0;
        const sold = stateData.SOLD || 0;

        // ✅ Dynamic total
        const total = Object.values(stateData).reduce(
          (acc, val) => acc + val,
          0
        );

        setStats({
          totalProperty: total,
          activeProperty: active,
          progress,
          sitevisit,
          sold,
          processing,
          rejected,
          total,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const pct = (val) =>
    stats && stats.total ? Math.round((val / stats.total) * 100) : 0;

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-danger text-center">Failed to load</div>;
  }

  return (
    <div className="metrics">
      <div className="metric">
        <div className="metric-bar" style={{ background: "#c8a97e" }}></div>
        <div className="m-label">Total Properties</div>
        <div className="m-val">{stats.totalProperties}</div>
      </div>

      <div className="metric">
        <div className="metric-bar" style={{ background: "#2ecc71" }}></div>
        <div className="m-label">Sold (YTD)</div>
        <div className="m-val">₹{stats.soldAmount}</div>
      </div>

      <div className="metric">
        <div className="metric-bar" style={{ background: "#3498db" }}></div>
        <div className="m-label">Active Buyers</div>
        <div className="m-val">{stats.activeBuyers}</div>
      </div>

      <div className="metric">
        <div className="metric-bar" style={{ background: "#9b59b6" }}></div>
        <div className="m-label">Commission</div>
        {/* <div className="m-val">₹{stats.commission.toFixed(2)}</div> */}
      </div>

      <div className="metric">
        <div className="metric-bar" style={{ background: "#e74c3c" }}></div>
        <div className="m-label">Deals Closed</div>
        <div className="m-val">{stats.dealsClosed}</div>
      </div>
    </div>
  );
}
