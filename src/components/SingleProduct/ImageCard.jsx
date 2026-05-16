"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ImageCard.module.css";

const GAP = 16; // must match gap in CSS

export default function ImageCard({ images = [] }) {
  const [active, setActive] = useState(0);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const total = images.length;

  const prev = () => setActive((i) => (i - 1 + total) % total);
  const next = () => setActive((i) => (i + 1) % total);

  const recalc = useCallback(() => {
    const slider = sliderRef.current;
    const track = trackRef.current;
    if (!slider || !track) return;

    const containerW = slider.offsetWidth;
    const slideW = containerW * 0.6;
    const step = slideW + GAP;
    const tx = containerW / 2 - (active * step + slideW / 2);

    track.style.transform = `translateX(${tx}px)`;

    // Also set each slide's width explicitly (avoids % ambiguity inside flex)
    const slides = track.querySelectorAll(`.${styles.peekSlide}`);
    slides.forEach((s) => {
      s.style.width = `${slideW}px`;
    });
  }, [active]);

  useEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  if (!total) return <p className={styles.empty}>No images available</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gallery</h1>

      <div className={styles.peekSlider} ref={sliderRef}>
        <div className={styles.peekTrack} ref={trackRef}>
          {images.map((img, i) => (
            <div
              key={i}
              className={`${styles.peekSlide} ${i === active ? styles.active : ""}`}
              onClick={() => i !== active && setActive(i)}
            >
              <img src={img} alt={`slide-${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>

        <button className={`${styles.nav} ${styles.prev}`} onClick={prev}>
          ‹
        </button>
        <button className={`${styles.nav} ${styles.next}`} onClick={next}>
          ›
        </button>

        <div className={styles.dots}>
          {images.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <div className={styles.imageCount}>
          {active + 1} / {total}
        </div>
      </div>
    </div>
  );
}
