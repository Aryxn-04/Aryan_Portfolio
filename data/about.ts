export const about = {
  label: "03 — About",
  eyebrow: "[ About me ]",
  heading: "Hi, I'm Aryan.",
  intro: "A Video Editor & Motion Designer who loves turning ideas into visuals that actually feel something.",
  bio: "I’m a video editor and motion designer with a passion for crafting engaging visual stories — from short-form content to brand films. I enjoy the entire process, from raw footage to the final frame, where editing, motion and sound come together to create real impact.",
  signature: "Video Editor / Motion Designer",
  caption: ["Aryan Kumar", "Est. 2024"],
  // Public-relative paths: replace these when your portraits are ready.
  portraits: {
    primary: { src: "/portrait.jpg", alt: "Portrait of Aryan Kumar" },
    secondary: { src: "/portrait-2.jpg", alt: "Aryan behind the scenes" },
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
