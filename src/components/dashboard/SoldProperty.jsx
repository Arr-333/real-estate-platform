"use client";

import DataTable from "@/components/DataTable/DataTable";
import Pagination from "@/components/DataTable/Pagination";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";

export default function SoldProperty() {
  const { data, page, setPage, totalPages, loading, limit, setLimit } =
    usePaginatedFetch("/api/listing?status=SOLD");

  // ✅ Define columns (this replaces your table HTML)
  const columns = [
    {
      key: "propertyTitle",
      label: "Property",
      render: (p) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={p.images?.[0]?.imageUrl || "/img/noimage.png"}
            alt="Property"
            className="rounded-2"
            width={50}
          />
          <span className="fw-medium">{p.propertyTitle}</span>
        </div>
      ),
    },
    {
      key: "propertyRent",
      label: "Price",
      render: (p) => `₹${Number(p.propertyRent).toLocaleString()}`,
    },
    {
      key: "propertyCreatedOn",
      label: "Date",
      render: (p) => new Date(p.propertyCreatedOn).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <span className="badge bg-success-subtle text-success">SOLD</span>
      ),
    },
  ];

  return (
    <>
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">Sold Properties</h5>
          <a href="#!" className="link link-custom-primary">
            View All
          </a>
        </div>

        <div className="card-body">
          {/* ✅ Reusable Table */}
          <DataTable columns={columns} data={data} loading={loading} />

          {/* ✅ Pagination */}
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />

          {/* Footer */}
          <div className="mt-3 text-center text-muted">
            Showing {data.length || 0} sold properties
          </div>
        </div>
      </div>
    </>
  );
}
