"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function ToManage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/listing");
        const data = await res.json();

        // ✅ Example: show latest 6 properties
        setProperties(data.data.slice(0, 6));
      } catch (err) {
        console.error("Error fetching properties", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="col-xxl-7 ">
      <div className="position-relative">
        <h6 className="card-title position-absolute top-0 start-0 mb-5 mt-2">
          Property List
        </h6>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          className="pt-14"
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {properties.map((p) => (
            <SwiperSlide key={p.propertyListId}>
              <div className="card">
                <div className="card-body p-4 property-card">
                  {/* Image */}
                  <div className="position-relative overflow-hidden">
                    <img
                      src={p.images?.[0]?.imageUrl || "/img/noimage.png"}
                      alt="Property"
                      className="card-img-top rounded object-fit-cover"
                      style={{ height: "180px", width: "100%" }}
                    />

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 fs-11 text-white position-absolute top-0 start-0 mt-3 ${
                        p.propertyListStatus === "SOLD"
                          ? "bg-secondary"
                          : p.propertyListStatus === "ACTIVE"
                            ? "bg-success"
                            : "bg-danger"
                      }`}
                    >
                      {p.propertyListStatus}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="my-4 pb-4 border-bottom">
                    <div className="d-flex justify-content-between mb-3">
                      <h6 className="mb-0 fs-17 text-primary">
                        ₹{Number(p.propertyRent).toLocaleString()}
                      </h6>

                      <p className="text-muted small">⭐ 4.5</p>
                    </div>

                    <span className="fw-semibold d-block mb-1">
                      {p.propertyTitle}
                    </span>

                    <p className="text-muted mb-0 fs-sm">
                      {p.cityName}, {p.stateName}
                    </p>
                  </div>

                  {/* Dummy specs */}
                  <div className="d-flex justify-content-between text-muted fs-sm">
                    <span>3 Beds</span>
                    <span>2 Baths</span>
                    <span>1200 sqft</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
