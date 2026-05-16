"use client";

import React, { useState, useEffect } from "react";
import usePaginatedFetch from "@/components/hooks/usePaginatedFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";

const tabs = ["For Lease", "For Sale", "Auctions"];

const seeMoreLinks = {
  "For Lease": "ACTIVE",
  "For Sale": "SOLD",
  Auctions: "/",
};

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PropertyCard({ listing, wishlistIds, setWishlistIds }) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);

  // ✅ Sync liked state from wishlistIds
  useEffect(() => {
    setLiked(wishlistIds.includes(listing.propertyListId));
  }, [wishlistIds, listing.propertyListId]);

  async function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!liked) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: listing.propertyListId,
          }),
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to add");

        // ✅ Update global wishlist state
        setWishlistIds((prev) => [...prev, listing.propertyListId]);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: listing.propertyListId,
          }),
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to remove");

        // ✅ Remove from state
        setWishlistIds((prev) =>
          prev.filter((id) => id !== listing.propertyListId)
        );
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  }

  return (
    <Link href={`/singlepage/${listing.propertyListId}`} className="prop-card">
      <div className="prop-card__img-wrap">
        <img
          src={listing?.images?.[0]?.imageUrl || "/placeholder.jpg"}
          alt={listing?.propertyTitle}
          className="prop-card__img"
        />

        <span className="prop-card__type-badge">
          {listing?.propertyType?.name || "Property"}
        </span>

        <button
          className={`prop-card__heart ${liked ? "liked" : ""}`}
          onClick={toggleWishlist}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="prop-card__body">
        <p className="prop-card__price">
          ₹ {listing?.propertyRent?.toString()}
        </p>

        <p className="prop-card__addr1">{listing?.propertyAddressLine1}</p>

        <p className="prop-card__addr2">{listing?.propertyLocal}</p>

        <p className="prop-card__size">{listing?.propertySize} sq.ft</p>
      </div>
    </Link>
  );
}

export default function Trending() {
  // const [activeTab, setActiveTab] = useState("For Lease");

  const { data, loading } = usePaginatedFetch("/api/publicprop", 10);

  // ✅ GLOBAL wishlist state
  const [wishlistIds, setWishlistIds] = useState([]);

  // ✅ Fetch wishlist on load
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        const result = await res.json();

        setWishlistIds(result.data || []);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    }

    fetchWishlist();
  }, []);

  return (
    <section className="trending">
      <div className="trending__inner">
        <h2 className="trending__title">Trending on IndProp</h2>

        {/* Tabs */}
        <div className="trending__tabs-row">
          {/* <div className="trending__tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`trending__tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div> */}

          <Link href="/allproperty" className="trending__see-more ms-auto">
            See More
          </Link>
        </div>

        {/* Cards */}
        <div className="trending__cards">
          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p>No properties found</p>
          ) : (
            data
              .slice(0, 8)
              .map((listing) => (
                <PropertyCard
                  key={listing.propertyListId}
                  listing={listing}
                  wishlistIds={wishlistIds}
                  setWishlistIds={setWishlistIds}
                />
              ))
          )}
        </div>
      </div>
    </section>
  );
}
