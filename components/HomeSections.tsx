"use client";

import { useRef } from "react";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import { type ShowreelHandle, type ShowreelSource } from "@/components/ShowreelPlayer";
import { showreel } from "@/data/site";
import type { Project } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Props {
  portraits: { primary: boolean; secondary: boolean };
  video: ShowreelSource;
  projects: Project[];
}

// A shared imperative ref preserves the player's lazy-load and play behavior.
export default function HomeSections({ portraits, video, projects }: Props) {
  const player = useRef<ShowreelHandle>(null);
  const reduced = useReducedMotion();
  const watchShowreel = () => {
    const target = document.getElementById(showreel.id);
    target?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    target?.focus({ preventScroll: true });
    player.current?.play();
  };
  return <><Hero portraits={portraits} onWatchShowreel={watchShowreel} /><Work projects={projects} showreelVideo={video} showreelRef={player} /></>;
}
