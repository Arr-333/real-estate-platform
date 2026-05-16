"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertySearch() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const [types, setTypes] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Fetch filters
  useEffect(() => {
    fetch("/api/propertyType")
      .then((res) => res.json())
      .then(setTypes);

    fetch("/api/city")
      .then((res) => res.json())
      .then(setCities);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (propertyType) params.set("propertyType", propertyType);
    if (location) params.set("location", location);
    if (minRent) params.set("minRent", minRent);
    if (maxRent) params.set("maxRent", maxRent);

    router.push(`/allproperty?${params.toString()}`);
  };

  return (
    <div className="card p-3">
      <div className="row g-2">
        {/* Location */}
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="City..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="col-md-3 d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            value={minRent}
            onChange={(e) => setMinRent(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="col-md-3">
          <button onClick={handleSearch} className="btn btn-primary w-100">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
