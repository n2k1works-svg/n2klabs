import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/site";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "N2K Labs — Digital Solutions That Elevate",
    template: "%s | N2K Labs",
  },
  description: siteConfig.description,
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
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "N2K Labs",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "N2K Labs — Digital Solutions That Elevate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "N2K Labs — Digital Solutions That Elevate",
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
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

/** JSON-LD structured data for SEO.
 *  Helps Google understand this is a ProfessionalService business, which
 *  enables rich results (local business panel, breadcrumbs, etc.).
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "N2K Labs",
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  // telephone omitted — no business phone line yet (unregistered sole proprietor).
  // Adding a fake number would violate Google's structured data guidelines.
  ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
  areaServed: "South Pacific",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Fiji",
    addressCountry: "FJ",
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
  ].filter(Boolean),
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Commerce Solutions" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Strategy" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Identity" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO & Analytics" } },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "N2K Labs",
  url: siteConfig.url,
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
        {/* Skip-to-content link — keyboard accessibility (WCAG 2.4.1) */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[#0a0a0c] focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>

        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {children}
        <Toaster />

        {/* Vercel Analytics — privacy-friendly, no cookies, free */}
        <Analytics />
      </body>
    </html>
  );
}
