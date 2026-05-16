"use client";

import React, { useState } from "react";

export default function QuickActions() {
  const [range, setRange] = useState("Weekly");

  // ✅ Dummy dynamic data
  const data = {
    Weekly: { commission: 12480.25, target: 16000 },
    Monthly: { commission: 48200.5, target: 60000 },
    Yearly: { commission: 320000, target: 500000 },
  };

  const current = data[range];

  const percentage = Math.round((current.commission / current.target) * 100);

  return (
    <div className="col-lg-6 col-xxl-4">
      <div className="card card-h-100">
        {/* Header */}
        <div className="card-header d-flex align-items-center flex-wrap gap-2">
          <h5 className="card-title mb-0 flex-grow-1">Smart Quick Actions</h5>
        </div>

        <div className="card-body">
          {/* Commission Box */}
          <div className="bg-light p-5 rounded mb-5">
            <div className="d-flex flex-wrap gap-4">
              <div className="flex-grow-1">
                <p className="text-muted mb-2">Total Commission Earned</p>

                <h4 className="font-monospace mb-0">
                  ₹{current.commission.toLocaleString()}
                </h4>
              </div>

              {/* ✅ Working Dropdown */}
              <div className="dropdown flex-shrink-0">
                <button
                  className="link link-custom-primary badge bg-body-secondary d-flex align-items-center fs-13 py-2 px-3 dropdown-toggle border-0"
                  data-bs-toggle="dropdown"
                >
                  {range}
                </button>

                <div className="dropdown-menu dropdown-menu-end">
                  {["Weekly", "Monthly", "Yearly"].map((item) => (
                    <button
                      key={item}
                      className="dropdown-item"
                      onClick={() => setRange(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Target</span>
              <h6 className="fw-medium mb-0">
                ₹{current.target.toLocaleString()}
              </h6>
            </div>

            <div className="progress progress-2">
              <div
                className="progress-bar"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <small className="text-muted">{percentage}% achieved</small>
          </div>

          {/* Buttons */}
          <div className="row g-4">
            <div className="col-md-6">
              <button
                onClick={() => alert("Add Client Clicked")}
                className="btn w-100 p-4 btn-outline-light border text-reset rounded-3"
              >
                <i className="ri-user-add-line fs-4"></i>
                <p className="fw-medium mt-1">Add Client</p>
              </button>
            </div>

            <div className="col-md-6">
              <button
                onClick={() => alert("Schedule Clicked")}
                className="btn w-100 p-4 btn-outline-light border text-reset rounded-3"
              >
                <i className="ri-calendar-event-line fs-4"></i>
                <p className="fw-medium mt-1">Schedule</p>
              </button>
            </div>

            <p className="text-muted mt-3 text-center">
              Steady growth across all regions this {range.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
