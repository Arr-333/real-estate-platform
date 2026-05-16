"use client";
import { useEffect, useState } from "react";

export default function DealPipeline() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client-activity")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data.pipeline || []).map((p) => ({
          name: p.name,
          count: p.count,
          green: p.name === "Closed",
        }));

        setStages(formatted);
      })
      .catch((err) => {
        console.error("Pipeline error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="d-card">
      {/* HEADER */}
      <div className="d-header">
        <div className="d-title">Firm-Wide Deal Pipeline</div>
      </div>

      {/* PIPELINE */}
      <div className="d-row">
        {stages.map((s, i) => (
          <div
            key={s.name}
            className="d-col"
            style={{
              flex: 1,
              padding: "14px 12px",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderLeft: i > 0 ? "none" : "",
              borderRadius:
                i === 0
                  ? "10px 0 0 10px"
                  : i === stages.length - 1
                    ? "0 10px 10px 0"
                    : "",
              textAlign: "center",
            }}
          >
            <div className="d-label">{s.name}</div>

            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: s.green ? "var(--green)" : "var(--plat)",
                margin: "5px 0",
              }}
            >
              {s.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
