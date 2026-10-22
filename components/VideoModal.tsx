"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { m as motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { type Project } from "@/data/projects";
import { DURATION, EASING } from "@/lib/motion";

interface Props { project: Project; onClose: () => void; onPrevious: () => void; onNext: () => void }
export default function VideoModal({ project, onClose, onPrevious, onNext }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    element.showModal();
    element.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { element.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  const video = project.video;
  return createPortal(<dialog ref={dialog} aria-labelledby="project-modal-title" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, video[controls], iframe, [tabindex="0"]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-bg/90 p-6 text-text backdrop:bg-transparent">
    <div className="pointer-events-none flex min-h-full items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : 0.94 }} transition={{ duration: reduced ? 0 : DURATION.ui, ease: EASING }} className="pointer-events-auto w-full max-w-5xl overflow-hidden rounded-lg border border-hairline bg-surface-1">
        <div className="flex items-center justify-between gap-4 p-4"><div><h2 id="project-modal-title" className="text-lg font-semibold">{project.title}</h2><p className="mt-2 font-mono text-xs text-muted">{project.typeLabel} · {project.year} · {project.duration}</p></div><button type="button" onClick={onClose} aria-label="Close video" className="rounded-md p-2 hover:bg-surface-2"><X /></button></div>
        <div key={project.id} className="relative aspect-video bg-bg">
          <video src={video.src} controls autoPlay playsInline preload="metadata" aria-label={project.title} className="h-full w-full" />
        </div>
        <div className="flex items-center justify-between gap-4 p-4"><button type="button" onClick={onPrevious} className="inline-flex items-center gap-2 rounded-md p-2 text-sm hover:bg-surface-2"><ArrowLeft size={18} />Previous</button><p aria-live="polite" className="sr-only">{project.title}</p><button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-md p-2 text-sm hover:bg-surface-2">Next<ArrowRight size={18} /></button></div>
      </motion.div>
    </div>
  </dialog>, document.body);
}
