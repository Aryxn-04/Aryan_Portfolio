"use client";

import { useEffect, type ReactNode } from "react";
import { cubicBezier, MotionConfig, LazyMotion, domAnimation } from "motion/react";
import Lenis from "lenis";
import { DURATION, EASING, REDUCED_MOTION_QUERY } from "@/lib/motion";

const scrollEasing = cubicBezier(...EASING);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION_QUERY);
    let lenis: Lenis | undefined;

    const syncPreference = () => {
      lenis?.destroy();
      lenis = undefined;

      if (!preference.matches) {
        lenis = new Lenis({
          autoRaf: true,
          duration: DURATION.reveal,
          easing: scrollEasing,
          smoothWheel: true,
          anchors: { offset: -80 },
        });
      }
    };

    syncPreference();
    preference.addEventListener("change", syncPreference);

    return () => {
      preference.removeEventListener("change", syncPreference);
      lenis?.destroy();
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}><MotionConfig reducedMotion="user" transition={{ duration: DURATION.ui, ease: EASING }}>
      {children}
    </MotionConfig></LazyMotion>
  );
}
