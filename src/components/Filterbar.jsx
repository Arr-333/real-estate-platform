"use client";

import { useEffect, useState } from "react";
import styles from "../../app/search/searchpage.module.css";

export default function FilterBar({
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
}) {
  const [types, setTypes] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // ✅ Fetch Property Types
    fetch("/api/propertyType")
      .then((res) => res.json())
      .then((data) => setTypes(data));

    // ✅ Fetch Cities
    fetch("/api/city")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  return (
    <div className={styles.filterBar}>
      {/* TYPE FILTER */}
      <select
        className={styles.select}
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      {/* CITY FILTER */}
      <select
        className={styles.select}
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c.cityId} value={c.cityName}>
            {c.cityName}
          </option>
        ))}
      </select>
    </div>
  );
}
