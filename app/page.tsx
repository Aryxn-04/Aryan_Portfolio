import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { site } from "@/data/site";

export default function Home() {
  return <><Nav /><main id="main-content" aria-label={site.mainLabel}><Hero /></main></>;
}
