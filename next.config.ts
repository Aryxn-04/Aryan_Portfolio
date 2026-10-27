import type { NextConfig } from "next";
import { hero } from "./data/site";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [{ source: hero.resume.href, destination: "/api/resume" }],
    };
  },
};

export default nextConfig;
