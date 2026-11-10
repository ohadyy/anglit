import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { NOINDEX_PATHS } from "@/lib/chrome";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: NOINDEX_PATHS,
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
