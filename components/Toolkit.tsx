"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { useRef } from "react";
import { m as motion } from "motion/react";
import BrandIcon from "@/components/BrandIcon";
import ProcessTimeline from "@/components/ProcessTimeline";
import { toolkitContent, tools } from "@/data/tools";
import { fadeUp } from "@/lib/motion";

export default function Toolkit() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  return (
    <motion.section variants={fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.1 }} ref={section} id="toolkit" aria-labelledby="toolkit-heading" className="scroll-mt-24 overflow-hidden py-24">
      <div className="content-shell">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.15em] text-muted sm:text-sm">
          <p>{toolkitContent.label}</p>
          <p className="hidden sm:block">{toolkitContent.eyebrow}</p>
        </div>
        <h2 id="toolkit-heading" className="text-4xl font-semibold tracking-heading sm:text-5xl lg:text-6xl">{toolkitContent.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{toolkitContent.subtitle}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {tools.map((tool, index) => (
            <li key={tool.name} className="relative flex min-w-0 flex-col items-center rounded-md border border-hairline bg-gradient-to-b from-surface-2 to-surface-1 px-2 pb-4 pt-10 hover:border-accent/60">
              <span aria-hidden="true" className="absolute left-2 top-2 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <BrandIcon name={tool.name} color={tool.color} />
              <h3 className="mt-4 text-center text-sm font-semibold">{tool.name}</h3>
              <p className="mt-2 text-center font-mono text-[10px] uppercase leading-relaxed tracking-wide text-muted">{tool.category}</p>
              <span aria-hidden="true" style={{ backgroundColor: tool.color }} className="mt-4 h-1 w-6 rounded-full" />
            </li>
          ))}
        </ul>
        <ProcessTimeline sectionRef={section} />
      </div>
    </motion.section>
  );
}
