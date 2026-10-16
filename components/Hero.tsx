"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import Image from "next/image";
import { useRef } from "react";
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
  const missing = { primary: !portraits.primary, secondary: !portraits.secondary };

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
            <dl className="my-6 grid grid-cols-3 divide-x divide-hairline">
              {hero.stats.map((stat) => <div key={stat.label} className="flex flex-col px-4 first:pl-0 last:pr-0"><dt className="order-2 font-mono text-[10px] uppercase leading-relaxed tracking-wide text-muted sm:text-xs">{stat.label}</dt><dd className="mb-2 mt-2 text-2xl font-semibold italic sm:text-3xl">{stat.value}</dd></div>)}
            </dl>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">{hero.skillsLabel}</h2>
            <ul className="flex flex-wrap gap-2">
              {hero.skills.map((skill) => <li key={skill} className="rounded-md border border-[color-mix(in_srgb,var(--text)_20%,transparent)] bg-gradient-to-b from-surface-1 to-bg px-4 py-2 text-xs hover:border-accent">{skill}</li>)}
            </ul>
          </div>
          <motion.div style={{ y: reduced ? 0 : portraitY }} className="order-2 relative mx-auto w-full max-w-[400px] pb-16 pr-6 lg:order-1">
            <div className="relative">
              <div className="relative -rotate-2 border border-hairline bg-surface-1 px-8 py-4 shadow-2xl">
                {["left-2", "right-2"].map((edge) => (
                  <div key={edge} aria-hidden="true" className={`absolute inset-y-4 ${edge} flex w-4 flex-col justify-between gap-2`}>
                    {SPROCKETS.map((hole) => <span key={hole} className="h-4 w-full rounded-[3px] border border-hairline bg-bg" />)}
                  </div>
                ))}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-surface-2 via-bg to-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                  {!missing.primary && <Image src={hero.portraits.primary.src} alt={hero.portraits.primary.alt} fill sizes="(min-width: 640px) 312px, calc(100vw - 136px)" priority className="object-cover" />}
                  <span aria-hidden="true" className="absolute right-4 top-8 max-w-[7rem] -rotate-6 font-handwriting text-3xl leading-tight text-muted">{hero.signature}</span>
                </div>
              </div>
              <div className="absolute -right-2 bottom-0 w-[46%] translate-y-1/3 rotate-[-8deg] border border-hairline bg-surface-1 p-4 shadow-2xl">
                <span aria-hidden="true" className="absolute -top-2 left-1/4 z-10 h-6 w-3/4 rotate-6 border border-hairline bg-[color-mix(in_srgb,var(--text)_12%,transparent)]" />
                <div className="relative aspect-square overflow-hidden bg-gradient-to-tr from-bg via-surface-2 to-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                  {!missing.secondary && <Image src={hero.portraits.secondary.src} alt={hero.portraits.secondary.alt} fill sizes="(min-width: 640px) 141px, 35vw" className="object-cover grayscale" />}
                </div>
              </div>
            </div>
            <p className="absolute bottom-0 left-6 font-mono text-xs uppercase leading-relaxed tracking-wide text-muted">{hero.caption.map((line) => <span key={line} className="block">{line}</span>)}</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
