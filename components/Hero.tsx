"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { m as motion, useScroll, useTransform } from "motion/react";
import { hero } from "@/data/site";
import { fadeUp } from "@/lib/motion";

const PARALLAX_DISTANCE = 12;
const SPROCKETS = Array.from({ length: 16 }, (_, index) => index);

export default function Hero({ portraits = { primary: false, secondary: false }, onWatchShowreel }: { portraits?: { primary: boolean; secondary: boolean }; onWatchShowreel: () => void }) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [PARALLAX_DISTANCE, -PARALLAX_DISTANCE]);
  const [failed, setFailed] = useState({ primary: false, secondary: false });
  const missing = { primary: !portraits.primary || failed.primary, secondary: !portraits.secondary || failed.secondary };

  return (
    <motion.section ref={section} id={hero.id} aria-labelledby="home-heading" variants={fadeUp} initial={reduced ? false : "hidden"} animate="visible" className="relative flex min-h-[calc(100svh-var(--nav-height))] items-center py-8 lg:py-0">
      <div className="content-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="order-1 min-w-0 lg:order-2">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1/60 px-4 py-2 text-[11px] text-muted"><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#00dd88]" />{hero.availability}</span>
              <p className="font-mono text-xs uppercase text-muted">{hero.eyebrow}</p>
            </div>
            <h1 id="home-heading" className="text-4xl font-semibold tracking-heading sm:text-5xl">{hero.heading}</h1>
            <p className="mt-4 text-2xl leading-snug tracking-tight text-muted">{hero.intro}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{hero.bio}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="#work" className="inline-flex items-center gap-4 rounded-lg bg-accent-action px-6 py-4 text-sm font-medium">{hero.work}<ArrowRight aria-hidden="true" size={18} /></a>
              <button type="button" onClick={onWatchShowreel} className="inline-flex items-center gap-4 rounded-lg border border-hairline px-6 py-4 text-sm font-medium">{hero.watch}<Play aria-hidden="true" size={16} className="fill-current" /></button>
              <a href={hero.resume.href} download className="py-2 text-xs text-muted hover:text-text">{hero.resume.label}</a>
            </div>
            <dl className="my-6 grid grid-cols-2 divide-x divide-hairline">
              {hero.stats.map((stat) => <div key={stat.label} className="flex flex-col px-4 first:pl-0 last:pr-0"><dt className="order-2 font-mono text-[10px] uppercase leading-relaxed tracking-wide text-muted sm:text-xs">{stat.label}</dt><dd className="mb-2 mt-2 text-2xl font-semibold italic sm:text-3xl">{stat.value}</dd></div>)}
            </dl>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{hero.skillsLabel}</h2>
            <ul className="flex flex-wrap gap-2">
              {hero.skills.map((skill) => <li key={skill} className="rounded-md border border-[color-mix(in_srgb,var(--text)_20%,transparent)] bg-gradient-to-b from-surface-1 to-bg px-4 py-2 text-xs hover:border-accent">{skill}</li>)}
            </ul>
          </div>
          <motion.div style={{ y: reduced ? 0 : portraitY }} className="order-2 relative mx-auto w-full max-w-[400px] pb-16 pr-6 lg:order-1">
            <span aria-hidden="true" className="absolute -top-12 left-0 max-w-full -rotate-6 font-handwriting text-2xl leading-tight text-muted">{hero.signature}</span>
            <div className="relative">
              <div className="relative -rotate-2 border border-hairline bg-surface-1 px-8 py-4 shadow-2xl">
                {["left-2", "right-2"].map((edge) => (
                  <div key={edge} aria-hidden="true" className={`absolute inset-y-4 ${edge} flex w-4 flex-col justify-between gap-2`}>
                    {SPROCKETS.map((hole) => <span key={hole} className="h-4 w-full rounded-[3px] border border-hairline bg-bg" />)}
                  </div>
                ))}
                <div className="hero-portrait-window relative isolate aspect-[4/5] overflow-hidden bg-gradient-to-br from-surface-2 via-bg to-[color-mix(in_srgb,var(--accent)_20%,transparent)] shadow-2xl">
                  {missing.primary ? <span className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-muted">{hero.portraitInitials}</span> : <>
                    <Image src={hero.portraits.primary.src} alt={hero.portraits.primary.alt} fill sizes="(min-width: 1024px) 480px, 90vw" priority className="object-cover" style={{ objectPosition: hero.portraits.primary.position }} onError={() => setFailed(value => ({ ...value, primary: true }))} />
                    <span aria-hidden="true" className="hero-portrait-tint pointer-events-none absolute inset-0 bg-accent mix-blend-soft-light" />
                    <span aria-hidden="true" className="hero-portrait-fade pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent" />
                  </>}
                  <span aria-hidden="true" className="hero-portrait-border pointer-events-none absolute inset-0 rounded-[inherit] border" />
                </div>
              </div>
              {!missing.secondary && <div className="absolute -right-2 bottom-0 w-[46%] translate-y-1/3">
                <div className="hero-monogram-card relative border border-hairline bg-surface-1 p-4 shadow-2xl">
                  <span aria-hidden="true" className="absolute -top-2 left-1/4 z-10 h-6 w-3/4 rotate-6 border border-hairline bg-[color-mix(in_srgb,var(--text)_12%,transparent)]" />
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={hero.portraits.secondary.src} alt={hero.portraits.secondary.alt} fill sizes="(min-width: 1024px) 141px, (min-width: 448px) 141px, 35vw" className="object-cover" style={{ objectPosition: hero.portraits.secondary.position }} onError={() => setFailed(value => ({ ...value, secondary: true }))} />
                  </div>
                </div>
              </div>}
            </div>
            <p className="absolute bottom-0 left-6 font-mono text-xs uppercase leading-relaxed tracking-wide text-muted">{hero.caption.map((line) => <span key={line} className="block">{line}</span>)}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
