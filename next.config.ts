import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json higher up the tree confuses root detection
  turbopack: { root: __dirname },
};

export default nextConfig;
