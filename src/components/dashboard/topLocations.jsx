import React from "react";

async function getCities() {
  const res = await fetch("http://localhost:3000/api/city", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch cities");

  return res.json();
}

export default async function TopLocations() {
  const cities = await getCities();

  // Example: sort by deals or any metric (optional)
  const sortedCities = cities.slice(0, 10); // limit if needed

  const colors = [
    "#c8a97e",
    "#3498db",
    "#2ecc71",
    "#9b59b6",
    "#e74c3c",
    "#f39c12",
  ];

  return (
    <div className="card">
      {/* Header */}
      <div className="sec">
        <div className="sec-title">Top Performing Locations</div>
        {/* <div className="sec-link">Map view</div> */}
      </div>

      {/* ✅ Scrollable Wrapper */}
      <div
        style={{
          maxHeight: "353px",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        {sortedCities.map((city, index) => {
          const color = colors[index % colors.length];

          // Dummy values (replace later with real API fields)
          const deals = city.deals || Math.floor(Math.random() * 15) + 1;
          const value = city.value || Math.floor(Math.random() * 5) + 1;

          return (
            <div className="loc-item" key={city.cityId}>
              <div className="loc-rank">{index + 1}</div>

              <div className="loc-name fsfw">{city.cityName}</div>
              <div className="loc-name fsfw">{city.state?.stateName}</div>

              <div className="loc-bar-wrap">
                <div
                  className="loc-bar"
                  style={{
                    width: `${(deals / 15) * 100}%`,
                    background: color,
                  }}
                ></div>
              </div>

              <div className="loc-val fs">₹{value}.0Cr</div>

              <div className="loc-deals">{deals} deals</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
