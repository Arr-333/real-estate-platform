import React from "react";

type Property = {
  propertyListId: number;
  propertyTitle: string;
  propertyRent: string;
  propertySize: number;
  propertyListStatus: string;
  propertyFurnishedStatus?: string;
  propertyAvailability?: string;
  propertyRentType?: string;
  cityName: string;
  stateName: string;
  propertyTypeName: string;
  propertyLikes?: number;
  propertyPageVisits?: number;
  images: { imageUrl: string }[];
};

async function getRecommended(): Promise<Property[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listing`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const all: Property[] = await res.json();
    // Show only active listings, sorted by views desc, take top 6
    return all
      .filter((p) => p.propertyListStatus === "ACTIVE")
      .sort((a, b) => (b.propertyPageVisits ?? 0) - (a.propertyPageVisits ?? 0))
      .slice(0, 6);
  } catch {
    return [];
  }
}

const furnishedLabel: Record<string, string> = {
  FULLY_FURNISHED: "Fully Furnished",
  SEMI_FURNISHED: "Semi Furnished",
  UNFURNISHED: "Unfurnished",
};

const availBadge: Record<string, string> = {
  IMMEDIATE: "bg-success-subtle text-success border-success-subtle",
  WITHIN_30_DAYS: "bg-warning-subtle text-warning border-warning-subtle",
  WITHIN_60_DAYS: "bg-secondary-subtle text-secondary border-secondary-subtle",
  NOT_AVAILABLE: "bg-danger-subtle text-danger border-danger-subtle",
};

const availLabel: Record<string, string> = {
  IMMEDIATE: "Available Now",
  WITHIN_30_DAYS: "In 30 days",
  WITHIN_60_DAYS: "In 60 days",
  NOT_AVAILABLE: "Not Available",
};

export default async function RecommendedProperties() {
  const properties = await getRecommended();

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h5 className="card-title mb-1">Recommended for You</h5>
            <p className="text-muted fs-13 mb-0">
              Top verified listings based on popularity
            </p>
          </div>
          <a
            href="/customer/properties"
            className="link link-custom-primary fs-13"
          >
            Browse All
          </a>
        </div>

        <div className="card-body">
          {properties.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="las la-home fs-40 d-block mb-2" />
              <p className="fs-14">No properties available at the moment.</p>
            </div>
          ) : (
            <div className="row g-3">
              {properties.map((p) => {
                const imgSrc = p.images?.[0]?.imageUrl
                  ? `/uploads/${p.images[0].imageUrl}`
                  : "/assets/images/property-5.jpg";
                const avail = p.propertyAvailability ?? "IMMEDIATE";

                return (
                  <div key={p.propertyListId} className="col-sm-6 col-xl-4">
                    <div
                      className="card border h-100 mb-0"
                      style={{ transition: "box-shadow .15s" }}
                    >
                      {/* Image */}
                      <div
                        className="position-relative overflow-hidden rounded-top"
                        style={{ height: 175 }}
                      >
                        <img
                          src={imgSrc}
                          alt={p.propertyTitle}
                          className="w-100 h-100 object-fit-cover"
                        />
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2 fs-11">
                          {p.propertyTypeName}
                        </span>
                        {p.propertyFurnishedStatus && (
                          <span className="badge bg-dark bg-opacity-55 position-absolute bottom-0 start-0 m-2 fs-11">
                            {furnishedLabel[p.propertyFurnishedStatus] ??
                              p.propertyFurnishedStatus}
                          </span>
                        )}
                        {/* Views badge */}
                        {(p.propertyPageVisits ?? 0) > 0 && (
                          <span className="badge bg-dark bg-opacity-55 position-absolute bottom-0 end-0 m-2 fs-11 d-flex align-items-center gap-1">
                            <i className="las la-eye" />
                            {p.propertyPageVisits}
                          </span>
                        )}
                      </div>

                      <div className="card-body p-3">
                        {/* Price row */}
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6 className="fw-semibold text-primary mb-0 fs-15">
                            ₹{Number(p.propertyRent).toLocaleString("en-IN")}
                            {p.propertyRentType === "MONTHLY" && (
                              <span className="text-muted fw-normal fs-12">
                                /mo
                              </span>
                            )}
                          </h6>
                          <div className="d-flex align-items-center gap-2 text-muted fs-12">
                            {(p.propertyLikes ?? 0) > 0 && (
                              <span className="d-flex align-items-center gap-1">
                                <i className="las la-heart text-danger" />
                                {p.propertyLikes}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <a
                          href={`/customer/properties/${p.propertyListId}`}
                          className="link link-custom fw-medium fs-14 d-block text-truncate mb-1"
                        >
                          {p.propertyTitle}
                        </a>

                        {/* Location */}
                        <p className="text-muted fs-12 mb-2 d-flex align-items-center gap-1">
                          <i className="las la-map-marker" />
                          {p.cityName}, {p.stateName}
                          {p.propertySize > 0 && ` · ${p.propertySize} sqft`}
                        </p>

                        {/* Availability */}
                        <span
                          className={`badge border fs-11 mb-3 ${
                            availBadge[avail] ?? availBadge["IMMEDIATE"]
                          }`}
                        >
                          {availLabel[avail] ?? avail}
                        </span>

                        {/* CTA */}
                        <div className="d-flex gap-2">
                          <a
                            href={`/customer/properties/${p.propertyListId}`}
                            className="btn btn-sm btn-soft-primary flex-fill fs-12"
                          >
                            View Details
                          </a>
                          <a
                            href={`/customer/visits/new?propertyId=${p.propertyListId}`}
                            className="btn btn-sm btn-primary flex-fill fs-12"
                          >
                            Book Visit
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
