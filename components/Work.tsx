"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { useCallback, useRef, useState, type Ref } from "react";
import { AnimatePresence, m as motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ShowreelPlayer, { type ShowreelHandle, type ShowreelSource } from "@/components/ShowreelPlayer";
import { showreel } from "@/data/site";
import ProjectCard from "@/components/ProjectCard";
import dynamic from "next/dynamic";
const VideoModal = dynamic(() => import("@/components/VideoModal"), { ssr: false });
import { projects as defaultProjects, workContent, type Project } from "@/data/projects";
import { stagger } from "@/lib/motion";

export default function Work({ projects = defaultProjects, showreelVideo = showreel.video, showreelRef }: { projects?: Project[]; showreelVideo?: ShowreelSource; showreelRef?: Ref<ShowreelHandle> }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const close = useCallback(() => setSelected(null), []);
  const move = (direction: number) => { if (!selected) return; const index = projects.findIndex(project => project.id === selected.id); setSelected(projects[(index + direction + projects.length) % projects.length]); };
  return <section id="work" aria-labelledby="work-heading" className="py-24">
    <div className="content-shell">
      <div className="mb-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted">{showreel.label}</p>
        <ShowreelPlayer ref={showreelRef} {...showreelVideo} poster={showreelVideo.poster ?? showreel.video.poster} />
      </div>
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted">{workContent.label}</p>
      <div className="mb-6 border-b border-hairline pb-4">
        <h2 id="work-heading" className="text-4xl font-semibold tracking-heading sm:text-5xl">{workContent.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{workContent.subtitle}</p>
      </div>
      <motion.div variants={stagger} initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} className={index > 4 ? "md:col-span-4" : index === 0 || index > 2 ? "md:col-span-6" : "md:col-span-3"} onOpen={(project, button) => { trigger.current = button; setSelected(project); }} />)}
      </motion.div>
      <div className="mt-8 text-center"><a href="#contact" className="inline-flex items-center gap-4 rounded-full border border-text/20 px-8 py-4 text-sm hover:border-accent hover:text-accent motion-reduce:transition-none">{workContent.viewAll}<ArrowRight size={18} /></a></div>
    </div>
    <AnimatePresence onExitComplete={() => trigger.current?.focus({ preventScroll: true })}>{selected && <VideoModal project={selected} onClose={close} onPrevious={() => move(-1)} onNext={() => move(1)} />}</AnimatePresence>
  </section>;
}
