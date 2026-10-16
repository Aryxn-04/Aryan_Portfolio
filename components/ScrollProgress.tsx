"use client";
import { m as motion, useScroll } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  return reduced ? null : <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-px origin-left bg-accent" />;
}
