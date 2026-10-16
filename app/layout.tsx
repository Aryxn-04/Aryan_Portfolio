import { existsSync } from "node:fs";
import path from "node:path";
import { DURATION, EASING } from "@/lib/motion";
import type { Metadata, Viewport } from "next";
import { Caveat, Inter, JetBrains_Mono } from "next/font/google";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/data/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: "400",
  display: "swap",
});
const caveat = Caveat({ subsets: ["latin"], weight: "400", preload: false, variable: "--font-caveat", display: "swap" });

const shareImages = existsSync(path.join(process.cwd(), "public/posters/showreel.jpg")) ? ["/posters/showreel.jpg"] : undefined;

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: { type: "profile", title: site.title, description: site.description, url: site.url, images: shareImages, firstName: "Aryan", lastName: "Kumar" },
  twitter: { card: shareImages ? "summary_large_image" : "summary", images: shareImages, title: site.title, description: site.description },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0B0B0D" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable}`}>
      <body style={{ "--motion-ui": `${DURATION.ui}s`, "--motion-reveal": `${DURATION.reveal}s`, "--motion-drift": `${DURATION.drift}s`, "--motion-ease": `cubic-bezier(${EASING.join(",")})` } as React.CSSProperties}>
        <a href="#main-content" className="fixed left-6 top-4 z-[120] -translate-y-32 rounded-md bg-text px-6 py-4 text-bg focus:translate-y-0">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: site.name, url: site.url, jobTitle: "Video Editor & Motion Designer" }).replace(/</g, "\\u003c") }} />
        <SmoothScroll><ScrollProgress />{children}</SmoothScroll>
      </body>
    </html>
  );
}
