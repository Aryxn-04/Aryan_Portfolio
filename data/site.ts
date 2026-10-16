export const site = {
  name: "Aryan Kumar",
  title: "Aryan Kumar | Video Editor & Motion Designer",
  description: "The portfolio of Aryan Kumar, video editor and motion designer.",
  mainLabel: "Aryan Kumar portfolio",
} as const;

export const sectionOrder = [
  "Hero",
  "Work",
  "Toolkit",
  "About",
  "Contact",
  "Footer",
] as const;

export const navigation = [
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  wordmark: "ARYAN KUMAR",
  availability: "Available for freelance, October 2026",
  headline: ["I turn raw footage into", "stories people remember."],
  description: "Video editor specializing in YouTube, short-form, brand films, and motion graphics.",
  work: "View My Work",
  watch: "Watch Showreel",
  talk: "Let's Talk",
  scroll: "Scroll",
  video: { src: "/videos/Built_Around_You_4K_Silent.mp4", poster: undefined },
  stats: [
    { value: 50, suffix: "+", label: "Projects" },
    { value: 10, suffix: "M+", label: "Views Generated" },
    { value: 2, suffix: "+", label: "Years Experience" },
  ],
} as const;

export const playerCopy = {
  title: "Aryan Kumar showreel",
  loading: "Loading showreel…",
  error: "The showreel couldn't load. Please try again.",
  retry: "Try again",
  play: "Play showreel", pause: "Pause showreel", mute: "Mute", unmute: "Unmute",
  fullscreen: "Toggle fullscreen", seek: "Seek showreel",
} as const;
