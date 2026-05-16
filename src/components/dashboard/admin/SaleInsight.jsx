import React from "react";

export default function SaleInsight() {
  return (
    <>
      <div className="col-lg-6 col-xxl-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body py-7">
                <div className="row g-10 g-md-4">
                  <div className="col-md-4 col-sm-6 border-end-md-0">
                    <div className="text-center">
                      <h5 className="fw-medium mb-3 font-monospace">
                        <span
                          className="counter"
                          data-start="0"
                          data-end="1248"
                          data-duration="1000"
                        >
                          1,248
                        </span>
                      </h5>
                      <p className="text-muted">Total Properties</p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6 border-end-md-0">
                    <div className="text-center">
                      <h5 className="fw-medium mb-3 font-monospace">
                        <span
                          className="counter"
                          data-start="0"
                          data-end="526"
                          data-duration="1000"
                        >
                          526
                        </span>
                      </h5>
                      <p className="text-muted">New Clients</p>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-6">
                    <div className="text-center">
                      <h5 className="fw-medium mb-3 font-monospace">
                        $
                        <span
                          className="counter"
                          data-start="0"
                          data-end="48320"
                          data-duration="1000"
                        >
                          48,320
                        </span>
                      </h5>
                      <p className="text-muted">Total Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <p className="text-muted mb-1">Total Income by</p>
                <h5 className="card-title mb-6">Sales and Rent Insights</h5>
                <div className="size-36 bg-primary font-monospace rounded-circle mx-auto avatar text-white circular-progress flex-column">
                  <h4 className="fw-medium mb-2">
                    <span
                      className="counter"
                      data-start="0"
                      data-end="74"
                      data-duration="1000"
                    >
                      74
                    </span>
                    %
                  </h4>
                  <p>$2,485.36</p>
                  <img
                    src="./assets/images/circular.png"
                    alt=""
                    className="img-fluid position-absolute p-1"
                  />
                </div>
                <p className="text-muted mt-7">
                  Revenue growth driven by steady property sales.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-h-100">
              <div className="card-body p-0">
                <div className="text-center p-4 pb-1">
                  <div className="avatar ms-auto size-7 border rounded text-indigo">
                    <i className="ri-bar-chart-fill"></i>
                  </div>
                  <p className="text-muted mb-2">New Leads Today</p>
                  <h4 className="font-monospace mb-3">
                    <span
                      className="counter"
                      data-start="0"
                      data-end="4485"
                      data-duration="1000"
                    >
                      4,485
                    </span>
                  </h4>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    +2.6%
                  </span>
                </div>
                <div
                  id="activityChart"
                  dir="ltr"
                  style={{ minHeight: "165px" }}
                  className=""
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
