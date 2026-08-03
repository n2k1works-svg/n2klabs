import { db } from "./db";

export type ProjectData = {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  url?: string | null;
  image?: string | null;
  tags: string[];
  featured: boolean;
  order: number;
};

export type ServiceData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  icon: string;
  order: number;
};

export type TestimonialData = {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  quote: string;
  rating: number;
  avatar?: string | null;
  order: number;
};

export type StatData = {
  id: string;
  label: string;
  value: number;
  suffix?: string | null;
  order: number;
};

export type SettingsMap = Record<string, string>;

// === Fallback static data (used if DB unavailable) ===
const FALLBACK_PROJECTS: ProjectData[] = [
  {
    id: "elux",
    title: "Elux Design",
    client: "Elux Architecture",
    category: "Web Development",
    description:
      "A premium digital presence for a South Pacific architecture firm — custom CMS, integrated email, and a private admin panel.",
    challenge:
      "Elux needed a portfolio that matched the craftsmanship of their architecture — refined, fast, and easy for their team to update without touching code.",
    solution:
      "We built a custom Next.js site with a bespoke headless CMS, project management admin panel, and transactional email integration — all wrapped in a cinematic, editorial design system.",
    result:
      "40% faster load times, zero-dependency content workflow, and a portfolio that converts high-end project inquiries.",
    url: "https://eluxfiji.com",
    image: "/uploads/elux.jpg",
    tags: ["Next.js", "Custom CMS", "Email Integration", "Admin Panel"],
    featured: true,
    order: 0,
  },
  {
    id: "pacific",
    title: "Pacific Trade Portal",
    client: "Island Exports Co.",
    category: "E-Commerce",
    description:
      "A multilingual commerce platform connecting South Pacific artisans with global markets.",
    challenge:
      "Fragmented logistics and a dated storefront limited reach for regional exporters.",
    solution:
      "Headless commerce build with multi-currency, regional shipping logic, and a bilingual experience.",
    result: "3x international orders within the first quarter of launch.",
    image: "/uploads/pacific-trade.jpg",
    tags: ["E-Commerce", "Headless", "Multi-currency"],
    featured: true,
    order: 1,
  },
  {
    id: "lumina",
    title: "Lumina Analytics",
    client: "Lumina Group",
    category: "Web App",
    description:
      "A real-time analytics dashboard for a regional hospitality group tracking bookings and revenue across properties.",
    challenge: "Data siloed across properties with no unified view for decision-makers.",
    solution:
      "Custom dashboard with live data pipelines, role-based access, and exportable reporting.",
    result: "Cut weekly reporting time from 6 hours to 4 minutes.",
    image: "/uploads/lumina.jpg",
    tags: ["Dashboard", "Real-time", "Data Viz"],
    featured: true,
    order: 2,
  },
  {
    id: "tides",
    title: "Tides Resort",
    client: "Tides Fiji",
    category: "Brand & Web",
    description:
      "Full brand refresh and a cinematic booking-driven website for a luxury island resort.",
    challenge: "An aging brand and a slow website failed to convey the premium resort experience.",
    solution:
      "New identity system paired with a performant Next.js site and integrated booking flow.",
    result: "Direct bookings increased 58% post-launch.",
    image: "/uploads/tides.jpg",
    tags: ["Branding", "Next.js", "Booking"],
    featured: false,
    order: 3,
  },
];

const FALLBACK_SERVICES: ServiceData[] = [
  {
    id: "s1",
    title: "Web Development",
    slug: "web-development",
    icon: "Code2",
    description:
      "High-performance websites & web apps engineered with Next.js, TypeScript, and modern infrastructure. Pixel-perfect, blazing-fast, built to scale.",
    features: ["Next.js & React", "Type-safe architecture", "Edge & serverless", "Core Web Vitals optimized"],
    order: 0,
  },
  {
    id: "s2",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    icon: "PenTool",
    description:
      "Interface design that fuses aesthetics with function. We craft intuitive flows, design systems, and interaction patterns users love.",
    features: ["Design systems", "Prototyping", "Interaction design", "Usability testing"],
    order: 1,
  },
  {
    id: "s3",
    title: "E-Commerce Solutions",
    slug: "ecommerce-solutions",
    icon: "ShoppingBag",
    description:
      "Conversion-focused storefronts with custom CMS, secure payments, and inventory built for growth in the South Pacific and beyond.",
    features: ["Custom storefronts", "Payment integration", "Headless CMS", "Inventory & orders"],
    order: 2,
  },
  {
    id: "s4",
    title: "Digital Strategy",
    slug: "digital-strategy",
    icon: "Compass",
    description:
      "Roadmaps grounded in data. We align technology, brand, and growth into a strategy that moves the needle.",
    features: ["Market analysis", "Growth roadmaps", "Tech architecture", "KPI frameworks"],
    order: 3,
  },
  {
    id: "s5",
    title: "Brand Identity",
    slug: "brand-identity",
    icon: "Sparkles",
    description:
      "Distinctive visual identities — logo systems, typography, and guidelines that make your brand unmistakable.",
    features: ["Logo & mark", "Type & color systems", "Brand guidelines", "Asset libraries"],
    order: 4,
  },
  {
    id: "s6",
    title: "SEO & Analytics",
    slug: "seo-analytics",
    icon: "LineChart",
    description:
      "Technical SEO, structured data, and analytics dashboards that turn traffic into measurable revenue.",
    features: ["Technical SEO", "Schema markup", "Analytics dashboards", "Conversion tracking"],
    order: 5,
  },
];

const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  {
    id: "t1",
    name: "Sera Maiwai",
    role: "Founder",
    company: "Elux Architecture",
    quote:
      "N2K Labs delivered a website that feels like our architecture made digital — precise, beautiful, and considered in every detail. The CMS makes updates effortless.",
    rating: 5,
    order: 0,
  },
  {
    id: "t2",
    name: "James Lal",
    role: "Director",
    company: "Island Exports Co.",
    quote:
      "Our new platform opened doors to markets we could never reach before. The team understood our region and built something that truly works here.",
    rating: 5,
    order: 1,
  },
  {
    id: "t3",
    name: "Ana Volavola",
    role: "Marketing Lead",
    company: "Lumina Group",
    quote:
      "The analytics dashboard transformed how we operate. We went from guessing to knowing — every decision is now backed by real-time data.",
    rating: 5,
    order: 2,
  },
  {
    id: "t4",
    name: "Marcus Benn",
    role: "GM",
    company: "Tides Fiji",
    quote:
      "From brand to booking, N2K handled everything with a level of polish we did not think was possible in the South Pacific. World-class.",
    rating: 5,
    order: 3,
  },
];

const FALLBACK_STATS: StatData[] = [
  { id: "st1", label: "Projects Delivered", value: 87, suffix: "+", order: 0 },
  { id: "st2", label: "Happy Clients", value: 64, suffix: "+", order: 1 },
  { id: "st3", label: "Years Experience", value: 9, suffix: "", order: 2 },
  { id: "st4", label: "Avg. Load Time", value: 1, suffix: "s", order: 3 },
];

const FALLBACK_SETTINGS: SettingsMap = {
  "contact.email": "hello@n2klabs.com",
  "contact.phone": "+679 900 0000",
  "contact.location": "South Pacific, Fiji",
  "social.twitter": "https://twitter.com/n2klabs",
  "social.instagram": "https://instagram.com/n2klabs",
  "social.website": "https://n2klabs.com",
  "social.github": "https://github.com/n2klabs",
  "site.tagline": "Digital Solutions That Elevate",
  "site.description":
    "N2K Labs is a South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.",
};

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const rows = await db.project.findMany({ orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_PROJECTS;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      client: r.client,
      category: r.category,
      description: r.description,
      challenge: r.challenge,
      solution: r.solution,
      result: r.result,
      url: r.url,
      image: r.image,
      tags: parseTags(r.tags),
      featured: r.featured,
      order: r.order,
    }));
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function getServices(): Promise<ServiceData[]> {
  try {
    const rows = await db.service.findMany({ orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_SERVICES;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description,
      features: parseTags(r.features),
      icon: r.icon || "Code2",
      order: r.order,
    }));
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_TESTIMONIALS;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      company: r.company,
      quote: r.quote,
      rating: r.rating,
      avatar: r.avatar,
      order: r.order,
    }));
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

export async function getStats(): Promise<StatData[]> {
  try {
    const rows = await db.stat.findMany({ orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_STATS;
    return rows.map((r) => ({
      id: r.id,
      label: r.label,
      value: r.value,
      suffix: r.suffix,
      order: r.order,
    }));
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getSettings(): Promise<SettingsMap> {
  try {
    const rows = await db.setting.findMany();
    const map: SettingsMap = { ...FALLBACK_SETTINGS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export const FALLBACK = {
  projects: FALLBACK_PROJECTS,
  services: FALLBACK_SERVICES,
  testimonials: FALLBACK_TESTIMONIALS,
  stats: FALLBACK_STATS,
  settings: FALLBACK_SETTINGS,
};
