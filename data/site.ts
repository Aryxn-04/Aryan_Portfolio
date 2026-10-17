export const site = {
  name: "Aryan Kumar",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aryan-portfolio-one-nu.vercel.app",
  title: "Aryan Kumar | Video Editor & Motion Designer",
  description: "The portfolio of Aryan Kumar, video editor and motion designer.",
  mainLabel: "Aryan Kumar portfolio",
} as const;

export const sectionOrder = [
  "Hero",
  "Work",
  "Toolkit",
  "Contact",
  "Footer",
] as const;

export const navigation = [
  { label: "Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  id: "home",
  wordmark: "ARYAN KUMAR",
  logoPath: "/logo-mark.svg",
  wordmarkSubtitle: "VIDEO EDITOR",
  availability: "Available for freelance, October 2026",
  work: "View My Work",
  watch: "Watch Showreel",
  talk: "Let's Talk",
  eyebrow: "[ About me ]",
  heading: "Hi, I'm Aryan.",
  intro: "A Video Editor & Motion Designer who loves turning ideas into visuals that actually feel something.",
  bio: "I’m a video editor and motion designer with a passion for crafting engaging visual stories — from short-form content to brand films. I enjoy the entire process, from raw footage to the final frame, where editing, motion and sound come together to create real impact.",
  signature: "Video Editor / Motion Designer",
  caption: ["Aryan Kumar", "Est. 2024"],
  portraitInitials: "AK",
  // Public-relative paths and configurable image crop positions.
  portraits: {
    primary: { src: "/portrait.jpg", alt: "Black and white portrait of Aryan Kumar, video editor and motion designer", position: "50% 30%" },
    secondary: { src: "/logo-card.jpg", alt: "Aryan Kumar monogram", position: "50% 50%" },
  },
  stats: [
    { value: "2+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "10M+", label: "Views Generated" },
  ],
  skillsLabel: "Skills & Interests",
  skills: ["Video Editing", "Motion Graphics", "Color Grading", "Sound Design", "Storytelling", "Short-form Content", "Brand Films", "Creative Direction"],
  resume: { label: "Download Resume", href: "/resume.pdf" },
} as const;

export const showreel = {
  id: "showreel",
  label: "Showreel",
  video: { src: "/videos/Built_Around_You_4K_Silent.mp4", poster: "/posters/showreel.jpg" },
} as const;

export const playerCopy = {
  title: "Aryan Kumar showreel",
  posterAlt: "Aryan Kumar — video editor and motion designer showreel",
  loading: "Loading showreel…",
  error: "The showreel couldn't load. Please try again.",
  retry: "Try again",
  play: "Play showreel", pause: "Pause showreel", mute: "Mute", unmute: "Unmute",
  fullscreen: "Toggle fullscreen", seek: "Seek showreel",
} as const;

export const contact = {
  label: "03 — Contact",
  eyebrow: "[ Let's work together ]",
  headline: ["Let's create", "something", "worth", "watching."],
  description: "Have a project in mind? A collaboration idea? Or just want to say hi? I'm always open to interesting conversations and creative opportunities.",
  email: "hello.aryandesigns@gmail.com",
  emailLabel: "Email Aryan",
  availability: "Available for freelance",
  availabilityDate: "October 2026",
  formTitle: "Send a message",
  fields: { name: "Name", email: "Email", projectType: "Project Type", message: "Message", website: "Website (leave empty)" },
  placeholders: { name: "Your Name", email: "Your Email", projectType: "Select a project type", message: "Tell me about your project…" },
  projectTypes: ["YouTube", "Reels/Short-form", "Commercial/Brand film", "Motion graphics"],
  submit: "Send Message", sending: "Sending…",
  response: "I usually respond within 24 hours.",
  success: "Thanks! Your message has been sent. I'll be in touch soon.",
  failure: "Unable to send your message. Please try again or email me directly.",
  copy: "Copy email address", copied: "Copied", copyFailure: "Couldn't copy. Select the email address to copy it manually.",
} as const;

export const contactLimits = { name: 100, email: 254, message: 5000, minMessage: 10 } as const;
export type ContactField = "name" | "email" | "projectType" | "message";
export function validateContact(payload: Record<string, unknown>): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  if (typeof payload.name !== "string" || !payload.name.trim() || payload.name.trim().length > contactLimits.name) errors.name = "Enter your name (1–100 characters).";
  if (typeof payload.email !== "string" || payload.email.length > contactLimits.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) errors.email = "Enter a valid email address, such as name@example.com.";
  if (!contact.projectTypes.some(type => type === payload.projectType)) errors.projectType = "Select one of the four project types.";
  if (typeof payload.message !== "string" || payload.message.trim().length < contactLimits.minMessage || payload.message.length > contactLimits.message) errors.message = "Describe your project in 10–5,000 characters.";
  return errors;
}

export const footer = {
  wordmark: "ARYAN'S", wordmarkSuffix: "PORTFOLIO",
  tagline: "Video Editor & Motion Designer", motto: "Ideas → Stories → Impact",
  copyright: "Aryan Kumar. All rights reserved.", backToTop: "Back to top",
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/arcxverse/", label: "Aryan on Instagram" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/onlyaryan/", label: "Aryan on LinkedIn" },
    { name: "Behance", href: "https://www.behance.net/aryandesigns2", label: "Aryan on Behance" },
  ],
  comingSoonSocials: [{ name: "X", label: "X (Twitter) — Coming soon" }],
} as const;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Video Editor & Motion Designer",
  email: contact.email,
  sameAs: footer.socials.map(social => social.href),
} as const;
