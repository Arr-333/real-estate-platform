import React, { useState } from "react";

export default function ScheduleBtn({ propertyId }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type, text }

  const handleClick = async () => {
    if (!propertyId) {
      setMsg({ type: "error", text: "Invalid property" });
      return;
    }

    try {
      setLoading(true);
      setMsg(null);

      const res = await fetch("/api/client-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({
          type: "error",
          text: data.error || "Something went wrong",
        });
        return;
      }

      setMsg({
        type: "success",
        text: "Tour request sent successfully 🚀",
      });
    } catch (err) {
      console.error(err);
      setMsg({
        type: "error",
        text: "Failed to send request",
      });
    } finally {
      setLoading(false);

      // auto remove message
      setTimeout(() => setMsg(null), 3000);
    }
  };
  return (
    <>
      <div className="w-100">
        <button
          className="btn btn-primary w-100"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Sending..." : "📅 Schedule a Tour"}
        </button>

        {msg && (
          <div
            className={`mt-2 p-2 rounded text-center small ${
              msg.type === "success"
                ? "bg-success text-white"
                : "bg-danger text-white"
            }`}
          >
            {msg.text}
          </div>
        )}
      </div>
    </>
  );
}
