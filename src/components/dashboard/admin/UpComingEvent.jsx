"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ── Event Card ── */
function EventCard({ event }) {
  return (
    <div className="event-card">
      {/* <Image
        src={event.img}
        alt="event"
        width={300}
        height={200}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      /> */}
      <img
        src={event.images?.[0]?.imageUrl || "/img/noimage.png"}
        alt="Property"
        className="card-img-top rounded object-fit-cover"
        style={{ height: "180px", width: "100%" }}
      />

      <div className="mt-2">
        <h6>{event.title}</h6>
        <p>{event.adressline1}</p>
        <small>{event.propertyType}</small>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function UpcomingEvent() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // ✅ BACKEND CALL
      const res = await fetch("/api/listing");
      const result = await res.json();

      const now = new Date();

      // ✅ UPCOMING FILTER (same logic as your example)
      const filtered = (result.data || []).filter((item) => {
        if (!item.propertyAvailabilityDate) return false;

        const date = new Date(item.propertyAvailabilityDate);
        return date > now;
      });

      // ✅ FORMAT DATA (match UI)
      const formatted = filtered.map((item) => ({
        img: item.image?.[0]?.imageUrl || "/placeholder.jpg",
        title: item.propertyTitle,
        adressline1: item.propertyAddressLine1,
        propertyType: item.propertyType?.name,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  return (
    <div className="col-lg-4 col-xxl-3">
      <div className="card">
        <div className="card-header d-flex align-items-center flex-wrap gap-2">
          <h5 className="card-title mb-0 flex-grow-1">Upcoming Events</h5>

          {/* <div className="dropdown flex-shrink-0">
            <a
              href="#!"
              className="link link-custom-primary"
              data-bs-toggle="dropdown"
            >
              ⋯
            </a>

             <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item">Weekly</a></li>
              <li><a className="dropdown-item">Monthly</a></li>
              <li><a className="dropdown-item">Yearly</a></li>
            </ul> 
          </div> */}
        </div>

        <div className="card-body">
          {events.length === 0 ? (
            <p>No upcoming events</p>
          ) : (
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              spaceBetween={20}
              slidesPerView={1}
            >
              {events.map((event, i) => (
                <SwiperSlide key={i}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
