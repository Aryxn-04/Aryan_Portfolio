"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m as motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { DURATION, EASING } from "@/lib/motion";

interface Props { project: Project; className?: string; onOpen: (project: Project, trigger: HTMLButtonElement) => void }
const ProjectCard = forwardRef<HTMLDivElement, Props>(function ProjectCard({ project, className, onOpen }, ref) {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const hovered = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stop = () => { hovered.current = false; video.current?.pause(); setPlaying(false); };
  const play = () => {
    if (!hovered.current || !video.current) return;
    void video.current.play().then(() => { if (hovered.current) setPlaying(true); else video.current?.pause(); }).catch(() => setPlaying(false));
  };
  useEffect(() => {
    if (loaded && hovered.current && video.current) {
      void video.current.play().then(() => { if (hovered.current) setPlaying(true); else video.current?.pause(); }).catch(() => setPlaying(false));
    }
  }, [loaded]);
  return <motion.div ref={ref} exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }} transition={{ duration: reduced ? 0 : DURATION.ui, ease: EASING }} className={`min-w-0 ${className ?? ""}`}>
    <button type="button" onClick={event => { stop(); onOpen(project, event.currentTarget); }}
      onPointerEnter={event => { if (event.pointerType !== "mouse" || reduced || !project.previewSrc || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return; hovered.current = true; setLoaded(true); play(); }}
      onPointerLeave={stop} onBlur={stop}
      aria-label={`Watch ${project.title}`} aria-haspopup="dialog" className="group block h-full w-full overflow-hidden rounded-md border border-hairline bg-surface-1 text-left">
      <span className="relative block aspect-video overflow-hidden">
        <span className="absolute inset-0 flex items-end justify-start p-4 text-left transition-transform duration-ui motion-safe:group-hover:scale-105 motion-reduce:transition-none" style={{ background: project.gradient }}>
          {project.poster ? <Image src={project.poster} alt={project.title} fill sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1247px) 50vw, 600px" className="object-cover" /> : <span className="max-w-xs text-sm font-semibold lg:text-lg leading-tight tracking-heading text-text/80">{project.title}</span>}
        </span>
        {loaded && project.previewSrc && <video ref={video} src={project.previewSrc} muted loop playsInline preload="metadata" onLoadedData={play} onError={stop} aria-hidden="true" tabIndex={-1} className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-ui ${playing ? "opacity-100" : "opacity-0"}`} />}
        <span className="absolute right-2 top-2 rounded-md border border-hairline bg-bg/80 px-2 py-2 font-mono text-xs">{project.duration}</span>
        <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-text/30 bg-bg/70"><Play size={20} className="fill-current" /></span></span>
      </span>
      <span className="flex items-center justify-between gap-4 p-4">
        <span className="min-w-0"><span className="block text-base font-medium leading-snug">{project.title}</span><span className="mt-2 block text-xs leading-relaxed text-muted">{project.typeLabel} · {project.tags.filter(tag => tag !== project.typeLabel).join(" · ")} · {project.year}</span></span>
        <ArrowUpRight aria-hidden="true" size={22} className="shrink-0 transition-transform duration-ui group-hover:text-accent motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:translate-x-2 motion-reduce:transition-none" />
      </span>
    </button>
  </motion.div>;
});
export default ProjectCard;
