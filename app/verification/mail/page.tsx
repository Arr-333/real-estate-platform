"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ---------- CONTENT ---------- */
function VerificationMailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();

  const openEmail = () => {
    if (!email) return;

    const domain = email.split("@")[1]?.toLowerCase();

    const mailProviders: Record<string, string> = {
      "gmail.com": "https://mail.google.com",
      "yahoo.com": "https://mail.yahoo.com",
      "outlook.com": "https://outlook.live.com",
      "hotmail.com": "https://outlook.live.com",
      "live.com": "https://outlook.live.com",
    };

    const mailUrl = mailProviders[domain || ""];

    window.open(mailUrl || "https://www.google.com", "_blank");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Verify Your Email</h1>

      <p>
        We have sent a verification link to:
        <br />
        <strong>{email}</strong>
      </p>

      <button
        onClick={openEmail}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: 600,
          color: "#ff9000",
          backgroundColor: "#eeeeee",
          borderRadius: "5px",
          marginRight: "10px",
          border: "none",
        }}
      >
        Open Your Email
      </button>

      {/* Uncomment if needed
      <button
        onClick={() => router.push("/verification/reverify-email")}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          color: "red",
          fontWeight: 600,
          backgroundColor: "#eeeeee",
          borderRadius: "5px",
          marginLeft: "10px",
          border: "none",
        }}
      >
        Reverify Email
      </button>
      */}
    </div>
  );
}

/* ---------- PAGE ---------- */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationMailContent />
    </Suspense>
  );
}
