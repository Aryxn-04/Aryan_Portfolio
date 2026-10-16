"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cubicBezier } from "motion/react";
import { DURATION, EASING, REDUCED_MOTION_QUERY } from "@/lib/motion";

// Cursor tuning. Colors resolve from the global palette; all sizes are CSS px.
const COLORS = {
  accent: "var(--accent)", core: "color-mix(in srgb, var(--text) 90%, var(--accent))",
  halo: "color-mix(in srgb, var(--accent) 35%, transparent)",
  ring: "color-mix(in srgb, var(--accent) 18%, transparent)",
  outer: "color-mix(in srgb, var(--accent) 8%, transparent)",
};
const SIZES = { core: 6, halo: 28, outer: 64, play: 56, triangle: 10, pulse: 28 };
const TAIL = { length: 24, lifetime: 180, width: 3, opacity: 0.24, minDistance: 0.3 };
const LERP = 0.18;
const HOVER = { scale: 1.6, opacity: 0.9, idleOpacity: 0.65 };
const TIMING = { ui: DURATION.ui * 1000, pulse: DURATION.ui * 1000, fade: DURATION.ui * 1000, frame: 1000 / 60 };
const EASE = EASING;
const PULSE_EASING = cubicBezier(...EASE);
const PULSE = { start: 0.5, end: 2.8, opacity: 0.45 };
const LAYER = 105; // Above content/grain; native dialog and fullscreen top layers remain above it.
const SETTLE_DISTANCE = 0.1;
const MAX_DPR = 2;
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const INPUT_SELECTOR = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";
const HOVER_SELECTOR = "button, a, [role='button'], [role='tab'], [data-cursor='hover']";
const ACTIVE_CLASS = "cursor-glow-active";
const READY_CLASS = "cursor-glow-ready";
type Point = { x: number; y: number; time: number };

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const core = useRef<HTMLSpanElement>(null);
  const halo = useRef<HTMLSpanElement>(null);
  const pulse = useRef<HTMLSpanElement>(null);

  // No media queries or browser-dependent markup during SSR/initial hydration.
  useEffect(() => {
    const fine = window.matchMedia(POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => { fine.removeEventListener("change", sync); reduced.removeEventListener("change", sync); };
  }, []);

  useEffect(() => {
    if (!enabled || !layer.current || !canvas.current || !core.current || !halo.current || !pulse.current) return;
    const root = document.documentElement;
    const overlay = layer.current;
    const surface = canvas.current;
    const dot = core.current;
    const glow = halo.current;
    const ripple = pulse.current;
    const drawingContext = surface.getContext("2d");
    if (!drawingContext) return; // Native cursor stays intact if canvas is unavailable.
    const context: CanvasRenderingContext2D = drawingContext;
    let frame = 0;
    let lastFrame = 0;
    let x = 0, y = 0, hx = 0, hy = 0;
    let positioned = false;
    let visible = false;
    let opacity = 0;
    let pulseStart = -Infinity;
    let pulseX = 0, pulseY = 0;
    let points: Point[] = [];
    let disposed = false;
    const accent = getComputedStyle(root).getPropertyValue("--accent-rgb").trim().split(/\s+/).join(", ");
    const translate = (px: number, py: number, scale = 1) => `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${scale})`;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; };
    const release = () => { visible = false; root.classList.remove(ACTIVE_CLASS); };
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      surface.width = Math.round(window.innerWidth * ratio);
      surface.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = [];
    };
    const schedule = () => { if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw); };
    function draw(now: number) {
      frame = 0;
      try {
        const elapsed = lastFrame ? Math.min(now - lastFrame, TIMING.frame * 4) : TIMING.frame;
        lastFrame = now;
        const smoothing = 1 - Math.pow(1 - LERP, elapsed / TIMING.frame);
        hx += (x - hx) * smoothing;
        hy += (y - hy) * smoothing;
        opacity += Math.sign((visible ? 1 : 0) - opacity) * Math.min(Math.abs((visible ? 1 : 0) - opacity), elapsed / TIMING.fade);
        overlay.style.opacity = String(opacity);
        dot.style.transform = translate(x, y);
        glow.style.transform = translate(hx, hy);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        points = points.filter(point => now - point.time < TAIL.lifetime);
        context.globalCompositeOperation = "lighter";
        context.lineCap = "round";
        for (let index = 1; index < points.length; index++) {
          const from = points[index - 1], to = points[index];
          const taper = index / (points.length - 1);
          const alpha = TAIL.opacity * taper * Math.max(0, 1 - (now - to.time) / TAIL.lifetime);
          const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);
          gradient.addColorStop(0, `rgba(${accent}, ${alpha * taper})`);
          gradient.addColorStop(1, `rgba(${accent}, ${alpha})`);
          context.strokeStyle = gradient;
          context.lineWidth = TAIL.width * taper;
          context.beginPath(); context.moveTo(from.x, from.y); context.lineTo(to.x, to.y); context.stroke();
        }
        const progress = Math.min(1, (now - pulseStart) / TIMING.pulse);
        const eased = PULSE_EASING(progress);
        ripple.style.transform = translate(pulseX, pulseY, PULSE.start + (PULSE.end - PULSE.start) * eased);
        ripple.style.opacity = String(PULSE.opacity * (1 - progress));
        if (points.length || progress < 1 || Math.abs(x - hx) + Math.abs(y - hy) > SETTLE_DISTANCE || opacity !== (visible ? 1 : 0)) schedule();
      } catch {
        release(); stop(); overlay.style.opacity = "0"; root.classList.remove(READY_CLASS); disposed = true;
      }
    }
    const mode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      if (!element || element.closest(INPUT_SELECTOR) || document.querySelector("dialog[open]") || document.fullscreenElement) {
        release(); points = []; opacity = 0; overlay.style.opacity = "0"; schedule(); return false;
      }
      const play = element.closest("[data-cursor='play']");
      overlay.dataset.mode = play ? "play" : element.closest(HOVER_SELECTOR) ? "hover" : "idle";
      visible = true;
      if (!disposed) root.classList.add(ACTIVE_CLASS);
      schedule(); return true;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || disposed) return;
      x = event.clientX; y = event.clientY;
      if (!positioned) { hx = x; hy = y; positioned = true; }
      if (!mode(event.target)) return;
      const previous = points[points.length - 1];
      if (!previous || Math.hypot(x - previous.x, y - previous.y) >= TAIL.minDistance) {
        points.push({ x, y, time: performance.now() });
        if (points.length > TAIL.length) points.shift();
      }
      schedule();
    };
    const leave = () => { release(); points = []; schedule(); };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !mode(event.target)) return;
      pulseX = event.clientX; pulseY = event.clientY; pulseStart = performance.now(); schedule();
    };
    const keyboard = () => { leave(); }; // Never hide a keyboard user's native cursor.
    const visibility = () => {
      if (document.hidden) { release(); stop(); points = []; opacity = 0; overlay.style.opacity = "0"; }
    };
    const refreshTarget = () => {
      if (positioned && visible) mode(document.elementFromPoint(x, y));
    };
    const observer = new MutationObserver(refreshTarget);
    resize();
    root.classList.add(READY_CLASS);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("keydown", keyboard);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", refreshTarget, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", leave);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    return () => {
      disposed = true; stop(); root.classList.remove(ACTIVE_CLASS, READY_CLASS);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("keydown", keyboard);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", refreshTarget);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("fullscreenchange", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  const tuning = {
    "--cursor-accent": COLORS.accent, "--cursor-core": COLORS.core,
    "--cursor-halo-color": COLORS.halo, "--cursor-ring-color": COLORS.ring, "--cursor-outer-color": COLORS.outer,
    "--cursor-dot": `${SIZES.core}px`, "--cursor-halo": `${SIZES.halo}px`,
    "--cursor-outer": `${SIZES.outer}px`, "--cursor-play": SIZES.play / SIZES.halo,
    "--cursor-triangle": `${SIZES.triangle}px`, "--cursor-pulse": `${SIZES.pulse}px`,
    "--cursor-hover": HOVER.scale, "--cursor-opacity": HOVER.idleOpacity,
    "--cursor-hover-opacity": HOVER.opacity, "--cursor-duration": `${TIMING.ui}ms`,
    "--cursor-ease": `cubic-bezier(${EASE.join(",")})`, zIndex: LAYER,
  } as CSSProperties;
  return <div ref={layer} aria-hidden="true" className="cursor-glow" style={tuning}>
    <canvas ref={canvas} className="cursor-glow-canvas" />
    <span ref={halo} className="cursor-glow-position"><span className="cursor-glow-halo" /><span className="cursor-glow-play" /></span>
    <span ref={core} className="cursor-glow-dot" />
    <span ref={pulse} className="cursor-glow-pulse" />
  </div>;
}
