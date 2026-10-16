"use client";

import { m as motion } from "motion/react";
import { fadeUp } from "@/lib/motion";
import { ArrowUp, Instagram, Linkedin } from "lucide-react";
import { footer, hero, navigation } from "@/data/site";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

const socialIcons = {
  Instagram, LinkedIn: Linkedin,
  Behance: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 5h5a3 3 0 0 1 0 6H3zm0 6h5a4 4 0 0 1 0 8H3zM16 6h5M15 14h7c0-6-8-6-8 0s7 6 8 2" /></svg>,
  X: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 3h4l12 18h-4zM20 3 4 21" /></svg>,
};
export default function Footer() {
  return <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="border-t border-hairline">
    <div className="content-shell flex flex-col gap-8 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between">
      <div><p className="text-sm"><span className="font-bold">{footer.wordmark}</span>{" "}<span className="font-mono text-muted">{footer.wordmarkSuffix}</span></p><p className="mt-2 text-xs text-muted">{footer.tagline}</p><p className="mt-2 font-mono text-xs text-muted">{footer.motto}</p></div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 sm:gap-8">{navigation.map(link => <a key={link.href} href={link.href} className="font-mono text-xs uppercase text-muted  hover:text-text">{link.label}</a>)}</nav>
      <div className="flex items-center gap-6 min-[1100px]:border-l min-[1100px]:border-hairline min-[1100px]:pl-8">{footer.socials.map(social => { const Icon = socialIcons[social.name]; return <a key={social.name} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="rounded-md p-2 text-muted  hover:text-text"><Icon size={20} aria-hidden="true" /></a>; })}{footer.comingSoonSocials.map(social => { const Icon = socialIcons[social.name]; return <span key={social.name} role="img" aria-label={social.label} title={social.label} className="rounded-md p-2 text-muted"><Icon /></span>; })}</div>
    </div>
    <div className="border-t border-hairline"><div className="content-shell flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between"><p className="text-muted">© {new Date().getFullYear()} {footer.copyright}</p><a href={`#${hero.id}`} onClick={event => { event.preventDefault(); event.stopPropagation(); document.getElementById(hero.id)?.scrollIntoView({ behavior: window.matchMedia(REDUCED_MOTION_QUERY).matches ? "instant" : "smooth" }); }} className="inline-flex items-center gap-2 self-start">{footer.backToTop}<ArrowUp size={14} aria-hidden="true" /></a></div></div>
  </motion.footer>;
}
