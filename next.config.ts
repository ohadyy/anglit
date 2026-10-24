import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json higher up the tree confuses root detection
  turbopack: { root: __dirname },
  // Lets a phone on the home network open the dev server. The IP is this PC's; update it if the router gives a new one
  allowedDevOrigins: ["10.100.102.15"],
  // The old Instagram-bio landing page was removed; old links go to the homepage
  async redirects() {
    return [{ source: "/bio", destination: "/", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The site is never shown inside another site's frame (clickjacking on the login page)
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
