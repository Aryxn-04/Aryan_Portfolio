"use client";

import { useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { processContent, processSteps } from "@/data/process";

const TIMELINE = {
  tickCount: 81,
  majorTickInterval: 4,
  perforations: 8,
  endProgress: 0.999,
  offsets: ["start end", "end end"],
} as const;

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function ProcessTimeline({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const reduced = hydrated && prefersReduced;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: [...TIMELINE.offsets] });
  const travel = useTransform(scrollYProgress, [0, 1], ["0%", "99.8%"]);
  const [active, setActive] = useState(-1);
  const lastActive = useRef(-1);
  useMotionValueEvent(scrollYProgress, "change", progress => {
    const next = Math.floor(Math.min(progress, TIMELINE.endProgress) * processSteps.length);
    if (lastActive.current !== next) {
      lastActive.current = next;
      setActive(next);
    }
  });

  return (
    <div role="group" aria-label={processContent.label} className="relative mt-10 border-y border-hairline py-6 md:mt-12 md:py-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-4 items-end justify-between border-b border-hairline md:flex">
        {Array.from({ length: TIMELINE.tickCount }, (_, index) => <span key={index} className={`w-px bg-muted/40 ${index % TIMELINE.majorTickInterval === 0 ? "h-2" : "h-1"}`} />)}
      </div>
      <ol className="grid grid-cols-1 gap-4 pl-6 md:grid-cols-4 md:gap-2 md:pl-0">
        {processSteps.map((step, index) => (
          <li key={step.name} className="relative overflow-hidden rounded-md border border-hairline bg-surface-1 py-6 pl-10 pr-4">
            <div aria-hidden="true" className={`absolute inset-0 rounded-md border border-accent/60 bg-accent/10 ${reduced || active >= index ? "opacity-100" : "opacity-0"}`} />
            <div aria-hidden="true" className="absolute bottom-2 left-2 top-2 flex w-2 flex-col justify-between">
              {Array.from({ length: TIMELINE.perforations }, (_, hole) => <span key={hole} className="h-2 w-2 bg-bg" />)}
            </div>
            <div className="relative">
              <p className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 text-lg font-semibold">{step.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      {!reduced && <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div style={{ x: travel }} className="absolute inset-0 hidden will-change-transform md:block">
          <span className="absolute bottom-0 left-0 top-0 w-px bg-accent" />
          <span className="absolute left-0 top-0 h-2 w-4 -translate-x-1/2 bg-accent [clip-path:polygon(0_0,100%_0,50%_100%)]" />
        </motion.div>
        <motion.div style={{ y: travel }} className="absolute inset-0 will-change-transform md:hidden">
          <span className="absolute left-0 right-0 top-0 h-px bg-accent" />
          <span className="absolute left-0 top-0 h-4 w-2 -translate-y-1/2 bg-accent [clip-path:polygon(0_0,100%_50%,0_100%)]" />
        </motion.div>
      </div>}
      <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-hairline md:hidden" />
    </div>
  );
}
