"use client";
import { useEffect, useState } from "react";

export default function KpiStrip() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/owndashboard/kpi")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  if (!data) return <div>Loading...</div>;

  const kpis = [
    {
      label: "Monthly Revenue",
      val: `₹${Math.round(data.monthlyRevenue)}`,
      change: "",
      up: true,
    },
    {
      label: "Commissions Paid",
      val: `₹${Math.round(data.commissionsPaid)}`,
      change: "",
      up: true,
    },
    {
      label: "Active Listings",
      val: data.activeListings,
      change: "",
      up: true,
    },
    {
      label: "Avg. Deal Value",
      val: `₹${Math.round(data.avgDealValue)}`,
      change: "",
      up: true,
    },
    {
      label: "Avg. Days to Close",
      val: `${data.avgDaysToClose}d`,
      change: "",
      up: true,
    },
  ];

  return (
    <div className="kpi-container">
      {kpis.map((k) => (
        <div key={k.label} className="kpi-card">
          <div className="kpi-label">{k.label}</div>

          <div className="kpi-value">{k.val}</div>

          {k.change && (
            <div className={`kpi-change ${k.up ? "kpi-up" : "kpi-down"}`}>
              {k.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
