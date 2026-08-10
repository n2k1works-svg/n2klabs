import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a fixed "last modified" date so Google caches it consistently.
  // Using new Date() makes Google ignore the value (always "now").
  const lastModified = new Date("2026-01-01");
  const legalModified = new Date("2026-08-10");
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: legalModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: legalModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
