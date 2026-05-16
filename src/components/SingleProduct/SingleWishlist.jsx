"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ❤️ ICON */
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

export default function SingleWishlist({ property }) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);

  const propertyId = Number(property?.id);

  useEffect(() => {
    if (!propertyId) return;

    async function checkWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        const result = await res.json();
        const ids = result.data || [];

        setLiked(ids.includes(propertyId));
      } catch (err) {
        console.error("Wishlist check error:", err);
      }
    }

    checkWishlist();
  }, [propertyId]);

  /* 🔥 TOGGLE */
  async function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!propertyId) return;

    try {
      if (!liked) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error();

        setLiked(true);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (!res.ok) throw new Error();

        setLiked(false);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  }

  return (
    <div className="card border-0 shadow-sm p-2 d-flex flex-row justify-content-around">
      <button onClick={toggleWishlist} className="btn btn-light btn-sm">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          strokeWidth="2"
          stroke={liked ? "red" : "currentColor"}
          fill={liked ? "red" : "none"}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
  );
}
