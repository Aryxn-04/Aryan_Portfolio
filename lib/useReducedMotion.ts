"use client";
import { useEffect, useState } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

// Keep the first client render identical to SSR, then subscribe to OS changes.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}
