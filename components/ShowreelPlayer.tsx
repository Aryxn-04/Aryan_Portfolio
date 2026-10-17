"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { playerCopy as copy } from "@/data/site";

const FPS = 30;
const HIDE_DELAY = 2500;
const SEEK_SECONDS = 5;
const LOAD_VISIBILITY = 0.25;
const compactTime = (time: number) => {
  const safe = Number.isFinite(time) ? Math.max(0, Math.floor(time)) : 0;
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
};
const timecode = (time: number) => {
  const safe = Number.isFinite(time) ? Math.max(0, time) : 0;
  return [Math.floor(safe / 3600), Math.floor(safe / 60) % 60, Math.floor(safe) % 60, Math.floor((safe % 1) * FPS)].map(n => String(n).padStart(2, "0")).join(":");
};
export type ShowreelHandle = { play: () => void };
export type ShowreelSource = { src: string; poster?: string; webm?: string };
export default forwardRef<ShowreelHandle, ShowreelSource>(function ShowreelPlayer({ src, poster, webm }, ref) {
  const video = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const playRequested = useRef(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const play = () => { if (!ready) { playRequested.current = true; setReady(true); return; } void video.current?.play().catch(() => { setPlaying(false); setVisible(true); }); };
  useImperativeHandle(ref, () => ({ play }));
  const toggle = () => { if (video.current?.paused) play(); else video.current?.pause(); };
  const fullscreen = () => {
    const action = document.fullscreenElement ? document.exitFullscreen() : container.current?.requestFullscreen();
    void action?.catch(() => setVisible(true));
  };
  const wake = () => {
    setVisible(true);
    clearTimeout(timer.current);
    if (video.current && !video.current.paused) timer.current = setTimeout(() => setVisible(false), HIDE_DELAY);
  };
  useEffect(() => {
    if (video.current && video.current.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setDuration(video.current.duration);
      setLoading(false);
    }
    if (video.current?.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      setError(true);
      setLoading(false);
    }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && entry.intersectionRatio >= LOAD_VISIBILITY) setReady(true); else video.current?.pause(); }, { threshold: LOAD_VISIBILITY });
    if (container.current) observer.observe(container.current);
    return () => { observer.disconnect(); clearTimeout(timer.current); };
  }, []);
  useEffect(() => { if (ready) { video.current?.load(); if (playRequested.current) { playRequested.current = false; void video.current?.play().catch(() => setVisible(true)); } } }, [ready]);
  useEffect(() => {
    clearTimeout(timer.current);
    if (playing) timer.current = setTimeout(() => setVisible(false), HIDE_DELAY);
    else setVisible(true);
    return () => clearTimeout(timer.current);
  }, [playing]);
  return <div data-cursor="play" id="showreel" ref={container} role="region" aria-label={copy.title} tabIndex={0} onPointerMove={wake} onFocusCapture={wake} onKeyDown={event => {
    if ((event.target as HTMLElement).tagName === "INPUT") return;
    if ((event.target as HTMLElement).tagName === "BUTTON" && event.key === " ") return;
    const key = event.key.toLowerCase();
    if ([" ", "k", "m", "f", "arrowleft", "arrowright"].includes(key)) { event.preventDefault(); wake(); }
    if (key === " " || key === "k") toggle();
    if (key === "m" && video.current) video.current.muted = !video.current.muted;
    if (key === "f") fullscreen();
    if ((key === "arrowleft" || key === "arrowright") && video.current) video.current.currentTime = Math.max(0, Math.min(duration, video.current.currentTime + (key === "arrowleft" ? -SEEK_SECONDS : SEEK_SECONDS)));
  }} className="relative isolate aspect-video w-full overflow-hidden rounded-lg border border-hairline hover:border-accent/60 hover:shadow-[0_24px_64px_rgb(0_0_0/0.35),0_0_0_1px_rgb(99_102_241/0.15)] bg-[radial-gradient(ellipse_at_60%_20%,#27283f_0%,#141416_45%,#0b0b0d_100%)] shadow-[0_24px_64px_rgb(0_0_0/0.35)] fullscreen:aspect-auto">
    <video ref={video} className={`h-full w-full object-contain ${started ? "opacity-100" : "opacity-0"}`} preload="metadata" poster={posterFailed ? undefined : poster} playsInline onLoadedMetadata={() => { setDuration(video.current?.duration || 0); setLoading(false); }} onCanPlay={() => setLoading(false)} onWaiting={() => { if (!video.current?.paused) setLoading(true); }} onSeeked={() => setLoading(false)} onPlaying={() => { setLoading(false); setStarted(true); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={() => setCurrent(video.current?.currentTime || 0)} onVolumeChange={() => setMuted(video.current?.muted || false)} onError={() => { setError(true); setLoading(false); }}>
      {ready && webm && <source src={webm} type="video/webm" />}{ready && <source src={src} type="video/mp4" onError={() => { setError(true); setLoading(false); }} />}
    </video>
    {!started && poster && !posterFailed && <Image src={poster} alt={copy.posterAlt} fill sizes="(min-width: 1200px) 1200px, 100vw" className="pointer-events-none object-cover object-center" onError={() => setPosterFailed(true)} />}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] border border-hairline shadow-[inset_0_0_0_1px_rgb(0_0_0/0.3)]" />
    {loading && playing && !error && <div role="status" className="pointer-events-none absolute inset-0 flex items-start justify-start bg-surface-2/30 p-6"><span className="font-mono text-xs text-muted">{copy.loading}</span></div>}
    {error ? <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg/90 p-6 text-center text-sm"><p>{copy.error}</p><button className="rounded-full border border-hairline px-6 py-2" onClick={() => { setError(false); setLoading(true); video.current?.load(); }}>{copy.retry}</button></div> : <>
      {!started ? <button aria-label={copy.play} onClick={play} className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full border border-hairline bg-bg/90 px-2 py-2 text-text shadow-lg backdrop-blur-md transition-transform duration-ui motion-safe:hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none sm:bottom-6 sm:left-6 sm:gap-2 sm:px-4">
        <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-text/30 sm:h-8 sm:w-8"><Play className="h-2 w-2 fill-current sm:h-4 sm:w-4" /></span>
        <span className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-2">
          <span className="whitespace-nowrap text-[10px] font-medium sm:text-sm">{copy.play}</span>
          <span aria-hidden="true" className="font-mono text-[9px] text-text/80 sm:text-xs">{compactTime(duration)}</span>
        </span>
      </button> : <button aria-label={copy.play} tabIndex={playing ? -1 : 0} onClick={play} className={`absolute left-1/2 top-1/2 flex h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-text/40 bg-bg/60 backdrop-blur-md transition-opacity duration-ui motion-reduce:transition-none ${playing ? "pointer-events-none opacity-0" : "opacity-100"}`}><Play aria-hidden="true" className="h-8 w-8 fill-current" /></button>}
      {started && <div className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-4 pb-4 pt-12 transition-opacity duration-ui focus-within:opacity-100 motion-reduce:transition-none sm:px-6 sm:pb-6 ${visible || !playing ? "opacity-100" : "opacity-0"}`}>
        <input aria-label={copy.seek} type="range" min={0} max={duration || 1} step="any" value={current} disabled={!duration} onChange={event => { if (video.current) video.current.currentTime = Number(event.target.value); wake(); }} style={{ backgroundImage: `linear-gradient(to right, var(--accent) ${duration ? current / duration * 100 : 0}%, var(--surface-2) ${duration ? current / duration * 100 : 0}%)` }} className="pointer-events-auto bg-transparent bg-[length:100%_var(--space-1)] bg-center bg-no-repeat block h-6 w-full cursor-pointer appearance-none rounded-full accent-accent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent" />
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4">
          <button aria-label={playing ? copy.pause : copy.play} onClick={toggle} className="p-2">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
          <span className="flex-1 whitespace-nowrap font-mono text-[9px] sm:text-xs">{timecode(current)} / {timecode(duration)}</span>
          <button aria-label={muted ? copy.unmute : copy.mute} onClick={() => { if (video.current) video.current.muted = !video.current.muted; }} className="p-2">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <button aria-label={copy.fullscreen} onClick={fullscreen} className="p-2"><Maximize size={18} /></button>
        </div>
      </div>}
    </>}
  </div>;
});
