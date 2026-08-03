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
      "We built a bespoke platform with a custom headless CMS, project management admin panel, and transactional email integration — all wrapped in a cinematic, editorial design system.",
    result:
      "40% faster load times, zero-dependency content workflow, and a portfolio that converts high-end project inquiries.",
    url: "https://eluxfiji.com",
    image: "/uploads/elux.jpg",
    tags: ["Editorial", "Custom CMS", "Email Integration", "Admin Panel"],
    featured: true,
    order: 0,
  },
];

const FALLBACK_SERVICES: ServiceData[] = [
  {
    id: "s1",
    title: "Web Development",
    slug: "web-development",
    icon: "Code2",
    description:
      "High-performance websites & web apps engineered for speed, scale, and conversion. Pixel-perfect, blazing-fast, built to grow with your business.",
    features: ["Custom-built frontends", "Editorial & marketing sites", "Headless commerce", "Core Web Vitals optimized"],
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
];

const FALLBACK_STATS: StatData[] = [
  { id: "st1", label: "Projects Delivered", value: 1, suffix: "", order: 0 },
  { id: "st2", label: "Happy Clients", value: 1, suffix: "", order: 1 },
  { id: "st3", label: "Founded", value: 2026, suffix: "", order: 2 },
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
