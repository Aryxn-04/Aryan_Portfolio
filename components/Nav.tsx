"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { m as motion } from "motion/react";
import { hero, navigation } from "@/data/site";

const SCROLL_THRESHOLD = 80;
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const menu = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    let previous = window.scrollY;
    const scroll = () => { const next = window.scrollY; setHidden(next > previous && next > SCROLL_THRESHOLD); previous = next; };
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(`#${entry.target.id}`); });
    }, { rootMargin: "-20% 0px -50% 0px" });
    navigation.forEach(link => { const el = document.querySelector(link.href); if (el) observer.observe(el); });
    return () => { window.removeEventListener("scroll", scroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menu.current?.focus(); }
      if (event.key === "Tab") {
        const links = panel.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menu.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === links[links.length - 1]) { event.preventDefault(); menu.current?.focus(); }
        else if (document.activeElement === menu.current) { event.preventDefault(); links[event.shiftKey ? links.length - 1 : 0].focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", key); };
  }, [open]);
  return <motion.header onFocusCapture={() => setHidden(false)} onClick={event => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor?.hash) return;
    const target = document.getElementById(anchor.hash.slice(1));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }); history.replaceState(null, "", anchor.hash); }
  }} initial={{ opacity: 0 }} animate={{ opacity: 1, y: hidden && !open ? "-100%" : 0 }} transition={reduced ? { duration: 0 } : undefined} className="sticky top-0 z-50 border-b border-hairline bg-[rgb(11_11_13/0.7)] backdrop-blur-xl">
    <nav aria-label="Main navigation" className="content-shell flex h-[80px] items-center justify-between gap-6">
      <a href="#hero" className="text-xs font-semibold tracking-[0.3em]">{hero.wordmark}</a>
      <div className="hidden items-center gap-10 min-[900px]:flex">{navigation.map(link => <a key={link.href} href={link.href} aria-current={active === link.href ? "location" : undefined} className={`relative py-2 text-sm hover:text-text ${active === link.href ? "text-text after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-accent" : "text-muted"}`}>{link.label}</a>)}</div>
      <a href="#contact" className="hidden rounded-full bg-accent-action px-6 py-2 text-sm min-[900px]:block">{hero.talk}</a>
      <button ref={menu} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="p-2 min-[900px]:hidden">{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <div ref={panel} id="mobile-navigation" className="fixed inset-x-0 top-[80px] flex h-[calc(100dvh-5rem)] flex-col items-center justify-center gap-8 bg-bg min-[900px]:hidden" data-lenis-prevent>{navigation.map(link => <a className="text-3xl" key={link.href} href={link.href} onClick={() => { setOpen(false); menu.current?.focus(); }}>{link.label}</a>)}<a href="#contact" onClick={() => setOpen(false)} className="rounded-full bg-accent-action px-8 py-4">{hero.talk}</a></div>}
  </motion.header>;
}
