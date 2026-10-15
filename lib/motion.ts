import type { Variants } from "motion/react";

export const EASING = [0.22, 1, 0.36, 1] as const;
export const DURATION = { ui: 0.4, reveal: 0.8 } as const;
export const MOTION = {
  revealDistance: 24,
  staggerChildren: 0.08,
  staggerDelay: 0.08,
} as const;

const revealTransition = { duration: DURATION.reveal, ease: EASING };

// Apply at section level. Consumers must honor reduced motion; the root
// MotionConfig also disables transform animations when the OS requests it.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: MOTION.revealDistance },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: MOTION.staggerChildren,
      delayChildren: MOTION.staggerDelay,
    },
  },
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: { opacity: 1, scaleX: 1, transition: revealTransition },
};

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
