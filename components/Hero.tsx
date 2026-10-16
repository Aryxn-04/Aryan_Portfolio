"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { DURATION, EASING } from "@/lib/motion";
import { hero } from "@/data/site";
import ShowreelPlayer, { type ShowreelHandle } from "@/components/ShowreelPlayer";

const COUNT_DURATION = 800;
const MAGNET_DISTANCE = 8;
const SEQUENCE = { badge: 0, headline: 0.08, line: 0.08, copy: 0.32, player: 0.44, stats: 0.56 };
export default function Hero() {
  const reduced = useReducedMotion();
  const player = useRef<ShowreelHandle>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const inView = useInView(statsRef, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) { setCount(1); return; }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => { const progress = Math.min((now - start) / COUNT_DURATION, 1); setCount(progress); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced]);
  const reveal = (delay: number) => ({ initial: reduced ? false as const : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : DURATION.ui, delay: reduced ? 0 : delay, ease: EASING } });
  const magnetic = {
    onPointerMove: (event: React.PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (reduced || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.transform = `translate(${((event.clientX - bounds.left) / bounds.width * 2 - 1) * MAGNET_DISTANCE}px, ${((event.clientY - bounds.top) / bounds.height * 2 - 1) * MAGNET_DISTANCE}px)`;
    },
    onPointerLeave: (event: React.PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => { event.currentTarget.style.transform = ""; },
  };
  return <section id="hero" aria-labelledby="hero-heading" className="relative isolate overflow-hidden pb-12 pt-12 min-[900px]:pb-8 min-[900px]:pt-16">
    <style>{`@keyframes hero-glow-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(8%, -6%); } } @media (prefers-reduced-motion: no-preference) { .hero-glow { animation: hero-glow-drift 20s cubic-bezier(0.22,1,0.36,1) infinite; } }`}</style>
    <div aria-hidden="true" className="hero-glow pointer-events-none absolute -left-1/4 top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.14),transparent_60%)]" />
    <div className="content-shell grid items-center gap-10 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-8">
      <div className="relative py-4 min-[900px]:py-10">
        <motion.div {...reveal(SEQUENCE.badge)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1/60 px-4 py-2 text-[11px] text-muted sm:text-xs"><span className="h-2 w-2 rounded-full bg-[#00dd88] motion-safe:animate-pulse" />{hero.availability}</motion.div>
        <h1 id="hero-heading" className="mb-4 text-[clamp(2.25rem,2.8vw,2.75rem)] font-semibold leading-[1.12] tracking-heading">{hero.headline.map((line, index) => <span key={line} className="block overflow-hidden"><motion.span {...reveal(SEQUENCE.headline + index * SEQUENCE.line)} className="block">{line}</motion.span></span>)}</h1>
        <motion.div {...reveal(SEQUENCE.copy)}>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">{hero.description}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a {...magnetic} href="#work" className="group relative inline-flex items-center gap-4 overflow-hidden rounded-lg bg-accent px-6 py-4 text-sm font-medium transition-transform motion-reduce:transition-none"><span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-text/20 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden" />{hero.work}<ArrowRight size={18} /></a>
            <button {...magnetic} onClick={() => { document.getElementById("showreel")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" }); player.current?.play(); }} className="inline-flex items-center gap-4 rounded-lg border border-hairline px-6 py-4 text-sm font-medium transition-transform motion-reduce:transition-none">{hero.watch}<Play size={16} className="fill-current" /></button>
          </div>
        </motion.div>
        <motion.dl ref={statsRef} {...reveal(SEQUENCE.stats)} className="mt-10 grid grid-cols-3 gap-4">{hero.stats.map(stat => <div key={stat.label} className="flex flex-col border-l border-hairline pl-4 first:border-0 first:pl-0"><dt className="text-[11px] text-muted sm:text-sm">{stat.label}</dt><dd aria-label={`${stat.value}${stat.suffix} ${stat.label}`} className="-order-1 mb-2 text-2xl font-semibold sm:text-3xl"><span aria-hidden="true">{Math.round(stat.value * count)}{stat.suffix}</span></dd></div>)}</motion.dl>
      </div>
      <motion.div initial={reduced ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : DURATION.reveal, delay: reduced ? 0 : SEQUENCE.player, ease: EASING }}><ShowreelPlayer ref={player} {...hero.video} /></motion.div>
    </div>
    <div aria-hidden="true" className="mt-12 flex flex-col items-center gap-4 text-muted"><ArrowDown size={20} /><span className="font-mono text-[9px] uppercase tracking-[0.2em]">{hero.scroll}</span></div>
  </section>;
}
