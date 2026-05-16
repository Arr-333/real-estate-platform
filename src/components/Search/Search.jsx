"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import style from "@/components/Search/hero.module.css";

// ─── Icon mapping: PropertyType.name (DB) → local icon path ─────────────────
// Matches case-insensitively against the `name` stored in the DB.
const ICON_MAP = {
  office: "/icons/building.png",
  industrial: "/icons/factory.png",
  warehouse: "/icons/warehouse.png",
  businesses: "/icons/business-and-trade.png",
  business: "/icons/business-and-trade.png",
  land: "/icons/land.png",
  retail: "/icons/retail.png",
  multifamily: "/icons/multifamily.png",
  hospitality: "/icons/hospitality.png",
  specialpurpose: "/icons/special-purpose.png",
  special: "/icons/special-purpose.png",
};

function getIcon(name = "") {
  return (
    ICON_MAP[name.toLowerCase().replace(/\s+/g, "")] || "/icons/building.png"
  );
}

export default function Search() {
  const router = useRouter();

  // ── Input / autocomplete state ────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 5;
  const suggestRef = useRef(null);

  useEffect(() => {
    async function fetchPropertyTypes() {
      try {
        const res = await fetch("/api/propertyType");
        const data = await res.json();

        const mapped = (Array.isArray(data) ? data : []).map((pt) => ({
          key: pt.name, // e.g. "Office"  ← matches DB / Solr
          label: pt.name,
          icon: pt.image || getIcon(pt.name), // prefer DB image, fallback to local icon
        }));

        setTabs(mapped);
      } catch (err) {
        console.error("Failed to load property types:", err);

        // Hardcoded fallback so the UI is never empty
        setTabs([
          { key: "Office", label: "Office", icon: "/icons/building.png" },
          {
            key: "Industrial",
            label: "Industrial",
            icon: "/icons/factory.png",
          },
          {
            key: "Warehouse",
            label: "Warehouse",
            icon: "/icons/warehouse.png",
          },
          {
            key: "Businesses",
            label: "Business",
            icon: "/icons/business-and-trade.png",
          },
          { key: "Land", label: "Land", icon: "/icons/land.png" },
          { key: "Retail", label: "Retail", icon: "/icons/retail.png" },
          {
            key: "Multifamily",
            label: "Multifamily",
            icon: "/icons/multifamily.png",
          },
          {
            key: "Hospitality",
            label: "Hospitality",
            icon: "/icons/hospitality.png",
          },
          {
            key: "SpecialPurpose",
            label: "Special",
            icon: "/icons/special-purpose.png",
          },
        ]);
      }
    }

    fetchPropertyTypes();
  }, []);

  const visibleTabs = tabs.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < tabs.length) setStartIndex(startIndex + 1);
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 4️⃣  Autocomplete: fetch matching cities from /api/location-suggest?q=Mu
  //      Response: [{ id, label: "Muzaffarnagar, Uttar Pradesh", lat, lng }]
  //      The dropdown is scrollable and shows city + state on two lines.
  // ─────────────────────────────────────────────────────────────────────────
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedLocation(null); // clear any previous selection

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/location-suggest?q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.label);
    setSelectedLocation(item);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const onOutsideClick = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // 2️⃣ & 3️⃣  Search handler
  //
  //  Case A – tab + location selected  → /search?propertyType=Office&lat=...&lng=...&radius=25
  //  Case B – tab only, no location    → /search?propertyType=Office          (all Office anywhere)
  //  Case C – no tab, location typed   → /search?location=Kanpur              (all types in Kanpur)
  //  Case D – no tab, no location      → /search                              (show everything)
  // ─────────────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (activeTab) {
      params.set("propertyType", activeTab);
    }

    if (selectedLocation?.lat && selectedLocation?.lng) {
      params.set("lat", selectedLocation.lat);
      params.set("lng", selectedLocation.lng);
      params.set("radius", "25");
    } else if (query.trim()) {
      // User typed a city name but didn't select from dropdown
      params.set("location", query.trim());
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      handleSearch();
    }
  };

  return (
    <>
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className={`carousel-item active js-fullheight ${style.hero}`}>
            <div className="overlay"></div>

            <div className="container">
              <div className="row no-gutters slider-text align-items-center justify-content-center">
                <div className="col-md-12 ftco-animate">
                  <div className="text w-100 mt-5 text-center">
                    <div className="module clearfix wrapper-container">
                      <div className="row">
                        <div className="column-12">
                          <h1>
                            <span className="hero-heading">
                              The World's #1 Commercial Real Estate Marketplace
                            </span>
                          </h1>

                          {/* ══════════════ SEARCH BOX ══════════════ */}
                          <div className={style.heroBox}>
                            {/* ── Property-type tabs with prev/next arrows ── */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <button
                                className="m-5"
                                onClick={handlePrev}
                                disabled={startIndex === 0}
                                aria-label="Previous categories"
                              >
                                ◀
                              </button>

                              <ul
                                className={style.tabList}
                                style={{
                                  display: "flex",
                                  flex: 1,
                                  overflow: "hidden",
                                  justifyContent: "space-between",
                                }}
                              >
                                {visibleTabs.map((tab) => (
                                  <li
                                    key={tab.key}
                                    className={
                                      activeTab === tab.key
                                        ? style.activeTab
                                        : ""
                                    }
                                    onClick={() =>
                                      // Re-clicking the active tab deselects it (show all property types)
                                      setActiveTab((prev) =>
                                        prev === tab.key ? "" : tab.key
                                      )
                                    }
                                    style={{
                                      textAlign: "center",
                                      cursor: "pointer",
                                    }}
                                    title={tab.label}
                                  >
                                    <img
                                      src={tab.icon}
                                      alt={tab.label}
                                      style={{
                                        width: "22px",
                                        height: "22px",
                                        display: "block",
                                        margin: "0 auto",
                                      }}
                                    />
                                    <span>{tab.label}</span>
                                  </li>
                                ))}
                              </ul>

                              <button
                                onClick={handleNext}
                                disabled={
                                  startIndex + itemsPerPage >= tabs.length
                                }
                                className="m-5"
                                aria-label="Next categories"
                              >
                                ▶
                              </button>
                            </div>

                            {/* ── Location input with autocomplete dropdown ── */}
                            <div
                              ref={suggestRef}
                              style={{ position: "relative", width: "100%" }}
                            >
                              {/* Pin icon (left) */}
                              <i
                                className="fa-solid fa-location-arrow"
                                style={{
                                  fontSize: "18px",
                                  position: "absolute",
                                  left: "10px",
                                  top: "60%",
                                  transform: "translateY(-50%)",
                                  color: "#333",
                                  zIndex: 2,
                                  pointerEvents: "none",
                                }}
                              />

                              {/* Search button (right) */}
                              <button
                                onClick={handleSearch}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                                aria-label="Search"
                              >
                                <i
                                  className="fa-solid fa-magnifying-glass"
                                  style={{
                                    fontSize: "18px",
                                    position: "absolute",
                                    right: "10px",
                                    top: "60%",
                                    transform: "translateY(-50%)",
                                    color: "#cc0202",
                                    zIndex: 2,
                                  }}
                                />
                              </button>

                              {/* Text input */}
                              <input
                                className={style.ips}
                                type="text"
                                value={query}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() =>
                                  suggestions.length > 0 &&
                                  setShowSuggestions(true)
                                }
                                placeholder={
                                  activeTab
                                    ? `Location for ${activeTab} (leave blank for all)`
                                    : "Enter a city (leave blank to see all)"
                                }
                                style={{
                                  paddingLeft: "35px",
                                  paddingRight: "40px",
                                }}
                              />

                              {/* ── 4️⃣ Scrollable city + state dropdown ── */}
                              {showSuggestions && suggestions.length > 0 && (
                                <ul
                                  style={{
                                    position: "absolute",
                                    top: "calc(100% + 6px)",
                                    left: 0,
                                    right: 0,
                                    background: "#fff",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                    zIndex: 100,
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                    maxHeight: "220px" /* scrollable */,
                                    overflowY: "auto",
                                  }}
                                >
                                  {suggestions.map((item) => {
                                    // label: "Muzaffarnagar, Uttar Pradesh"
                                    const commaIdx = item.label.indexOf(",");
                                    const cityPart =
                                      commaIdx !== -1
                                        ? item.label.slice(0, commaIdx).trim()
                                        : item.label;
                                    const statePart =
                                      commaIdx !== -1
                                        ? item.label.slice(commaIdx + 1).trim()
                                        : "";

                                    return (
                                      <li
                                        key={item.id}
                                        onMouseDown={() =>
                                          handleSelect(item)
                                        } /* mousedown fires before input blur */
                                        style={{
                                          padding: "10px 14px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #f0f0f0",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "flex-start",
                                          background: "#fff",
                                          transition: "background 0.15s",
                                        }}
                                        onMouseEnter={(e) =>
                                          (e.currentTarget.style.background =
                                            "#f7f7f7")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.currentTarget.style.background =
                                            "#fff")
                                        }
                                      >
                                        {/* City name */}
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            color: "#111",
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-location-dot"
                                            style={{
                                              color: "#cc0202",
                                              fontSize: "12px",
                                            }}
                                          />
                                          {cityPart}
                                        </span>

                                        {/* State name */}
                                        {statePart && (
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              color: "#888",
                                              marginTop: "2px",
                                              paddingLeft: "18px",
                                            }}
                                          >
                                            {statePart}
                                          </span>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          </div>
                          {/* ══ END SEARCH BOX ══ */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
