"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function BrokerDetail() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/profile`)
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);
  // console.log(data)

  if (!data) return <div>Loading...</div>;

  const user = data;

  const broker = data.broker;

  // initials fallback
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="col col-lg-4 col-sm-12 card m-2">
      <div className="sec">
        <div className="sec-title">Broker Profile</div>
        <div className="sec-link">
          <Link href="/auth/profileupdate" className="btn btn-primary">
            Update Profile
          </Link>
        </div>
      </div>

      <div className="broker-hero">
        <div className="broker-big-av">
          {user.image ? <img src={user.image} alt="broker" /> : initials}
        </div>

        <div>
          <div className="broker-title">{user.name}</div>

          <div className="broker-subtitle">
            {user.role?.name} · {broker.location || "N/A"} yrs experience
          </div>

          <div className="badge-row">
            <span className="badge badge-gold">RERA Certified</span>
            <span className="badge badge-blue">Top Producer</span>
            <span className="badge badge-green">Luxury Homes</span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="dg-item">
          <div className="dg-label">Phone</div>
          <div className="dg-val">{broker.phoneMobile}</div>
        </div>

        <div className="dg-item">
          <div className="dg-label">Email</div>
          <div className="dg-val" style={{ fontSize: "11px" }}>
            {user.email}
          </div>
        </div>

        <div className="dg-item">
          <div className="dg-label">License No.</div>
          <div className="dg-val">{broker.licenseNo || "N/A"}</div>
        </div>

        <div className="dg-item">
          <div className="dg-label">Agency</div>
          <div className="dg-val">{broker.agency || "N/A"}</div>
        </div>

        <div className="dg-item">
          <div className="dg-label">Zone</div>
          <div className="dg-val">{broker.location}</div>
        </div>

        <div className="dg-item">
          <div className="dg-label">Joined</div>
          <div className="dg-val">
            {broker.createdAt
              ? new Date(broker.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
        </div>

        <div className="dg-item">
          <div className="dg-label">Language</div>
          <div className="dg-val">{broker.language || "N/A"}</div>
        </div>

        <div className="dg-item">
          <div className="dg-label">About</div>
          <div className="dg-val">{broker.about || "N/A"}</div>
        </div>
      </div>
    </div>
  );
}
