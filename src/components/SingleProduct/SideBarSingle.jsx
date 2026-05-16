"use client";

export default function SidebarSingle({ property }) {
  const handleScheduleTour = async () => {
    try {
      const res = await fetch("/api/client-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.id,
        }),
      });

      const data = await res.json();
      console.log("17", data);

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert("Tour request sent successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* ACTION BAR */}
      <div className="card border-0 shadow-sm p-2 d-flex flex-row justify-content-around">
        <button className="btn btn-light btn-sm">❤ Save</button>
        <button className="btn btn-light btn-sm">🔗 Share</button>
        <button className="btn btn-light btn-sm">🖨 Print</button>
      </div>

      {/* BROKER CARD */}
      <div className="card border-0 shadow-sm">
        {/* Header */}
        <div className="bg-danger text-white p-2 fw-semibold">
          {property.contact.company}
          <div className="small fw-normal">Listing Representative</div>
        </div>

        <div className="p-3">
          {/* PRICE */}
          <div className="price-box mb-3">
            <div className="small text-muted">RENTAL RATE (FROM)</div>
            <h4 className="fw-bold mb-0">₹38 /SF/YR</h4>
            <div className="small text-muted">
              ₹3.17 /SF/MO · ₹4,75,000 /YR · ₹39,583 /MO
            </div>
          </div>

          {/* BUTTONS */}
          <button className="btn btn-danger w-100 mb-2">📞 Call Broker</button>

          <button className="btn btn-light w-100 border mb-2">
            ✉ Email Broker
          </button>

          <button
            className="btn btn-primary w-100"
            onClick={handleScheduleTour}
          >
            📅 Schedule a Tour
          </button>

          {/* AGENT */}
          <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
            <div className="avatar">{property.contact.name?.charAt(0)}</div>

            <div>
              <div className="fw-semibold">{property.contact.name}</div>
              <div className="small text-muted">{property.contact.company}</div>
              <div className="text-primary small">{property.contact.phone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="card border-0 shadow-sm p-3">
        <div className="fw-semibold mb-2 small text-muted">
          LISTING ACTIVITY
        </div>

        <div className="row g-2 text-center">
          <div className="col-6">
            <div className="stat-box">
              <h5>{property.stats.impressions}</h5>
              <small>IMPRESSIONS</small>
            </div>
          </div>

          <div className="col-6">
            <div className="stat-box">
              <h5>{property.stats.visits}</h5>
              <small>PAGE VISITS</small>
            </div>
          </div>

          <div className="col-6">
            <div className="stat-box">
              <h5>{property.stats.saved}</h5>
              <small>SAVED</small>
            </div>
          </div>

          <div className="col-6">
            <div className="stat-box">
              <h5>{property.stats.spaces}</h5>
              <small>SPACES</small>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFIED */}
      <div className="card border-0 shadow-sm p-3 d-flex align-items-center gap-2">
        <div className="verified-icon">✔</div>
        <div>
          <div className="fw-semibold small">Registered Property</div>
          <div className="text-muted small">Verified & Government Approved</div>
        </div>
      </div>
    </div>
  );
}
