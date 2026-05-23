// "use client";

// import React, { useState, useEffect } from "react";
// import usePaginatedFetch from "../../src/components/hooks/usePaginatedFetch";
// import Link from "next/link";
// import Pagination from "../../src/components/DataTable/Pagination";
// import { useRouter, useSearchParams } from "next/navigation";
// import PropertySearch from "../../src/components/dashboard/customer/PropertySearch";

// /* ------------------ ICON ------------------ */
// function HeartIcon() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       width="18"
//       height="18"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//     >
//       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//     </svg>
//   );
// }

// /* ------------------ PAGE ------------------ */
// export default function Page() {
//   const searchParams = useSearchParams();

//   // ✅ Build dynamic API URL
//   const query = new URLSearchParams();

//   const propertyType = searchParams.get("propertyType");
//   const location = searchParams.get("location");
//   const minRent = searchParams.get("minRent");
//   const maxRent = searchParams.get("maxRent");

//   if (propertyType) query.set("propertyType", propertyType);
//   if (location) query.set("location", location);
//   if (minRent) query.set("minRent", minRent);
//   if (maxRent) query.set("maxRent", maxRent);

//   query.set("limit", "12");

//   const apiUrl = `/api/publicprop?${query.toString()}`;

//   const { data, page, setPage, totalPages, loading } =
//     usePaginatedFetch(apiUrl);

//   /* ------------------ WISHLIST ------------------ */
//   const [wishlistIds, setWishlistIds] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchWishlist() {
//       try {
//         const res = await fetch("/api/wishlist");
//         const result = await res.json();
//         setWishlistIds(result.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     fetchWishlist();
//   }, []);

//   return (
//     <section className="trending">
//       <div className="trending__inner">
//         {/* ✅ SEARCH BAR (REUSABLE) */}
//         <div className="mb-4">
//           <PropertySearch />
//         </div>

//         {/* Cards */}
//         <div className="trending__cards">
//           {loading ? (
//             <p>Loading...</p>
//           ) : data.length === 0 ? (
//             <p>No properties found</p>
//           ) : (
//             data.map((listing) => (
//               <PropertyCard
//                 key={listing.propertyListId}
//                 listing={listing}
//                 wishlistIds={wishlistIds}
//                 setWishlistIds={setWishlistIds}
//               />
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="d-flex justify-content-center mt-4">
//           <ul className="pagination">
//             <Pagination page={page} totalPages={totalPages} setPage={setPage} />
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ------------------ CARD ------------------ */
// function PropertyCard({ listing, wishlistIds, setWishlistIds }) {
//   const router = useRouter();
//   const liked = wishlistIds.includes(listing.propertyListId);

//   async function toggleWishlist(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       if (!liked) {
//         const res = await fetch("/api/wishlist", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ propertyId: listing.propertyListId }),
//         });

//         if (res.status === 401) return router.push("/auth/login");

//         setWishlistIds((prev) => [...prev, listing.propertyListId]);
//       } else {
//         const res = await fetch("/api/wishlist", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ propertyId: listing.propertyListId }),
//         });

//         if (res.status === 401) return router.push("/auth/login");

//         setWishlistIds((prev) =>
//           prev.filter((id) => id !== listing.propertyListId)
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return (
//     <Link href={`/singlepage/${listing.propertyListId}`} className="prop-card">
//       <div className="prop-card__img-wrap">
//         <img
//           src={listing?.images?.[0]?.imageUrl || "/placeholder.jpg"}
//           alt={listing?.propertyTitle}
//           className="prop-card__img"
//         />

//         <span className="prop-card__type-badge">
//           {listing?.propertyType?.name || "Property"}
//         </span>

//         <button
//           className={`prop-card__heart ${liked ? "liked" : ""}`}
//           onClick={toggleWishlist}
//         >
//           <HeartIcon />
//         </button>
//       </div>

//       <div className="prop-card__body">
//         <p className="prop-card__price">₹ {listing?.propertyRent}</p>

//         <p className="prop-card__addr1">{listing?.propertyAddressLine1}</p>

//         <p className="prop-card__addr2">{listing?.propertyLocal}</p>

//         <p className="prop-card__size">{listing?.propertySize} sq.ft</p>
//       </div>
//     </Link>
//   );
// }
"use client";

import React, { useState, useEffect, Suspense } from "react";
import usePaginatedFetch from "../../src/components/hooks/usePaginatedFetch";
import Link from "next/link";
import Pagination from "../../src/components/DataTable/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import PropertySearch from "../../src/components/dashboard/customer/PropertySearch";

/* ------------------ ICON ------------------ */
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

/* ------------------ PAGE CONTENT ------------------ */
function AllPropertyContent() {
  const searchParams = useSearchParams();

  // Build dynamic API URL
  const query = new URLSearchParams();

  const propertyType = searchParams.get("propertyType");
  const location = searchParams.get("location");
  const minRent = searchParams.get("minRent");
  const maxRent = searchParams.get("maxRent");

  if (propertyType) query.set("propertyType", propertyType);
  if (location) query.set("location", location);
  if (minRent) query.set("minRent", minRent);
  if (maxRent) query.set("maxRent", maxRent);

  query.set("limit", "12");

  const apiUrl = `/api/publicprop?${query.toString()}`;

  const { data, page, setPage, totalPages, loading } =
    usePaginatedFetch(apiUrl);

  /* ------------------ WISHLIST ------------------ */
  const [wishlistIds, setWishlistIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        const result = await res.json();
        setWishlistIds(result.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchWishlist();
  }, []);

  return (
    <section className="trending">
      <div className="trending__inner">
        <div className="mb-4">
          <PropertySearch />
        </div>

        <div className="trending__cards">
          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p>No properties found</p>
          ) : (
            data.map((listing) => (
              <PropertyCard
                key={listing.propertyListId}
                listing={listing}
                wishlistIds={wishlistIds}
                setWishlistIds={setWishlistIds}
              />
            ))
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------ PAGE WRAPPER ------------------ */
export default function Page() {
  return (
    <Suspense fallback={<p>Loading properties...</p>}>
      <AllPropertyContent />
    </Suspense>
  );
}

/* ------------------ CARD ------------------ */
function PropertyCard({ listing, wishlistIds, setWishlistIds }) {
  const router = useRouter();
  const liked = wishlistIds.includes(listing.propertyListId);

  async function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!liked) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: listing.propertyListId }),
        });

        if (res.status === 401) return router.push("/auth/login");

        setWishlistIds((prev) => [...prev, listing.propertyListId]);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: listing.propertyListId }),
        });

        if (res.status === 401) return router.push("/auth/login");

        setWishlistIds((prev) =>
          prev.filter((id) => id !== listing.propertyListId)
        );
      }
    } catch (err) {
      console.error(err);
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
        <p className="prop-card__price">₹ {listing?.propertyRent}</p>
        <p className="prop-card__addr1">{listing?.propertyAddressLine1}</p>
        <p className="prop-card__addr2">{listing?.propertyLocal}</p>
        <p className="prop-card__size">{listing?.propertySize} sq.ft</p>
      </div>
    </Link>
  );
}
