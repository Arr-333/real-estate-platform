"use client";

import React, { useEffect, useState } from "react";

export default function PropertyStatus() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/listing/"); // adjust path as needed
        const data = await res.json();

        const stateData = data.stats || {};
        console.log("API RESPONSE:", data);

        const total = Object.values(stateData || {}).reduce(
          (sum, val) => sum + Number(val || 0),
          0
        );

        setStats({
          totalProperty: total,
          activeProperty: stateData.ACTIVE,
          progress: stateData.IN_PROGRESS,
          sitevisit: stateData.PENDING_SITE_VISIT,
          sold: stateData.SOLD,
          processing: stateData.PROCESSING,
          reject: stateData.REJECTED,

          total,
        });
      } catch (err) {
        console.error("Failed to fetch property stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const pct = (val) => (stats ? Math.round((val / stats.total) * 100) : 0);

  return (
    <>
      <div className="col-md-6">
        <div className="card card-h-100">
          <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
            <h5 className="card-title mb-0">Property Status Breakdown</h5>
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
              All Time
            </span>
          </div>
          <div className="card-body pt-6">
            {loading ? (
              <div className="text-center py-4 text-muted">Loading...</div>
            ) : !stats ? (
              <div className="text-center py-4 text-danger">
                Failed to load data.
              </div>
            ) : (
              <>
                <div className="border rounded-3 shadow">
                  <div className="row g-0">
                    {/* Total For Sale */}
                    <div className="col-6">
                      <div className="p-3 p-md-6 border-end border-bottom">
                        <h5 className="mb-4 font-monospace">
                          {stats.totalProperty.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">
                          Total Property
                        </p>
                        <span className="text-success fw-medium fs-13">
                          {pct(stats.totalProperty)}% of total
                        </span>
                      </div>
                    </div>

                    {/* Active For Rent */}
                    <div className="col-6">
                      <div className="p-3 p-md-6 border-bottom">
                        <h5 className="mb-4 font-monospace">
                          {stats.activeProperty.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">Active</p>
                        <span className="text-success fw-medium fs-13">
                          {pct(stats.activeProperty)}% of total
                        </span>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="p-3 p-md-6 border-end border-bottom">
                        <h5 className="mb-4 font-monospace">
                          {stats.progress.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">
                          Property Progress
                        </p>
                        <span className="text-success fw-medium fs-13">
                          {pct(stats.progress)}% of total
                        </span>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="p-3 p-md-6 border-end border-bottom">
                        <h5 className="mb-4 font-monospace">
                          {stats.sitevisit.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">
                          Pending Site Visit
                        </p>
                        <span className="text-success fw-medium fs-13">
                          {pct(stats.sitevisit)}% of total
                        </span>
                      </div>
                    </div>

                    {/* Properties Sold */}
                    <div className="col-6">
                      <div className="p-3 p-md-6 border-end">
                        <h5 className="mb-4 font-monospace">
                          {stats.sold.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">
                          Properties Sold
                        </p>
                        <span className="text-success fw-medium fs-13">
                          {pct(stats.sold)}% of total
                        </span>
                      </div>
                    </div>

                    {/* Deal Pending */}
                    <div className="col-6">
                      <div className="p-3 p-md-6">
                        <h5 className="mb-4 font-monospace">
                          {stats.processing.toLocaleString()}
                        </h5>
                        <p className="text-muted mb-2 text-truncate">
                          Deal Processing
                        </p>
                        <span className="text-danger fw-medium fs-13">
                          {pct(stats.processing)}% of total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6">
                  <p className="text-muted mt-2 mb-0 text-center">
                    {pct(stats.totalProperty)}% for sale,{" "}
                    {pct(stats.activeProperty)}% for rent,{" "}
                    {pct(stats.processing)}% sold, {pct(stats.processing)}
                    % pending — {stats.total} total properties.
                  </p>
                </div> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
