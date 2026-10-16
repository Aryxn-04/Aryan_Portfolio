"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import VideoModal from "@/components/VideoModal";
import { projects, workContent, type Project } from "@/data/projects";
import { DURATION, EASING, stagger } from "@/lib/motion";

export default function Work() {
  const [filter, setFilter] = useState<(typeof workContent.filters)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const visible = useInView(grid, { once: true, amount: 0.1 });
  const reduced = useReducedMotion();
  const filtered = projects.filter(project => filter === "All" || project.tags.some(tag => tag === filter));
  const close = useCallback(() => setSelected(null), []);
  const move = (direction: number) => { if (!selected) return; const index = filtered.findIndex(project => project.id === selected.id); setSelected(filtered[(index + direction + filtered.length) % filtered.length]); };
  return <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 py-24">
    <div className="content-shell">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted">{workContent.label}</p>
      <div className="mb-6 flex flex-col justify-between gap-8 border-b border-hairline pb-4 lg:flex-row lg:items-end">
        <div><h2 id="work-heading" className="text-4xl font-semibold tracking-heading sm:text-5xl">{workContent.title}</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{workContent.subtitle}</p></div>
        <LayoutGroup id="work-filters"><div role="group" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-2">
          {workContent.filters.map(tab => <button key={tab} type="button" aria-pressed={filter === tab} onClick={() => setFilter(tab)} className={`relative whitespace-nowrap pb-4 pt-2 text-sm ${filter === tab ? "text-text" : "text-muted hover:text-text"}`}>{tab}{filter === tab && <motion.span layoutId="filter-underline" transition={{ duration: reduced ? 0 : DURATION.ui, ease: EASING }} className="absolute inset-x-0 bottom-0 h-px bg-accent" />}</button>)}
        </div></LayoutGroup>
      </div>
      <motion.div ref={grid} variants={reduced ? undefined : stagger} initial={reduced ? false : "hidden"} animate={visible ? "visible" : "hidden"} className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <AnimatePresence mode="popLayout" initial={false}>{filtered.map((project, index) => <ProjectCard key={project.id} project={project} className={filter !== "All" || index > 2 ? "md:col-span-4" : index === 0 ? "md:col-span-6" : "md:col-span-3"} onOpen={(project, button) => { trigger.current = button; setSelected(project); }} />)}</AnimatePresence>
        {!filtered.length && <p role="status" className="py-16 text-center text-muted md:col-span-12">{workContent.empty}</p>}
      </motion.div>
      <div className="mt-8 text-center"><a href="#contact" className="inline-flex items-center gap-4 rounded-full border border-text/20 px-8 py-4 text-sm transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none">{workContent.viewAll}<ArrowRight size={18} /></a></div>
    </div>
    <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>{selected && <VideoModal project={selected} onClose={close} onPrevious={() => move(-1)} onNext={() => move(1)} />}</AnimatePresence>
  </section>;
}
