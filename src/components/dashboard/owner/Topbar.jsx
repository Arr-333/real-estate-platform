// components/Topbar.jsx
"use client";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--gold)",
            fontFamily: "'DM Mono', monospace",
            marginBottom: 5,
          }}
        >
          Owner Dashboard
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--plat)",
            lineHeight: 1.1,
          }}
        >
          Firm Performance
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text3)",
            marginTop: 5,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {today} &nbsp;·&nbsp; Q4 FY2025–26
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        <Btn>↓ Export Report</Btn>
        <Btn>
          🔔 Alerts{" "}
          <span
            style={{
              background: "var(--red)",
              color: "#fff",
              fontSize: 9,
              padding: "1px 5px",
              borderRadius: 8,
              marginLeft: 4,
            }}
          >
            3
          </span>
        </Btn>
        <Btn primary>+ Add Broker</Btn>
      </div>
    </div>
  );
}

function Btn({ children, primary }) {
  return (
    <button
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        cursor: "pointer",
        border: `1px solid ${primary ? "var(--gold)" : "var(--border2)"}`,
        background: primary ? "var(--gold)" : "var(--bg3)",
        color: primary ? "#0d0f14" : "var(--text2)",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {children}
    </button>
  );
}
