import { site } from "@/data/site";

export default function Home() {
  return (
    <main id="main-content" aria-label={site.mainLabel} className="min-h-svh">
      {/* Future composition: Hero → Work → Toolkit → About → Contact → Footer.
          Keep this foundation blank; build one section per task. */}
    </main>
  );
}
