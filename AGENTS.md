# Permanent project rules

## STACK
Next.js 15 App Router, TypeScript (strict), Tailwind CSS, Motion (package "motion", import from "motion/react"), Lenis for smooth scrolling, lucide-react icons. No other UI libraries.

## DESIGN TOKENS
Define these as CSS variables in app/globals.css and map them in the Tailwind config:
- bg #0B0B0D, surface-1 #141416, surface-2 #1B1B1F
- text #F5F5F7, muted #8E8E93, accent indigo #6366F1, hairline rgba(255,255,255,0.08)
- Radius 12-16px. Spacing on an 8px scale. Max content width 1200px with 24px side padding.
- Fonts via next/font: Inter (UI and headings, tight letter-spacing on headings), JetBrains Mono (timecodes and small labels), Caveat (handwritten accent, at most ONE use per section).

## CODE RULES
- Server components by default; "use client" only where state, effects or motion are needed.
- One component per file in /components.
- All content (projects, tools, process steps, stats, social links) lives in /data/*.ts, never hard-coded in JSX.
- No inline magic numbers: use tokens and constants.
- Fully accessible: semantic landmarks, visible focus rings, alt text, aria-labels on icon buttons, keyboard operable video controls.
- Every animation must respect prefers-reduced-motion.
- Mobile-first and responsive from 360px up.

## MOTION RULES
- Restrained and cinematic.
- Use ONE shared easing curve [0.22, 1, 0.36, 1] and shared durations (0.4s UI, 0.8s reveals) defined in /lib/motion.ts.
- Animate only transform and opacity.
- No bouncing, no scattered effects.
- Each section gets one orchestrated reveal, not an animation on every element.

## WORKFLOW RULES
- Work on exactly one section per task.
- Never modify files outside the task scope.
- Reference screenshots are in /reference/design/. Match them closely for layout, spacing and hierarchy.
- Preserve /reference and /public.
- Before finishing any task, run `npm run lint` and `npm run build`, fix every error, and summarize what you changed.
