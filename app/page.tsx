import Toolkit from "@/components/Toolkit";
import Nav from "@/components/Nav";
import Work from "@/components/Work";
import Hero from "@/components/Hero";
import { site } from "@/data/site";

export default function Home() {
  return <><Nav /><main id="main-content" aria-label={site.mainLabel}><Hero /><Work /><Toolkit /></main></>;
}
