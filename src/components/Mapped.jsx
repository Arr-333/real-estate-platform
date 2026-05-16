"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "../../app/search/searchpage.module.css";
import L from "leaflet";

export default function Maped({ properties }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // ✅ Import ONLY on client
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
  });

  const center = [28.6139, 77.209];

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.map((prop) => {
        if (!prop.lat || !prop.lng) return null;

        return (
          <Marker key={prop.id} position={[Number(prop.lat), Number(prop.lng)]}>
            <Popup>
              <img src={prop.image} className={styles.cardImage} />
              <h3 className={styles.cardTitle}>{prop.title}</h3>
              <p className={styles.cardAddress}>Type: {prop.type}</p>
              <p className={styles.cardAddress}>
                Address: {prop.address1}, {prop.address2}, {prop.address3}
              </p>
              <p className={styles.cardAddress}>Size: {prop.size} sqft</p>
              <p>Price: ₹ {prop.price}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
