import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://n2klabs.com"),
  title: {
    default: "N2K Labs — Digital Solutions That Elevate",
    template: "%s | N2K Labs",
  },
  description:
    "N2K Labs is a South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms. Web Development, UI/UX Design, E-Commerce, Digital Strategy, Brand Identity & SEO.",
  keywords: [
    "N2K Labs",
    "web development Fiji",
    "South Pacific digital agency",
    "UI UX design",
    "e-commerce solutions",
    "Next.js agency",
    "brand identity",
    "SEO analytics",
  ],
  authors: [{ name: "N2K Labs" }],
  creator: "N2K Labs",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "N2K Labs — Digital Solutions That Elevate",
    description:
      "A South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.",
    url: "https://n2klabs.com",
    siteName: "N2K Labs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "N2K Labs — Digital Solutions That Elevate",
    description:
      "A South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Next.js 16 viewport export — sets the <meta name="viewport"> tag,
// theme-color (mobile browser chrome), and viewport-fit (notch support).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
