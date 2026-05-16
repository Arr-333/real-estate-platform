"use client";

import { useState } from "react";
import ImageCard from "@/components/SingleProduct/ImageCard";
import SpacesTable from "@/components/SingleProduct/SpaceTable";
import InfoTabs from "@/components/SingleProduct/InfoTable";
import SingleWishlist from "@/components/SingleProduct/SingleWishlist";
import PropVerification from "@/components/SingleProduct/PropVerification";
import Broker from "@/components/SingleProduct/Broker";
import ScheduleTourButton from "@/components/SingleProduct/ScheduleBtn";

export default function PropertyPage({ propertyData }) {
  const [rateType, setRateType] = useState("yr");

  return (
    <div className="container-fluid bg-light p-0">
      {/* IMAGE */}
      <ImageCard images={propertyData.images} />

      <div className="container py-4">
        <div className="row g-3">
          {/* LEFT */}
          <div className="col-12 col-lg-8">
            {/* Header */}
            <div className="card border-0 shadow-sm p-3 mb-3">
              <h4 className="fw-bold">{propertyData.title}</h4>
              <p className="text-muted mb-1">{propertyData.about}</p>
              <p className="text-primary small mb-0">{propertyData.address}</p>
            </div>

            {/* Spaces */}
            <SpacesTable
              spaces={propertyData.spaces}
              rateType={rateType}
              setRateType={setRateType}
            />

            {/* Tabs */}
            <InfoTabs property={propertyData} />
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">
            <div className="sticky-top" style={{ top: "20px" }}>
              <div className="d-flex flex-column gap-3">
                <SingleWishlist property={propertyData} />
                <Broker property={propertyData} />
                <ScheduleTourButton propertyId={propertyData.id} />
                <PropVerification property={propertyData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
