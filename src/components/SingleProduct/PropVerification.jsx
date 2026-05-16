"use client";

export default function PropVerification({ property }) {
  return (
    <>
      <div className="card border-0 shadow-sm p-3 d-flex align-items-center gap-2">
        {/* <div className="verified-icon">{property.propertyRegistration}</div> */}
        <div>
          <div className="text-muted small">
            Detail:{property.propertyRegistrationDetails}
          </div>
          <div className="fw-semibold small">
            {" "}
            Authority: {property.propertyRegistrationAuthority}
          </div>
        </div>
      </div>
    </>
  );
}
