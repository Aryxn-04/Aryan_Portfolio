"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

// Gradient size, color, strength, position and drift tuning live at the top of globals.css.
const PARALLAX_DISTANCE = 12;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const DESKTOP_EFFECTS_QUERY = "(min-width: 768px)";
const POINTER_X = "--hero-pointer-x";
const POINTER_Y = "--hero-pointer-y";

export default function HeroBackground() {
  const background = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = background.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const wide = window.matchMedia(DESKTOP_EFFECTS_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0; pointer = null;
      layer.style.removeProperty(POINTER_X);
      layer.style.removeProperty(POINTER_Y);
    };
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      const x = pointer ? -clamp((pointer.x - bounds.left) / bounds.width * 2 - 1) * PARALLAX_DISTANCE : 0;
      const y = pointer ? -clamp((pointer.y - bounds.top) / bounds.height * 2 - 1) * PARALLAX_DISTANCE : 0;
      layer.style.setProperty(POINTER_X, `${x}px`);
      layer.style.setProperty(POINTER_Y, `${y}px`);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || document.hidden) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const configure = () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", reset);
      reset();
      if (fine.matches && wide.matches && !reduced.matches) {
        section.addEventListener("pointermove", move, { passive: true });
        section.addEventListener("pointerleave", reset);
      }
    };
    const visibility = () => { if (document.hidden) reset(); };
    configure();
    [fine, wide, reduced].forEach(query => query.addEventListener("change", configure));
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", reset);
    return () => {
      reset();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", reset);
      [fine, wide, reduced].forEach(query => query.removeEventListener("change", configure));
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return <div ref={background} aria-hidden="true" className="hero-background pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="hero-aurora-track hero-aurora-track-primary"><div className="hero-aurora hero-aurora-primary" /></div>
    <div className="hero-aurora-track hero-aurora-track-secondary"><div className="hero-aurora hero-aurora-secondary" /></div>
    <div className="hero-spotlight" />
    <div className="hero-light-streak" />
    <div className="hero-vignette absolute inset-0" />
  </div>;
}
