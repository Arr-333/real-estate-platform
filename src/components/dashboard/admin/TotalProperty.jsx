"use client";

import { useState } from "react";
import TotalPropertiesChart from "./TotalPropertyChart";

export default function Dashboard() {
  const [range, setRange] = useState("monthly");

  return (
    <div className="col-xxl-6">
      <div className="card">
        <div className="card-header d-flex flex-wrap gap-3 align-items-center">
          <div className="flex-grow-1">
            <h5 className="card-title mb-2">Total Properties</h5>
            <p className="text-muted">
              Insight into your total property portfolio distribution.
            </p>
          </div>

          {/* ✅ Working Toggle */}
          <ul className="nav nav-pills bg-body-tertiary p-1 rounded">
            <li className="nav-item">
              <button
                className={`nav-link fs-13 ${
                  range === "monthly" ? "active" : ""
                }`}
                onClick={() => setRange("monthly")}
              >
                Monthly
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link fs-13 ${
                  range === "weekly" ? "active" : ""
                }`}
                onClick={() => setRange("weekly")}
              >
                Weekly
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          <TotalPropertiesChart range={range} />
        </div>
      </div>
    </div>
  );
}
