import React from "react";

// Replace with real API once you have an Application/Request model in Prisma
// e.g. GET /api/application?customerId=${userId}
type Application = {
  id: number;
  propertyTitle: string;
  location: string;
  type: "Rental" | "Purchase";
  appliedOn: string;
  status:
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Documents Pending"
    | "Shortlisted";
  brokerName?: string;
  nextStep: string;
};

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    propertyTitle: "2BHK Apartment, Sector 21",
    location: "Noida, UP",
    type: "Rental",
    appliedOn: "Mar 10, 2026",
    status: "Under Review",
    brokerName: "Rahul Mehta",
    nextStep: "Broker will contact within 2 days",
  },
  {
    id: 2,
    propertyTitle: "Shop, Connaught Place",
    location: "New Delhi",
    type: "Purchase",
    appliedOn: "Feb 28, 2026",
    status: "Approved",
    nextStep: "Proceed to documentation",
  },
  {
    id: 3,
    propertyTitle: "3BHK Villa, DLF Phase 2",
    location: "Gurgaon, HR",
    type: "Purchase",
    appliedOn: "Feb 22, 2026",
    status: "Documents Pending",
    brokerName: "Kavita Kapoor",
    nextStep: "Upload ID proof and income certificate",
  },
];

const statusConfig: Record<
  Application["status"],
  { badge: string; icon: string }
> = {
  "Under Review": {
    badge: "bg-warning-subtle text-warning border-warning-subtle",
    icon: "la-hourglass-half",
  },
  Approved: {
    badge: "bg-success-subtle text-success border-success-subtle",
    icon: "la-check-circle",
  },
  Rejected: {
    badge: "bg-danger-subtle text-danger border-danger-subtle",
    icon: "la-times-circle",
  },
  "Documents Pending": {
    badge: "bg-info-subtle text-info border-info-subtle",
    icon: "la-file-upload",
  },
  Shortlisted: {
    badge: "bg-primary-subtle text-primary border-primary-subtle",
    icon: "la-star",
  },
};

export default function MyApplications() {
  return (
    <div className="col-xl-5 col-xxl-4">
      <div className="card card-h-100">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 className="card-title mb-1">My Applications</h5>
            <p className="text-muted fs-13 mb-0">Rental & purchase requests</p>
          </div>
          <a
            href="/customer/applications"
            className="link link-custom-primary fs-13"
          >
            View All
          </a>
        </div>

        <div className="card-body d-flex flex-column gap-3">
          {MOCK_APPLICATIONS.map((app) => {
            const cfg = statusConfig[app.status];
            return (
              <div
                key={app.id}
                className="p-3 rounded-3 border"
                style={{ background: "var(--bs-light, #f8f9fa)" }}
              >
                {/* Header row */}
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <div>
                    <a
                      href={`/customer/applications/${app.id}`}
                      className="link link-custom fw-medium fs-13"
                    >
                      {app.propertyTitle}
                    </a>
                    <p className="text-muted fs-12 mb-0 d-flex align-items-center gap-1">
                      <i className="las la-map-marker" />
                      {app.location}
                    </p>
                  </div>
                  <span
                    className={`badge border fs-11 flex-shrink-0 d-flex align-items-center gap-1 ${cfg.badge}`}
                  >
                    <i className={`las ${cfg.icon}`} />
                    {app.status}
                  </span>
                </div>

                {/* Meta row */}
                <div className="d-flex align-items-center gap-3 flex-wrap mb-2">
                  <span className="badge bg-light text-dark border fs-11">
                    {app.type}
                  </span>
                  <span className="text-muted fs-12">
                    <i className="las la-calendar me-1" />
                    {app.appliedOn}
                  </span>
                  {app.brokerName && (
                    <span className="text-muted fs-12">
                      <i className="las la-user-tie me-1" />
                      {app.brokerName}
                    </span>
                  )}
                </div>

                {/* Next step */}
                <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-white border">
                  <i className="las la-info-circle text-primary fs-14 flex-shrink-0" />
                  <span className="text-muted fs-12">{app.nextStep}</span>
                </div>

                {/* Action */}
                {app.status === "Documents Pending" && (
                  <a
                    href={`/customer/applications/${app.id}/documents`}
                    className="btn btn-sm btn-primary w-100 mt-2 fs-12"
                  >
                    <i className="las la-upload me-1" />
                    Upload Documents
                  </a>
                )}
                {app.status === "Approved" && (
                  <a
                    href={`/customer/applications/${app.id}/proceed`}
                    className="btn btn-sm btn-success w-100 mt-2 fs-12"
                  >
                    <i className="las la-arrow-right me-1" />
                    Proceed to Next Step
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
