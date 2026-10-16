import { existsSync } from "node:fs";
import path from "node:path";
import { projects } from "@/data/projects";
import { hero } from "@/data/site";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Toolkit from "@/components/Toolkit";
import Nav from "@/components/Nav";
import Work from "@/components/Work";
import Hero from "@/components/Hero";
import { site } from "@/data/site";

export default function Home() {
  const exists = (file: string) => existsSync(path.join(process.cwd(), "public", file));
  const video = { src: exists("/videos/showreel-hero.mp4") ? "/videos/showreel-hero.mp4" : hero.video.src, poster: exists("/posters/showreel.jpg") ? "/posters/showreel.jpg" : undefined };
  const availableProjects = projects.map(project => {
    const sourceName = project.video.kind === "mp4" ? path.parse(project.video.src).name : project.id;
    const candidates = [project.id, sourceName];
    const poster = candidates.flatMap(name => ["jpg", "png", "webp"].map(ext => `/posters/${name}.${ext}`)).find(exists);
    const preview = candidates.map(name => `/videos/previews/${name}.mp4`).find(exists);
    return { ...project, poster: poster || project.poster, previewSrc: preview || project.previewSrc };
  });
  return <><Nav /><main tabIndex={-1} id="main-content" aria-label={site.mainLabel}><Hero video={video} portraitAvailable={exists(hero.portrait.src)} /><Work projects={availableProjects} /><Toolkit /><Contact /></main><Footer /></>;
}
