"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { about } from "@/data/about";
import { DURATION, EASING, fadeUp, MOTION } from "@/lib/motion";

const PARALLAX_LIMIT = 12; // 24px total travel across the section.
const SPROCKETS = Array.from({ length: 16 }, (_, index) => index);
const FRAME_REVEAL = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
};
const REVEAL_TRANSITION = { duration: DURATION.reveal, ease: EASING };

export default function About() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [missing, setMissing] = useState({ primary: false, secondary: false });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [PARALLAX_LIMIT, -PARALLAX_LIMIT]);

  return (
    <motion.section ref={section} id="about" aria-labelledby="about-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="scroll-mt-24 overflow-hidden py-24 lg:py-32">
      <div className="content-shell">
        <p className="mb-8 font-mono text-sm uppercase tracking-[0.15em] text-muted">{about.label}</p>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div style={{ y: reduced ? 0 : portraitY }} className="relative mx-auto w-full max-w-lg pb-16 pr-6 lg:pb-24">
            <motion.div variants={reduced ? undefined : FRAME_REVEAL} transition={REVEAL_TRANSITION} className="relative">
              <div className="relative -rotate-2 border border-hairline bg-surface-1 px-8 py-4 shadow-2xl">
                {["left-2", "right-2"].map((edge) => (
                  <div key={edge} aria-hidden="true" className={`absolute inset-y-4 ${edge} flex w-4 flex-col justify-between gap-2`}>
                    {SPROCKETS.map((hole) => <span key={hole} className="h-4 w-full rounded-[3px] border border-hairline bg-bg" />)}
                  </div>
                ))}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-surface-2 via-bg to-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                  {!missing.primary && <Image src={about.portraits.primary.src} alt={about.portraits.primary.alt} fill sizes="(min-width: 1024px) 440px, 80vw" className="object-cover" onError={() => setMissing((value) => ({ ...value, primary: true }))} />}
                  <span aria-hidden="true" className="absolute right-4 top-8 max-w-[7rem] -rotate-6 font-handwriting text-3xl leading-tight text-muted">{about.signature}</span>
                </div>
              </div>
              <div className="absolute -right-2 bottom-0 w-[46%] translate-y-1/3 rotate-[-8deg] border border-hairline bg-surface-1 p-4 shadow-2xl">
                <span aria-hidden="true" className="absolute -top-2 left-1/4 z-10 h-6 w-3/4 rotate-6 border border-hairline bg-[color-mix(in_srgb,var(--text)_12%,transparent)]" />
                <div className="relative aspect-square overflow-hidden bg-gradient-to-tr from-bg via-surface-2 to-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
                  {!missing.secondary && <Image src={about.portraits.secondary.src} alt={about.portraits.secondary.alt} fill sizes="220px" className="object-cover grayscale" onError={() => setMissing((value) => ({ ...value, secondary: true }))} />}
                </div>
              </div>
            </motion.div>
            <p className="absolute bottom-0 left-6 font-mono text-xs uppercase leading-relaxed tracking-wide text-muted">{about.caption.map((line) => <span key={line} className="block">{line}</span>)}</p>
          </motion.div>
          <motion.div variants={reduced ? undefined : { ...fadeUp, visible: { opacity: 1, y: 0, transition: { ...REVEAL_TRANSITION, delay: DURATION.reveal + MOTION.staggerDelay } } }}>
            <p className="mb-6 font-mono text-xs uppercase text-muted">{about.eyebrow}</p>
            <h2 id="about-heading" className="text-4xl font-semibold tracking-heading sm:text-5xl xl:text-6xl">{about.heading}</h2>
            <p className="mt-4 text-2xl leading-snug tracking-tight text-muted lg:text-3xl">{about.intro}</p>
            <p className="mt-6 text-base leading-relaxed text-muted">{about.bio}</p>
            <dl className="my-8 grid grid-cols-3 divide-x divide-hairline">
              {about.stats.map((stat) => <div key={stat.label} className="flex flex-col px-4 first:pl-0 last:pr-0"><dt className="order-2 font-mono text-[10px] uppercase leading-relaxed tracking-wide text-muted sm:text-xs">{stat.label}</dt><dd className="mb-2 mt-2 text-2xl font-semibold italic sm:text-3xl">{stat.value}</dd></div>)}
            </dl>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wide text-muted">{about.skillsLabel}</h3>
            <ul className="flex flex-wrap gap-2">
              {about.skills.map((skill) => <li key={skill} className="rounded-md border border-[color-mix(in_srgb,var(--text)_20%,transparent)] bg-gradient-to-b from-surface-1 to-bg px-4 py-2 text-xs transition-colors duration-[400ms] hover:border-accent motion-reduce:transition-none sm:text-sm">{skill}</li>)}
            </ul>
            <a href={about.resume.href} download className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-md border border-[color-mix(in_srgb,var(--text)_40%,transparent)] px-6 py-4 text-sm font-medium transition-colors duration-[400ms] hover:border-accent hover:bg-surface-1 motion-reduce:transition-none">
              <Download aria-hidden="true" className="h-6 w-6 text-accent" />{about.resume.label}<ArrowUpRight aria-hidden="true" className="h-6 w-6" />
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
