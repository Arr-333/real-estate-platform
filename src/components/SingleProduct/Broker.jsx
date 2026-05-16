"use client";

export default function Broker({ property }) {
  const broker = property?.broker;

  console.log("alldata", property);
  if (!broker) {
    return (
      <div className="card p-3">
        <p>No broker data</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="brkpic">
        {broker.image ? (
          <img
            src={broker.image}
            alt={broker.name}
            className="rounded-circle"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        ) : (
          <span>{broker.name?.charAt(0)}</span>
        )}
      </div>

      <div className="p-3">
        <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
          <div>
            <div className="fw-semibold">Name : {broker.name}</div>
            <div className="small text-muted">
              Email Address : {broker.email}
            </div>
            <div className=" small">Phone : {broker.phone}</div>
          </div>
        </div>

        <a href={`tel:${broker.phone}`} className="btn btn-danger w-100 mb-2">
          📞 Call Broker
        </a>

        <a
          href={`mailto:${broker.email}`}
          className="btn btn-light w-100 border mb-2"
        >
          ✉ Email Broker
        </a>
      </div>
    </div>
  );
}
