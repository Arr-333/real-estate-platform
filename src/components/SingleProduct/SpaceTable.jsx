"use client";
import { useState } from "react";
import { formatRate } from "../../lib/helper";

export default function SpacesTable({ spaces, rateType, setRateType }) {
  const [openRow, setOpenRow] = useState(null);

  return (
    <div className="card border-0 shadow-sm mb-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0 fw-semibold">
          All Available Spaces{" "}
          <span className="badge bg-danger">{spaces.length}</span>
        </h6>

        <select
          className="form-select form-select-sm w-auto"
          value={rateType}
          onChange={(e) => setRateType(e.target.value)}
        >
          <option value="yr">₹/SF/YR</option>
          <option value="mo">₹/SF/MO</option>
          <option value="amt_yr">₹ Amt/YR</option>
          <option value="amt_mo">₹ Amt/MO</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr className="small text-muted">
              <th>SPACE</th>
              <th>SIZE</th>
              <th>LEASE</th>
              <th>RATE</th>
              <th>TYPE</th>
              <th>FIT-OUT</th>
              <th></th>
            </tr>
          </thead>

          {spaces.map((s, i) => (
            <tbody key={i}>
              <tr className="border-bottom">
                {/* Space */}
                <td className="fw-medium text-primary">
                  {s.id}
                  <div>
                    <button
                      className="btn btn-link p-0 small text-decoration-none"
                      onClick={() => setOpenRow(openRow === i ? null : i)}
                    >
                      ▾ View Details & Photos
                    </button>
                  </div>
                </td>

                {/* Size */}
                <td>{s.size} SF</td>

                {/* Lease */}
                <td className="text-muted">{s.lease || "Negotiable"}</td>

                {/* Rate */}
                <td className="fw-semibold">{formatRate(s, rateType)}</td>

                {/* Type */}
                <td>Office</td>

                {/* Fit */}
                <td>
                  <span className="badge bg-light text-dark border">
                    {s.fit || "Full Build-Out"}
                  </span>
                </td>

                {/* Availability */}
                <td>
                  <span className="text-success fw-semibold small">Now</span>
                </td>
              </tr>

              {/* Expand Row */}
              {openRow === i && (
                <tr className="bg-light">
                  <td colSpan="7">
                    <div className="p-3">
                      <p className="mb-2 text-muted">{s.desc}</p>

                      <div className="d-flex flex-wrap gap-2">
                        {s.features?.map((f, idx) => (
                          <span
                            key={idx}
                            className="badge bg-secondary-subtle text-dark border"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
