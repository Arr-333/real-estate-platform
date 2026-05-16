import React from "react";

// These stats would come from your DB/API once you have customer-specific models
// e.g. saved/liked properties count, application count, visit count, message count
// For now wired to real /api/listing for total available + session-based counts

type StatCardProps = {
  title: string;
  value: string | number;
  sub: string;
  trend: "up" | "down" | "neutral";
  iconClass: string;
  colorClass: string;
};

function StatCard({
  title,
  value,
  sub,
  trend,
  iconClass,
  colorClass,
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-danger"
        : "text-muted";
  const trendIcon =
    trend === "up"
      ? "la-arrow-up"
      : trend === "down"
        ? "la-arrow-down"
        : "la-minus";

  return (
    <div className="col-sm-6 col-xl-3">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-start justify-content-between mb-4">
            <div>
              <p className="text-muted fs-13 mb-1">{title}</p>
              <h4 className="fw-semibold font-monospace mb-0">{value}</h4>
            </div>
            <div className={`avatar size-10 rounded-3 ${colorClass}`}>
              <i className={`las ${iconClass} fs-20`} />
            </div>
          </div>
          <p className={`fs-13 mb-0 ${trendColor}`}>
            <i className={`las ${trendIcon} me-1`} />
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function CustomerStats() {
  // Fetch total available properties count from real API
  let totalAvailable = 0;
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listing`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      totalAvailable = Array.isArray(data)
        ? data.filter(
            (p: { propertyListStatus: string }) =>
              p.propertyListStatus === "ACTIVE"
          ).length
        : 0;
    }
  } catch {
    totalAvailable = 0;
  }

  // Replace these with real customer-specific DB queries when those models exist
  const stats: StatCardProps[] = [
    {
      title: "Properties Available",
      value: totalAvailable || "—",
      sub: "Verified & active listings",
      trend: totalAvailable > 0 ? "up" : "neutral",
      iconClass: "la-home",
      colorClass: "bg-primary-subtle text-primary",
    },
    {
      title: "Saved Properties",
      value: 12,
      sub: "4 new matches today",
      trend: "up",
      iconClass: "la-heart",
      colorClass: "bg-danger-subtle text-danger",
    },
    {
      title: "Site Visits",
      value: 5,
      sub: "2 upcoming this week",
      trend: "neutral",
      iconClass: "la-calendar-check",
      colorClass: "bg-success-subtle text-success",
    },
    {
      title: "Applications",
      value: 3,
      sub: "1 under review",
      trend: "neutral",
      iconClass: "la-file-alt",
      colorClass: "bg-warning-subtle text-warning",
    },
  ];

  return (
    <>
      {stats.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </>
  );
}
