import type { MetadataRoute } from "next";

// PWA web manifest — lets users "Add to Home Screen" on iOS/Android
// and gives the app a proper name/icon when installed.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "N2K Labs — Digital Solutions That Elevate",
    short_name: "N2K Labs",
    description:
      "A South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
