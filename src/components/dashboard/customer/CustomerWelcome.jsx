"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CustomerWelcome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/profile`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);
  console.log(data);

  if (!data) return <div>Loading...</div>;

  const user = data;

  const customer = data.customer;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="col-xxl-8 col-xl-7">
      <div className="card welcome-card card-h-100">
        <div className="card-body">
          <div className="row h-100 align-items-center">
            {/* Left — greeting & info */}
            <div className="col-md-8">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  {/* <img
                    src={image}
                    alt={name}
                    className="rounded-circle object-fit-cover flex-shrink-0"
                    width={56}
                    height={56}
                    style={{ border: "3px solid rgba(255,255,255,0.35)" }}
                  /> */}
                  <div>
                    <h5 className="fw-semibold mb-0">Hello, {user.name}!</h5>
                    <span className="badge bg-success-subtle text-success border border-success-subtle fs-12 mt-1">
                      Customer
                    </span>
                  </div>
                </div>

                <p className="text-muted fs-14 mb-0">
                  Explore verified properties, save your favourites, schedule
                  visits and track your applications — all in one place.
                </p>

                {/* Info pills */}
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark border fs-12 fw-normal py-2 px-3 d-flex align-items-center gap-1">
                    <i className="las la-envelope text-muted" />
                    {user.email}
                  </span>
                  {user.phone !== "—" && (
                    <span className="badge bg-light text-dark border fs-12 fw-normal py-2 px-3 d-flex align-items-center gap-1">
                      <i className="las la-phone text-muted" />
                      {user.phone}
                    </span>
                  )}
                  <span className="badge bg-light text-dark border fs-12 fw-normal py-2 px-3 d-flex align-items-center gap-1">
                    <i className="las la-map-marker text-muted" />
                    {user.role?.name}
                  </span>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <a
                    href="/customer/properties"
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  >
                    <i className="las la-search" />
                    Browse Properties
                  </a>
                  <Link href="/auth/profileupdate" className="btn btn-primary">
                    Update Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — illustration */}
            <div className="col-md-4 d-none d-md-flex justify-content-center align-items-center">
              <div
                className="d-flex flex-column align-items-center justify-content-center rounded-4 text-center gap-2"
                style={{
                  width: 148,
                  height: 148,
                  background: "rgba(16,185,129,0.1)",
                  border: "2px dashed rgba(16,185,129,0.4)",
                }}
              >
                <i
                  className="las la-search-location"
                  style={{ fontSize: 46, color: "#10b981" }}
                />
                <span className="fs-12 fw-medium" style={{ color: "#10b981" }}>
                  Find Your Home
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
