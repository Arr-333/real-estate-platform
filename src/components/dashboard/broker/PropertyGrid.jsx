"use client";

import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";
import Pagination from "@/components/DataTable/Pagination";

export default function PropertyGrid() {
  const { data, page, setPage, totalPages, loading, limit, setLimit } =
    usePaginatedFetch("/api/listing?limit=10");

  return (
    <div className="col-xxl-12">
      <div className="card">
        {/* HEADER */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Property List</h5>
        </div>

        {/* BODY */}
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <div className="row g-4">
              {data.map((p) => (
                <div
                  key={p.propertyListId}
                  className="col-md-6 col-lg-6 col-xl-3"
                >
                  {/* 🟫 CARD (gray box) */}
                  <div className="card h-100 shadow-sm">
                    {/* 🔵 IMAGE */}
                    <div className="position-relative">
                      <img
                        src={p.images?.[0]?.imageUrl || "/img/noimage.png"}
                        alt="Property"
                        className="w-100"
                        style={{ height: 180, objectFit: "cover" }}
                      />

                      {/* STATUS BADGE */}
                      <span
                        className={`badge position-absolute top-0 start-0 m-2 ${
                          p.propertyListStatus === "SOLD"
                            ? "bg-secondary"
                            : p.propertyListStatus === "ACTIVE"
                              ? "bg-success"
                              : "bg-warning"
                        }`}
                      >
                        {p.propertyListStatus}
                      </span>
                    </div>

                    {/* 🟨 DETAILS */}
                    <div className="card-body d-flex flex-column">
                      <h6 className="text-primary mb-2">
                        ₹{Number(p.propertyRent || 0).toLocaleString()}
                      </h6>

                      <p className="fw-semibold mb-1">{p.propertyTitle}</p>

                      <p className="text-muted small mb-3">
                        {p.cityName}, {p.stateName}
                      </p>

                      <div className="mt-auto d-flex justify-content-between text-muted small">
                        <span>3 Beds</span>
                        <span>2 Baths</span>
                        <span>1200 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🟩 PAGINATION (your green area) */}
          <div className="mt-4 d-flex justify-content-center">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
