"use client";

import React from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function RevenueChart() {
  const { data, loading } = usePaginatedFetch("/api/listing");

  const properties = data?.data || [];

  // 🔥 Month Map
  const monthMap = {
    Apr: 0,
    May: 0,
    Jun: 1,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Jan: 0,
    Feb: 0,
    Mar: 0,
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  properties.forEach((p) => {
    if (p.propertyListStatus !== "ACTIVE") return; // 🔥 filter

    const date = new Date(p.propertyCreatedOn);
    const month = monthNames[date.getMonth()];

    if (monthMap[month] !== undefined) {
      monthMap[month] += Number(p.propertyRent || 0);
    }
  });

  const monthsData = Object.entries(monthMap).map(([label, revenue]) => ({
    label,
    revenue,
  }));

  const max = Math.max(...monthsData.map((m) => m.revenue), 1);

  return (
    <div className="rev-card">
      <div className="rev-header">
        <div className="rev-title">Monthly Revenue</div>
      </div>

      <div className="rev-chart">
        {loading ? (
          <p>Loading...</p>
        ) : (
          monthsData.map((m, i) => (
            <div key={m.label} className="rev-bar-wrap">
              <div
                className="rev-bar"
                style={{ height: `${(m.revenue / max) * 100}%` }}
              />
              <div className="rev-label">{m.label}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
