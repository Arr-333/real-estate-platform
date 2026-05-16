import React from "react";
import RecentActivity from "@/components/dashboard/owner/RecentActivity";

const ALERT_BG = {
  red: "rgba(255,95,95,0.07)",
  orange: "rgba(245,166,35,0.07)",
  green: "rgba(61,214,140,0.07)",
  blue: "rgba(77,157,224,0.07)",
};

const ALERT_BORDER = {
  red: "rgba(255,95,95,0.2)",
  orange: "rgba(245,166,35,0.2)",
  green: "rgba(61,214,140,0.2)",
  blue: "rgba(77,157,224,0.2)",
};

const ALERTS = [
  {
    color: "red",
    icon: "⚠️",
    text: "Prestige Tower docs unsigned — 3 days overdue",
    time: "2h ago",
  },
  {
    color: "orange",
    icon: "🕐",
    text: "Kabir Singh below monthly target — 39% conversion",
    time: "Today",
  },
  {
    color: "green",
    icon: "✅",
    text: "DLF Villa registration verified by legal team",
    time: "Yesterday",
  },
  {
    color: "blue",
    icon: "ℹ️",
    text: "New RERA update may affect 5 listed properties",
    time: "2 days ago",
  },
];

export default function AlertActivity() {
  return (
    <>
      <div className="asd">
        <div className=" d-col d-gap-lg">
          <div className="d-card">
            <div className="d-header">
              <div className="d-title">Owner Alerts</div>
              <span className="d-link">View all →</span>
            </div>

            {ALERTS.map((a) => (
              <div
                key={a.text}
                className="d-row d-gap-md"
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: `1px solid ${ALERT_BORDER[a.color]}`,
                  background: ALERT_BG[a.color],
                }}
              >
                <span>{a.icon}</span>
                <div>
                  <div>{a.text}</div>
                  <div className="d-label">{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          <>
            <RecentActivity />
          </>
        </div>
      </div>
    </>
  );
}
