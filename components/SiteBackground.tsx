"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cubicBezier } from "motion/react";
import { EASING, REDUCED_MOTION_QUERY } from "@/lib/motion";

// All background tuning lives here. Sizes use viewport units with pixel caps.
const COLORS = { base: "var(--bg)", aurora: "var(--accent-rgb)", light: [199, 201, 255] } as const;
const AURORA = {
  primary: { width: "min(1000px, 80vw)", height: "min(900px, 100vh)", x: "30%", y: "22%", alpha: 0.16, duration: 26 },
  secondary: { width: "min(700px, 60vw)", height: "min(700px, 80vh)", x: "65%", y: "78%", alpha: 0.10, duration: 34 },
  mobile: { width: "90vw", height: "70vh", x: "50%", y: "15%" },
  falloff: "75%", driftX: "3%", driftY: "-2%",
} as const;
const BEAM = {
  width: 0.9, mobileWidth: 0.85, height: 0.45, maxHeight: 0.3,
  x: 0.5, y: 0.45, angle: -18, sweep: 6, travel: 0.02, duration: 40, alpha: 0.09,
  crossStart: "12%", crossEnd: "88%", fadeStart: "5%", solidStart: "20%", solidEnd: "55%", fadeEnd: "95%",
  easing: [0.42, 0, 0.58, 1],
} as const;
const DUST = {
  desktopCount: 40, mobileCount: 16, sizeMin: 0.5, sizeMax: 1.5,
  speedMin: 3, speedMax: 9, wander: 8, wanderSpeed: 0.25,
  dimAlpha: 0.025, litAlpha: 0.18, edgeFade: 0.08,
  beamWidthFalloff: 0.38, beamLengthFalloff: 0.45, maxDelta: 0.05,
} as const;
const STREAK = { alpha: 0.05, height: "1px", width: "90vw", x: "50%", y: "43%", fadeStart: "5%", center: "50%", fadeEnd: "95%" } as const;
const VIGNETTE = { clear: "35%", alpha: 0.35 } as const;
const PARALLAX = 12;
const MOBILE_QUERY = "(max-width: 767px)";
const FINE_QUERY = "(hover: hover) and (pointer: fine)";
const FULL_TURN = Math.PI * 2;
const sweepEase = cubicBezier(...BEAM.easing);

type Particle = { x: number; y: number; size: number; speed: number; phase: number };

const tuning = {
  "--site-base": COLORS.base, "--site-aurora-rgb": COLORS.aurora, "--site-light-rgb": COLORS.light.join(" "),
  "--site-primary-width": AURORA.primary.width, "--site-primary-height": AURORA.primary.height,
  "--site-primary-x": AURORA.primary.x, "--site-primary-y": AURORA.primary.y,
  "--site-primary-alpha": AURORA.primary.alpha, "--site-primary-duration": `${AURORA.primary.duration}s`,
  "--site-secondary-width": AURORA.secondary.width, "--site-secondary-height": AURORA.secondary.height,
  "--site-secondary-x": AURORA.secondary.x, "--site-secondary-y": AURORA.secondary.y,
  "--site-secondary-alpha": AURORA.secondary.alpha, "--site-secondary-duration": `${AURORA.secondary.duration}s`,
  "--site-mobile-width": AURORA.mobile.width, "--site-mobile-height": AURORA.mobile.height,
  "--site-mobile-x": AURORA.mobile.x, "--site-mobile-y": AURORA.mobile.y,
  "--site-aurora-falloff": AURORA.falloff, "--site-drift-x": AURORA.driftX, "--site-drift-y": AURORA.driftY,
  "--site-ease": `cubic-bezier(${EASING.join(",")})`,
  "--site-beam-width": `${BEAM.width * 100}vw`, "--site-beam-mobile-width": `${BEAM.mobileWidth * 100}vw`,
  "--site-beam-height": `min(${BEAM.height * 100}vh, ${BEAM.maxHeight * 100}vw)`,
  "--site-beam-x": `${BEAM.x * 100}%`, "--site-beam-y": `${BEAM.y * 100}%`,
  "--site-beam-angle": `${BEAM.angle}deg`, "--site-beam-sweep-angle": `${BEAM.angle + BEAM.sweep}deg`,
  "--site-beam-travel": `${BEAM.travel * 100}vh`, "--site-beam-duration": `${BEAM.duration}s`,
  "--site-beam-alpha": BEAM.alpha, "--site-beam-ease": `cubic-bezier(${BEAM.easing.join(",")})`,
  "--site-beam-cross-start": BEAM.crossStart, "--site-beam-cross-end": BEAM.crossEnd,
  "--site-beam-fade-start": BEAM.fadeStart, "--site-beam-solid-start": BEAM.solidStart,
  "--site-beam-solid-end": BEAM.solidEnd, "--site-beam-fade-end": BEAM.fadeEnd,
  "--site-streak-alpha": STREAK.alpha, "--site-streak-height": STREAK.height, "--site-streak-width": STREAK.width,
  "--site-streak-x": STREAK.x, "--site-streak-y": STREAK.y, "--site-streak-start": STREAK.fadeStart,
  "--site-streak-center": STREAK.center, "--site-streak-end": STREAK.fadeEnd,
  "--site-vignette-clear": VIGNETTE.clear, "--site-vignette-alpha": VIGNETTE.alpha,
} as CSSProperties;

export default function SiteBackground() {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const root = layer.current, surface = canvas.current;
    if (!root || !surface) return;
    const context = surface.getContext("2d");
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const mobile = window.matchMedia(MOBILE_QUERY);
    const fine = window.matchMedia(FINE_QUERY);
    let width = 0, height = 0, frame = 0, last = 0;
    let time = 0;
    let particles: Particle[] = [];
    let pointer = { x: 0, y: 0 };
    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const resetPointer = () => {
      pointer = { x: 0, y: 0 };
      root.style.removeProperty("--site-pointer-x"); root.style.removeProperty("--site-pointer-y");
    };
    const paint = (moving: boolean, delta: number) => {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      const phase = time / BEAM.duration % 1;
      const sweep = moving && !mobile.matches ? sweepEase(phase < 0.5 ? phase * 2 : (1 - phase) * 2) : 0;
      const angle = (BEAM.angle + BEAM.sweep * sweep) * Math.PI / 180;
      const beamWidth = width * (mobile.matches ? BEAM.mobileWidth : BEAM.width);
      const beamHeight = Math.min(height * BEAM.height, width * BEAM.maxHeight);
      for (const particle of particles) {
        if (moving) { particle.y -= particle.speed * delta; if (particle.y < 0) particle.y += height; }
        const x = particle.x + Math.sin(time * DUST.wanderSpeed + particle.phase) * DUST.wander;
        const dx = x - width * BEAM.x, dy = particle.y - height * (BEAM.y + BEAM.travel * sweep);
        const along = dx * Math.cos(angle) + dy * Math.sin(angle);
        const across = -dx * Math.sin(angle) + dy * Math.cos(angle);
        const light = Math.max(0, 1 - Math.abs(across) / (beamHeight * DUST.beamWidthFalloff)) * Math.max(0, 1 - Math.abs(along) / (beamWidth * DUST.beamLengthFalloff));
        const edge = Math.min(1, Math.max(0, Math.min(particle.y, height - particle.y) / (height * DUST.edgeFade)));
        context.fillStyle = `rgba(${COLORS.light.join(",")}, ${(DUST.dimAlpha + DUST.litAlpha * light) * edge})`;
        context.beginPath(); context.arc(x, particle.y, particle.size / 2, 0, FULL_TURN); context.fill();
      }
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(render); };
    function render(now: number) {
      frame = 0;
      const delta = last ? Math.min((now - last) / 1000, DUST.maxDelta) : 0;
      last = now;
      if (!reduced.matches) time += delta;
      root!.style.setProperty("--site-pointer-x", `${pointer.x}px`);
      root!.style.setProperty("--site-pointer-y", `${pointer.y}px`);
      try { paint(!reduced.matches, delta); } catch { stop(); return; }
      if (context && !reduced.matches) schedule();
    }
    const move = (event: PointerEvent) => {
      if (!fine.matches || mobile.matches || reduced.matches || event.pointerType !== "mouse" || document.hidden) return;
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      pointer = { x: -clamp(event.clientX / width * 2 - 1) * PARALLAX, y: -clamp(event.clientY / height * 2 - 1) * PARALLAX };
      schedule();
    };
    const configure = () => {
      stop(); resetPointer();
      width = window.innerWidth; height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: mobile.matches ? DUST.mobileCount : DUST.desktopCount }, () => ({ x: random(DUST.wander, Math.max(DUST.wander, width - DUST.wander)), y: random(0, height), size: random(DUST.sizeMin, DUST.sizeMax), speed: random(DUST.speedMin, DUST.speedMax), phase: random(0, FULL_TURN) }));
      paint(false, 0);
      if (!reduced.matches && context) schedule();
    };
    const visibility = () => { if (document.hidden) { stop(); resetPointer(); } else if (!reduced.matches) schedule(); };
    configure();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", configure);
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibility);
    [reduced, mobile, fine].forEach(query => query.addEventListener("change", configure));
    return () => {
      stop(); resetPointer();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", configure);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", visibility);
      [reduced, mobile, fine].forEach(query => query.removeEventListener("change", configure));
    };
  }, []);

  return <div ref={layer} aria-hidden="true" className="site-background pointer-events-none fixed inset-0 -z-[1]" style={tuning}>
    <div className="site-aurora-position site-aurora-position-primary"><div className="site-aurora site-aurora-primary" /></div>
    <div className="site-aurora-position site-aurora-position-secondary"><div className="site-aurora site-aurora-secondary" /></div>
    <div className="site-beam-position"><div className="site-projector-beam" /></div>
    <canvas ref={canvas} className="site-dust absolute inset-0 h-full w-full" />
    <div className="site-lens-streak" />
    <div className="site-vignette absolute inset-0" />
  </div>;
}
