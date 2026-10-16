export type Category = "YouTube" | "Reels" | "Commercial" | "Motion Graphics";
export type ProjectVideo = { kind: "mp4"; src: string } | { kind: "youtube"; id: string } | { kind: "vimeo"; id: string };
export interface Project {
  id: string; title: string; tags: Category[]; typeLabel: string; year: number;
  duration: string; poster: string | null; previewSrc?: string; video: ProjectVideo; gradient: string;
}
export const workContent = {
  label: "01 — Portfolio", title: "Selected Work",
  subtitle: "A collection of videos I’ve edited and designed — from brand stories to short-form content, each crafted to create real impact.",
  filters: ["All", "YouTube", "Reels", "Commercial", "Motion Graphics"] as const,
  viewAll: "View All Projects", empty: "No projects in this category yet.",
  comingSoon: "Coming soon", comingSoonDescription: "This project’s film will be available here soon.",
};
export const projects: Project[] = [
  { id: "new-chapter", title: "A New Chapter", tags: ["YouTube"], typeLabel: "Cinematic Edit · Personal Project", year: 2024, duration: "02:28", poster: null, previewSrc: "/videos/Built_Around_You_4K_Silent.mp4", video: { kind: "mp4", src: "/videos/Built_Around_You_4K_Silent.mp4" }, gradient: "radial-gradient(ellipse at 75% 20%, #9a5838, transparent 65%), linear-gradient(145deg, #3e2830, #0b0b0d 85%)" },
  { id: "made-to-belong", title: "Made to Belong", tags: ["Commercial"], typeLabel: "Brand Film", year: 2024, duration: "01:12", poster: null, previewSrc: "/videos/aslimaaz.mp4", video: { kind: "mp4", src: "/videos/aslimaaz.mp4" }, gradient: "radial-gradient(ellipse at 80% 10%, #7e7960, transparent 60%), linear-gradient(130deg, #263b35, #0b0b0d)" },
  { id: "speed", title: "Speed Builds Character", tags: ["Commercial"], typeLabel: "Product Ad", year: 2024, duration: "00:38", poster: null, previewSrc: "/videos/h21ctlg.mp4", video: { kind: "mp4", src: "/videos/h21ctlg.mp4" }, gradient: "radial-gradient(ellipse at 80% 70%, #455866, transparent 65%), linear-gradient(145deg, #202329, #08080a)" },
  { id: "discipline", title: "Discipline Changes Everything", tags: ["YouTube"], typeLabel: "YouTube Edit · Long Form", year: 2024, duration: "01:46", poster: null, video: { kind: "youtube", id: "PLACEHOLDER" }, gradient: "radial-gradient(ellipse at 20% 80%, #7c292d, transparent 65%), linear-gradient(135deg, #302020, #0b0b0d)" },
  { id: "journey", title: "The Journey Within", tags: ["YouTube"], typeLabel: "Travel Edit", year: 2024, duration: "01:03", poster: null, video: { kind: "youtube", id: "PLACEHOLDER" }, gradient: "radial-gradient(ellipse at 70% 20%, #4f6340, transparent 65%), linear-gradient(125deg, #123a34, #0b0b0d)" },
  { id: "ideas", title: "Ideas in Motion", tags: ["Motion Graphics", "Reels"], typeLabel: "Motion Graphics", year: 2024, duration: "00:52", poster: null, video: { kind: "youtube", id: "PLACEHOLDER" }, gradient: "radial-gradient(ellipse at 75% 70%, #4842a1, transparent 65%), linear-gradient(145deg, #26203d, #0b0b0d)" },
];
