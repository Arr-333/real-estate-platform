"use client";

import React, { Suspense, useState, useEffect } from "react";
import styles from "./searchpage.module.css";
import dynamic from "next/dynamic";
import Filterbar from "../../src/components/Filterbar";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const Maped = dynamic(() => import("../../src/components/Mapped"), {
  ssr: false,
});

function GlobalSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [listings, setListings] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const type = searchParams.get("propertyType") || "";
    const city = searchParams.get("location") || "";

    setSelectedType(type);
    setSelectedCity(city);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedType) params.set("propertyType", selectedType);
    if (selectedCity) params.set("location", selectedCity);

    const newUrl = `/search?${params.toString()}`;
    router.replace(newUrl);
  }, [selectedType, selectedCity]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedType) params.set("propertyType", selectedType);
    if (selectedCity) params.set("location", selectedCity);

    fetch(`/api/publicprop?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.data || []).map((p) => ({
          id: p.propertyListId,
          title: p.propertyTitle,
          type: p.propertyType?.name,
          address1: p.propertyAddressLine1 || "",
          address2: p.propertyAddressLine2 || "",
          address3: p.propertyAddressLine3 || "",
          lat: p.propertyLatitude,
          lng: p.propertyLongitude,
          size: p.propertySize,
          availability: p.propertyAvailability,
          price: p.propertyRent,
          image: p.images?.[0]?.imageUrl || "/no-image.png",
        }));

        setListings(mapped);
      });
  }, [selectedType, selectedCity]);

  useEffect(() => {
    console.log("URL PARAMS:", searchParams.toString());
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <Filterbar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* BODY */}
      <div className={styles.body}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          {listings.map((l) => (
            <div key={l.id}>
              <Link href={`/singlepage/${l.id}`} className="prop-card">
                <div
                  className={`${styles.card} ${
                    activeId === l.id ? styles.activeCard : ""
                  }`}
                  onClick={() => setActiveId(l.id)}
                >
                  <img src={l.image} className={styles.cardImage} />

                  <div className={styles.cardContent}>
                    <div className={styles.cardTitle}>{l.title}</div>

                    <div className={styles.cardAddress}>
                      {l.address1} {l.address2}
                    </div>

                    <div className={styles.cardAddress}>{l.address3}</div>

                    <div className={styles.price}>₹ {l.price}</div>

                    <div className="row">
                      <div className="col-6">{l.size} sq ft</div>
                      <div className="col-6">{l.availability}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div className={styles.mapContainer}>
          <Maped properties={listings} />
        </div>
      </div>
    </div>
  );
}

export default function GlobalSearch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalSearchContent />
    </Suspense>
  );
}
