"use client";
import React, { useState, useEffect } from "react";

/* ── Countdown Hook ── */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = Math.max(0, targetDate - Date.now());

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

/* ── Slider ── */
function HomeSlider({ active, setActive, properties }) {
  const total = properties.length;

  if (!total) return null;

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  return (
    <div className="home-slider">
      <div className="home-slider__swipe-wrapper">
        <div
          className="home-slider__sliding-area"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {properties.map((p, i) => (
            <a
              key={i}
              href={p.href}
              className="home-slider__item"
              style={{ backgroundImage: `url(${p.img})` }}
            />
          ))}
        </div>
      </div>

      <div className="home-slider__arrow-buttons">
        <button className="prev" onClick={prev} aria-label="Previous">
          &#8249;
        </button>
        <button className="next" onClick={next} aria-label="Next">
          &#8250;
        </button>
      </div>

      <div className="home-slider__dots">
        {properties.map((_, i) => (
          <button
            key={i}
            className={i === active ? "active" : ""}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Auction() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const res = await fetch("/api/publicprop?status=ACCEPTED");
        const result = await res.json();

        const formatted = (result.data || []).map((item) => {
          const start = item.propertyAvailabilityDate
            ? new Date(item.propertyAvailabilityDate)
            : new Date();

          const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // +6 hours

          return {
            href: `/singlepage/${item.propertyListId}`,
            img: item.images?.[0]?.imageUrl || "/placeholder.jpg",
            title: item.propertyTitle,
            type: item.propertyType?.name,
            location: item.propertyAddressLine1,
            startingBid: item.propertyRent,

            // ✅ NEW LOGIC
            auctionStart: start,
            auctionEnd: end,
          };
        });

        setProperties(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcoming();
  }, []);

  const currentProperty = properties[activeIndex] || {};

  const now = new Date();
  const startTime = currentProperty.auctionStart
    ? new Date(currentProperty.auctionStart)
    : new Date();

  const endTime = currentProperty.auctionEnd
    ? new Date(currentProperty.auctionEnd)
    : new Date();

  const isLive = now >= startTime && now <= endTime;

  const targetTime =
    now < startTime ? startTime : now <= endTime ? endTime : now;

  // ✅ ALWAYS CALL HOOK
  const { days, hours, mins, secs } = useCountdown(targetTime);

  // ✅ AFTER hooks → conditional return
  if (loading) return <p>Loading auctions...</p>;
  if (!properties.length) return <p>No upcoming auctions</p>;

  return (
    <div className="auction">
      <div className="auction-wrapper">
        {/* LEFT */}
        <div className="left">
          <div className="body">
            {/* KPI */}
            <div className="kpi">
              {/* Status */}
              <div className={`title ${isLive ? "live" : ""}`}>
                🔨
                <h3>
                  {now < startTime
                    ? "Upcoming Auction"
                    : isLive
                      ? "Live Auction"
                      : "Auction Closed"}
                </h3>
              </div>

              {/* Property */}
              <div className="property-type">
                <h3>{currentProperty.type}</h3>
                <p>{currentProperty.location}</p>
              </div>

              {/* Timer + Price */}
              <div className="kpi-info">
                <div className="kpi-1">
                  <div className="countdown">
                    {days > 0 && <span>{days}d :</span>}
                    <span>{hours}h :</span>
                    <span>{mins}m :</span>
                    <span>{secs}s</span>
                  </div>

                  <p>
                    {now < startTime
                      ? "Auction Starts"
                      : isLive
                        ? "Auction Ends"
                        : "Auction Closed"}
                  </p>
                </div>

                <div className="divider" />

                <div className="kpi-2">
                  <h3>${currentProperty.startingBid.toLocaleString()}</h3>
                  <p>Starting Bid</p>
                </div>
              </div>

              <div className="show-more-btn">
                <div>See More</div>
                <span>›</span>
              </div>

              <a href="/" className="upcoming-btn">
                View Upcoming
              </a>
            </div>

            {/* SLIDER */}
            <div className="image pt-3">
              <HomeSlider
                active={activeIndex}
                setActive={setActiveIndex}
                properties={properties}
              />
            </div>
          </div>

          <div className="disclaimer">*Auctions are in USD</div>
        </div>

        {/* RIGHT */}
        <div className="right pt-5">
          <div className="info">
            <h2>Discover Your Next Investment at Auction</h2>
            <p>
              Identify and bid on quality assets through our transparent and
              competitive platform—all online. Join the investors worldwide who
              have partnered with us to successfully transact 11,000+
              properties.
            </p>
            <a href="/">Learn More About Auctions</a>
          </div>

          <div className="next-box">
            <span className="stopwatch-icon">⏱</span>
            <div className="text">
              <h3>Live Auction Now</h3>
              <a href="/">See Available Listings</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// NOTE: are we even showing full detail of upcoming property or not
