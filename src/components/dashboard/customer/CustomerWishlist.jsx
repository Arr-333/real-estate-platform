"use client";

import React, { useEffect, useState } from "react";

export default function CustomerWishlist() {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/wishlist?page=${page}&limit=${LIMIT}`);

        const data = await res.json();

        setProperties(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [page]);

  return (
    <div className="col-12">
      <div className="card">
        {/* Header */}
        <div className="card-header d-flex justify-content-between">
          <h5>Your Wishlist</h5>
        </div>

        {/* Body */}
        <div className="card-body">
          {properties.length === 0 ? (
            <p className="text-center">No wishlist data</p>
          ) : (
            <>
              <div className="row g-3">
                {properties.map((p) => {
                  const img = p.images?.[0]?.imageUrl
                    ? `/uploads/${p.images[0].imageUrl}`
                    : "/assets/images/property-5.jpg";

                  return (
                    <div key={p.propertyListId} className="col-md-4">
                      <div className="card border h-100">
                        <div style={{ height: 170 }}>
                          <img
                            src={img}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>

                        <div className="card-body">
                          <h6>
                            ₹{Number(p.propertyRent).toLocaleString("en-IN")}
                          </h6>

                          <p>{p.propertyTitle}</p>

                          <p className="text-muted">{p.city?.cityName}</p>

                          <a
                            href={`/customer/properties/${p.id}`}
                            className="btn btn-sm btn-primary w-100"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="btn btn-sm btn-light"
                >
                  Prev
                </button>

                <span>
                  Page {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="btn btn-sm btn-light"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
