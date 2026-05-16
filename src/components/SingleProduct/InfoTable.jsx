"use client";
import { useState } from "react";

export default function InfoTabs({ property }) {
  const [tab, setTab] = useState("about");

  const tabs = [
    { id: "about", label: "About" },
    { id: "details", label: "Property Details" },
    { id: "gallery", label: "Gallery" },
    { id: "nearby", label: "Nearby" },
    { id: "building", label: "Building Info" },
    // { id: "visits", label: "Site Visits" },
  ];

  return (
    <div className="card border-0 shadow-sm">
      {/* Tabs Header */}
      <div className="border-bottom px-3">
        <div className="d-flex flex-wrap gap-4 small fw-semibold">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* ABOUT */}
        {tab === "about" && (
          <>
            <p className="text-muted">{property.about}</p>

            <h6 className="mt-4 small text-uppercase text-muted">Ideal For</h6>

            <div className="d-flex flex-wrap gap-2 mt-2">
              {property.suitability?.map((s, i) => (
                <span
                  key={i}
                  className="badge rounded-pill bg-light text-dark border"
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        {/* DETAILS */}
        {tab === "details" && (
          <div className="row g-3">
            {Object.entries(property.detail).map(([key, val]) => (
              <div key={key} className="col-md-6">
                <div className="info-box">
                  <div className="label">{key}</div>
                  <div className="value">{val}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GALLERY */}
        {tab === "gallery" && (
          <div className="row g-2">
            {property.images.map((img, i) => (
              <div key={i} className="col-6 col-md-3">
                <img src={img} className="img-fluid rounded gallery-img" />
              </div>
            ))}
          </div>
        )}

        {/* NEARBY */}
        {tab === "nearby" && (
          <div className="list-group list-group-flush">
            {property.nearby.map((n, i) => (
              <div
                key={i}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{n}</span>
                <span className="text-muted small">Nearby</span>
              </div>
            ))}
          </div>
        )}

        {/* BUILDING INFO */}
        {tab === "building" && (
          <div className="row g-3">
            {Object.entries(property.detail).map(([key, val]) => (
              <div key={key} className="col-md-6">
                <div className="info-box">
                  <div className="label">{key}</div>
                  <div className="value">{val}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SITE VISITS
        {tab === "visits" && (
          <div className="d-flex flex-column gap-3">
            <div className="visit-card confirmed">
              <strong>Wednesday, 9 April 2025 · 11:00 AM</strong>
              <div className="small text-muted">
                In-Person · Client: Priya Sharma
              </div>
              <span className="status success">Confirmed</span>
            </div>

            <div className="visit-card pending">
              <strong>Friday, 11 April 2025 · 3:00 PM</strong>
              <div className="small text-muted">
                Virtual Tour · Client: Rohan Desai
              </div>
              <span className="status warning">Pending</span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
