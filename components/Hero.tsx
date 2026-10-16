"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import Image from "next/image";
import { useRef } from "react";
import { m as motion } from "motion/react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import { DURATION, EASING, MOTION } from "@/lib/motion";
import { hero } from "@/data/site";
import ShowreelPlayer, { type ShowreelHandle } from "@/components/ShowreelPlayer";

export default function Hero({ video = hero.video, portraitAvailable = false }: { video?: { src: string; poster?: string }; portraitAvailable?: boolean }) {
  const reduced = useReducedMotion();
  const player = useRef<ShowreelHandle>(null);
  return <motion.section initial={{ opacity: 1, y: MOTION.revealDistance }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : DURATION.reveal, ease: EASING }} id={hero.id} aria-labelledby="hero-heading" className="relative isolate overflow-hidden py-24">
    <div aria-hidden="true" className="hero-glow pointer-events-none absolute -left-1/4 top-0 -z-10 h-full w-full blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.20),transparent_60%)]" />
    <div className="content-shell grid items-center gap-10 min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-8">
      <div className="relative py-4 min-[900px]:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="relative flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-gradient-to-br from-surface-2 via-surface-1 to-bg text-xs font-semibold text-muted">
              {portraitAvailable ? <Image src={hero.portrait.src} alt={hero.portrait.alt} fill sizes="44px" priority className="object-cover" /> : <span aria-hidden="true">{hero.portrait.initials}</span>}
            </span>
            <div className="min-w-0"><p className="text-[15px] font-medium text-text">{hero.intro.name}</p><p className="mt-1 text-xs text-muted">{hero.intro.role}</p></div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-surface-1/60 px-2 py-2 text-[10px] text-muted"><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#00dd88]" />{hero.availability}</span>
        </div>
        <h1 id="hero-heading" className="mb-4 text-[clamp(2.25rem,2.8vw,2.75rem)] font-semibold leading-[1.12] tracking-heading">{hero.headline.map((line, index) => <span key={line} className="block overflow-hidden"><span className={index === 1 ? "block bg-gradient-to-b from-[#FFFFFF] to-[#C7C9FF] bg-clip-text text-transparent" : "block"}>{line}</span></span>)}</h1>
        <div>
          <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">{hero.description}</p>
          <div className="mt-4 hidden flex-wrap items-center gap-2 sm:flex">
            <p className="text-xs text-muted">{hero.specialtiesLabel}</p>
            <ul className="flex flex-wrap gap-2">{hero.specialties.map(specialty => <li key={specialty} className="rounded-md border border-hairline bg-surface-1 px-2 py-1 text-[11px] text-muted">{specialty}</li>)}</ul>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#work" className="group relative inline-flex items-center gap-4 overflow-hidden rounded-lg bg-accent-action px-6 py-4 text-sm font-medium transition-transform motion-reduce:transition-none">{hero.work}<ArrowRight size={18} /></a>
            <button onClick={() => { document.getElementById("showreel")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" }); player.current?.play(); }} className="inline-flex items-center gap-4 rounded-lg border border-hairline px-6 py-4 text-sm font-medium transition-transform motion-reduce:transition-none">{hero.watch}<Play size={16} className="fill-current" /></button>
            <a href={hero.resume.href} download className="py-2 text-xs text-muted hover:text-text">{hero.resume.label}</a>
          </div>
        </div>
        <dl className="mt-10 grid grid-cols-3 gap-4">{hero.stats.map(stat => <div key={stat.label} className="flex flex-col border-l border-hairline pl-4 first:border-0 first:pl-0"><dt className="text-[11px] text-muted sm:text-sm">{stat.label}</dt><dd className="-order-1 mb-2 text-2xl font-semibold sm:text-3xl"><span>{stat.value}{stat.suffix}</span></dd></div>)}</dl>
      </div>
      <div className="relative"><span aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-accent/5 blur-3xl" /><ShowreelPlayer ref={player} {...video} /></div>
    </div>
    <div aria-hidden="true" className="mt-12 flex flex-col items-center gap-4 text-muted"><ArrowDown size={20} /><span className="font-mono text-[9px] uppercase tracking-[0.2em]">{hero.scroll}</span></div>
  </motion.section>;
}
