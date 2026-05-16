"use client";
import { useEffect, useState } from "react";

export default function PortfolioBanner() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/owndashboard/banner")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  if (!data) return <div>Loading...</div>;

  const stats = [
    {
      label: "Total Portfolio Value",
      val: `₹${data.totalPortfolio}`,
    },
    {
      label: "Gross Revenue",
      val: `₹${data.grossRevenue}`,
    },
    {
      label: "Deals Closed",
      val: data.closedDeals,
    },
    {
      label: "Active Brokers",
      val: data.activeBrokers,
    },
    {
      label: "Avg Commission",
      val: `₹${Math.round(data.avgCommission)}`,
    },
  ];

  return (
    <div className="pbc eee">
      <div className="pbctopLine" />

      {stats.map((s) => (
        <div key={s.label} className="pbcitem">
          <div className="pbclabel">{s.label}</div>
          <div className="pbcvalue">{s.val}</div>
        </div>
      ))}
    </div>
  );
}
