export type Category = "Intro / Motion" | "Commercial" | "Motion Graphics" | "Event Film";
export type ProjectVideo = { kind: "mp4"; src: string };
export interface Project {
  id: string; title: string; tags: Category[]; typeLabel: string; year: number;
  duration: string; poster: string | null; previewSrc?: string; video: ProjectVideo; gradient: string;
}
export const workContent = {
  label: "01 — Portfolio", title: "Selected Work",
  subtitle: "A collection of videos I’ve edited and designed — from brand stories to short-form content, each crafted to create real impact.",
  viewAll: "View All Projects",
};
// Array order controls the gallery layout; the first project becomes the large card.
export const projects: Project[] = [
  { id: "apex-intro", title: "Apex Intro", tags: ["Intro / Motion"], typeLabel: "Intro / Motion", year: 2025, duration: "00:21", poster: "/posters/apex-intro.jpg", previewSrc: "/videos/Apex Intro.mp4", video: { kind: "mp4", src: "/videos/Apex Intro.mp4" }, gradient: "radial-gradient(ellipse at 75% 20%, #292344, transparent 65%), linear-gradient(145deg, #141421, #0b0b0d)" },
  { id: "vsl", title: "VSL", tags: ["Commercial"], typeLabel: "Commercial", year: 2025, duration: "03:29", poster: "/posters/vsl.jpg", previewSrc: "/videos/Vsl.mp4", video: { kind: "mp4", src: "/videos/Vsl.mp4" }, gradient: "radial-gradient(ellipse at 80% 10%, #22382e, transparent 60%), linear-gradient(130deg, #161d1a, #0b0b0d)" },
  { id: "logo-reveal", title: "Logo Reveal", tags: ["Motion Graphics"], typeLabel: "Motion Graphics", year: 2025, duration: "00:04", poster: "/posters/logo-reveal.jpg", previewSrc: "/videos/Logo Reveal.mp4", video: { kind: "mp4", src: "/videos/Logo Reveal.mp4" }, gradient: "radial-gradient(ellipse at 80% 70%, #263443, transparent 65%), linear-gradient(145deg, #171a21, #08080a)" },
  { id: "animation", title: "Animation", tags: ["Motion Graphics"], typeLabel: "Motion Graphics", year: 2025, duration: "00:07", poster: "/posters/animation.jpg", previewSrc: "/videos/Animation.mp4", video: { kind: "mp4", src: "/videos/Animation.mp4" }, gradient: "radial-gradient(ellipse at 20% 80%, #3b2333, transparent 65%), linear-gradient(135deg, #21171c, #0b0b0d)" },
  { id: "event-video", title: "Event Video", tags: ["Event Film"], typeLabel: "Event Film", year: 2025, duration: "00:22", poster: "/posters/event-video.jpg", previewSrc: "/videos/Event Video.mp4", video: { kind: "mp4", src: "/videos/Event Video.mp4" }, gradient: "radial-gradient(ellipse at 70% 20%, #3b3322, transparent 65%), linear-gradient(125deg, #211d16, #0b0b0d)" },
];
