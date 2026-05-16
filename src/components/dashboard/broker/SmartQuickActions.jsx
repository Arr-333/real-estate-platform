"use client";

import React, { useEffect, useState } from "react";

export default function SmartQuickActions() {
  const [commission, setCommission] = useState({
    total: 0,
    monthly: 0,
    pending: 0,
    target: 5900000,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/listing");

        if (!res.ok) {
          throw new Error("Failed to fetch properties");
        }

        const response = await res.json();

        console.log("API Response:", response);

        // Handle different response formats
        const properties = Array.isArray(response)
          ? response
          : response.properties || response.data || [];

        if (!Array.isArray(properties)) {
          throw new Error("Invalid properties data format");
        }

        // Filter sold properties
        const soldProperties = properties.filter(
          (property) => property.propertyListStatus?.toUpperCase() === "SOLD"
        );

        // Calculate total sold amount
        const totalAmount = soldProperties.reduce(
          (sum, property) => sum + Number(property.propertyRent || 0),
          0
        );

        const commissionRate = 0.05; // 5%
        const totalCommission = totalAmount * commissionRate;

        // Example monthly + pending calculations
        const monthlyCommission = totalCommission * 0.1;
        const pendingCommission = totalCommission * 0.05;

        setCommission({
          total: totalCommission,
          monthly: monthlyCommission,
          pending: pendingCommission,
          target: 5900000,
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommission();
  }, []);

  const percent = Math.min(
    Math.round((commission.total / commission.target) * 100),
    100
  );

  if (loading) {
    return <p>Loading commission data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <div>
      <div className="sec">
        <div className="sec-title">Smart Quick Actions</div>
      </div>

      <div className="qa-grid">
        {/* Commission Card */}
        <div
          className="qa-card"
          style={{
            background: "var(--color-background-primary)",
          }}
        >
          <div className="qa-icon">💰</div>
          <div className="qa-title">Commission Overview</div>

          <div className="qa-value">
            ₹{(commission.total / 100000).toFixed(1)}L
          </div>

          <div className="qa-sub">
            Earned this year · Target ₹{(commission.target / 100000).toFixed(0)}
            L
          </div>

          {/* Progress bar */}
          <div className="comm-bar">
            <div className="comm-fill" style={{ width: `${percent}%` }}></div>
          </div>

          <div className="comm-row">
            <span>₹0</span>

            <span
              style={{
                color: "#c8a97e",
                fontWeight: 500,
              }}
            >
              {percent}% of target
            </span>

            <span>₹{(commission.target / 100000).toFixed(0)}L</span>
          </div>

          <div className="divider"></div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--color-text-secondary)",
                }}
              >
                This Month
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#2ecc71",
                }}
              >
                ₹{(commission.monthly / 100000).toFixed(1)}L
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--color-text-secondary)",
                }}
              >
                Pending
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#f39c12",
                }}
              >
                ₹{(commission.pending / 100000).toFixed(1)}L
              </div>
            </div>
          </div>

          <div className="qa-action">View full breakdown →</div>
        </div>

        {/* Schedule Card */}
        <div
          className="qa-card"
          style={{
            background: "var(--color-background-primary)",
          }}
        >
          <div className="qa-icon">📅</div>
          <div className="qa-title">Today's Schedule</div>

          {[
            {
              time: "10:00",
              title: "Site Visit — Green Valley Villa",
              client: "Priya Mehta",
              tag: "VISIT",
              color: "#1a5fa8",
              bg: "#e8f4fd",
            },
            {
              time: "12:30",
              title: "Negotiation Call — Arjun Sharma",
              client: "Rajouri Garden",
              tag: "URGENT",
              color: "#a82222",
              bg: "#fde8e8",
            },
          ].map((item, index) => (
            <div className="sched-item" key={index}>
              <div className="sched-time-block">
                <div className="sched-time">{item.time}</div>
                <div className="sched-date">Today</div>
              </div>

              <div>
                <div className="sched-title">{item.title}</div>

                <div className="sched-sub">{item.client}</div>

                <span
                  className="sched-tag"
                  style={{
                    background: item.bg,
                    color: item.color,
                  }}
                >
                  {item.tag}
                </span>
              </div>
            </div>
          ))}

          <div className="qa-action">+ Add to schedule →</div>
        </div>
      </div>
    </div>
  );
}
