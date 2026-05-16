import React from "react";

const ACTIONS = [
  {
    label: "Browse Properties",
    description: "Explore all verified listings",
    href: "/customer/properties",
    iconClass: "la-home",
    colorClass: "bg-primary-subtle text-primary",
  },
  {
    label: "My Saved Wishlist",
    description: "Properties you liked",
    href: "/customer/wishlist",
    iconClass: "la-heart",
    colorClass: "bg-danger-subtle text-danger",
  },
  {
    label: "Schedule a Visit",
    description: "Book an in-person or virtual tour",
    href: "/customer/visits/new",
    iconClass: "la-calendar-check",
    colorClass: "bg-success-subtle text-success",
  },
  {
    label: "My Applications",
    description: "Track rental/purchase requests",
    href: "/customer/applications",
    iconClass: "la-file-alt",
    colorClass: "bg-warning-subtle text-warning",
  },
  {
    label: "Contact Support",
    description: "Raise a query or complaint",
    href: "/customer/contact",
    iconClass: "la-headset",
    colorClass: "bg-info-subtle text-info",
  },
];

export default function CustomerQuickActions() {
  return (
    <div className="col-xxl-4 col-xl-5">
      <div className="card card-h-100">
        <div className="card-header">
          <h5 className="card-title mb-0">Quick Actions</h5>
        </div>
        <div className="card-body d-flex flex-column gap-2">
          {ACTIONS.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none border"
              style={{ transition: "background .14s" }}
            >
              <div
                className={`avatar size-9 rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center ${action.colorClass}`}
              >
                <i className={`las ${action.iconClass} fs-18`} />
              </div>
              <div className="overflow-hidden">
                <p className="fw-medium fs-13 mb-0 text-body">{action.label}</p>
                <p className="text-muted fs-12 mb-0 text-truncate">
                  {action.description}
                </p>
              </div>
              <i className="las la-angle-right text-muted ms-auto fs-14" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
