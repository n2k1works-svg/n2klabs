import { db } from '../src/lib/db'
import { hashPassword } from '../src/lib/auth'

/**
 * Idempotent seed — safe to run on every Vercel build.
 *
 * Uses upserts so re-running never duplicates data and, crucially, never
 * destroys user-submitted ContactMessage rows (real client inquiries must
 * persist across deploys).
 *
 * If the DB is unreachable or any single upsert fails, the process exits 0
 * so a seed hiccup never breaks the Vercel build — the site has static
 * fallback data (see src/lib/data.ts) and admin login works via env vars
 * without any DB row at all.
 */
async function main() {
  // ── Admin user (upsert by email) ──────────────────────────────
  // Auth at runtime uses ADMIN_PASSWORD env var (see src/lib/auth.ts),
  // so the DB row is for completeness/admin-tooling only. We still hash
  // the password before storing to match the existing schema intent.
  const adminEmail = process.env.ADMIN_EMAIL || 'n2k1works@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.warn(
      '[seed] ADMIN_PASSWORD env var not set — skipping admin user row. ' +
        'Admin login still works via env-var auth (src/lib/auth.ts).',
    )
  } else {
    const passwordHash = await hashPassword(adminPassword)
    await db.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash, name: 'N2K Admin' },
      create: { email: adminEmail, passwordHash, name: 'N2K Admin' },
    })
  }

  // ── Services (upsert by slug) ─────────────────────────────────
  const services = [
    { title: 'Web Development', slug: 'web-development', icon: 'Code2', description: 'High-performance websites & web apps engineered for speed, scale, and conversion. Pixel-perfect, blazing-fast, built to grow with your business.', features: ['Custom-built frontends', 'Editorial & marketing sites', 'Headless commerce', 'Core Web Vitals optimized'] },
    { title: 'UI/UX Design', slug: 'ui-ux-design', icon: 'PenTool', description: 'Interface design that fuses aesthetics with function. We craft intuitive flows, design systems, and interaction patterns users love.', features: ['Design systems', 'Prototyping', 'Interaction design', 'Usability testing'] },
    { title: 'E-Commerce Solutions', slug: 'ecommerce-solutions', icon: 'ShoppingBag', description: 'Conversion-focused storefronts with custom CMS, secure payments, and inventory built for growth in the South Pacific and beyond.', features: ['Custom storefronts', 'Payment integration', 'Headless CMS', 'Inventory & orders'] },
    { title: 'Digital Strategy', slug: 'digital-strategy', icon: 'Compass', description: 'Roadmaps grounded in data. We align technology, brand, and growth into a strategy that moves the needle.', features: ['Market analysis', 'Growth roadmaps', 'Tech architecture', 'KPI frameworks'] },
    { title: 'Brand Identity', slug: 'brand-identity', icon: 'Sparkles', description: 'Distinctive visual identities — logo systems, typography, and guidelines that make your brand unmistakable.', features: ['Logo & mark', 'Type & color systems', 'Brand guidelines', 'Asset libraries'] },
    { title: 'SEO & Analytics', slug: 'seo-analytics', icon: 'LineChart', description: 'Technical SEO, structured data, and analytics dashboards that turn traffic into measurable revenue.', features: ['Technical SEO', 'Schema markup', 'Analytics dashboards', 'Conversion tracking'] },
  ]
  for (let i = 0; i < services.length; i++) {
    const s = services[i]
    await db.service.upsert({
      where: { slug: s.slug },
      update: { title: s.title, description: s.description, features: JSON.stringify(s.features), icon: s.icon, order: i },
      create: { ...s, features: JSON.stringify(s.features), order: i },
    })
  }

  // ── Projects (upsert by title) ───────────────────────────────
  const projects = [
    {
      title: 'Elux Designs',
      client: 'Elux Designs',
      category: 'Web Development',
      description: 'A premium digital presence for a South Pacific design studio — custom CMS, integrated email, and a private admin panel.',
      challenge: 'Elux needed a portfolio that matched the craftsmanship of their design work — refined, fast, and easy for their team to update without touching code.',
      solution: 'We built a bespoke platform with a custom headless CMS, project management admin panel, and transactional email integration — all wrapped in a cinematic, editorial design system.',
      result: '40% faster load times, zero-dependency content workflow, and a portfolio that converts high-end project inquiries.',
      url: 'https://eluxfiji.com',
      image: '/uploads/elux-screenshot.png',
      tags: JSON.stringify(['Editorial', 'Custom CMS', 'Email Integration', 'Admin Panel']),
      featured: true,
      order: 0,
    },
  ]
  for (const p of projects) {
    const existing = await db.project.findFirst({ where: { title: p.title } })
    if (existing) {
      await db.project.update({ where: { id: existing.id }, data: p })
    } else {
      await db.project.create({ data: p })
    }
  }

  // ── Testimonials (upsert by name+company) ────────────────────
  const testimonials = [
    { name: 'Elvind Govind', role: 'Founder', company: 'Elux Designs', quote: 'N2K Labs delivered a website that feels like our design work made digital — precise, beautiful, and considered in every detail. The CMS makes updates effortless.', rating: 5, order: 0 },
  ]
  for (const t of testimonials) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name, company: t.company } })
    if (existing) {
      await db.testimonial.update({ where: { id: existing.id }, data: t })
    } else {
      await db.testimonial.create({ data: t })
    }
  }

  // ── Stats (upsert by label) ──────────────────────────────────
  const stats = [
    { label: 'Projects Delivered', value: 1, suffix: '', order: 0 },
    { label: 'Happy Clients', value: 1, suffix: '', order: 1 },
    { label: 'Founded', value: 2026, suffix: '', order: 2 },
    { label: 'Avg. Load Time', value: 1, suffix: 's', order: 3 },
  ]
  for (const s of stats) {
    const existing = await db.stat.findFirst({ where: { label: s.label } })
    if (existing) {
      await db.stat.update({ where: { id: existing.id }, data: s })
    } else {
      await db.stat.create({ data: s })
    }
  }

  // ── Settings (upsert by key) ─────────────────────────────────
  const settings = [
    { key: 'contact.email', value: 'hello@n2klabs.com' },
    { key: 'contact.phone', value: '+679 900 0000' },
    { key: 'contact.location', value: 'South Pacific, Fiji' },
    { key: 'social.twitter', value: 'https://twitter.com/n2klabs' },
    { key: 'social.instagram', value: 'https://instagram.com/n2klabs' },
    { key: 'social.website', value: 'https://n2klabs.com' },
    { key: 'social.github', value: 'https://github.com/n2klabs' },
    { key: 'site.tagline', value: 'Digital Solutions That Elevate' },
    { key: 'site.description', value: 'N2K Labs is a South Pacific digital studio crafting world-class web experiences, brands, and commerce platforms.' },
    { key: 'hero.title', value: 'N2K Labs' },
    { key: 'hero.tagline', value: 'Digital Solutions Studio — Est. 2026' },
    { key: 'hero.subline', value: 'An award-grade digital studio in the South Pacific crafting world-class web experiences, brands, and commerce platforms.' },
    { key: 'hero.cta1', value: 'View Our Work' },
    { key: 'hero.cta2', value: 'Get a Quote' },
    // About / Story section
    { key: 'about.kicker', value: 'About N2K Labs' },
    { key: 'about.heading.line1', value: 'We build the digital' },
    { key: 'about.heading.line2', value: 'infrastructure of' },
    { key: 'about.heading.highlight', value: 'ambitious brands.' },
    { key: 'about.story1', value: 'N2K Labs was founded on a simple conviction: the South Pacific deserves digital experiences as refined as anything coming out of Sydney, Singapore, or San Francisco.' },
    { key: 'about.story2', value: 'From our base in Fiji, we partner with businesses, startups, and entrepreneurs who refuse to settle. We blend strategy, design, and engineering into work that performs — fast, accessible, and unmistakably premium. Every project is an opportunity to raise the bar for what\'s possible in the region.' },
    { key: 'about.signature.name', value: 'The N2K Labs Team' },
    { key: 'about.signature.location', value: '/ South Pacific, Fiji' },
    { key: 'about.value1.title', value: 'Mission' },
    { key: 'about.value1.text', value: 'To give South Pacific businesses a digital presence that rivals the best in the world — no compromises.' },
    { key: 'about.value2.title', value: 'Vision' },
    { key: 'about.value2.text', value: 'A region known not for its limitations, but for the world-class experiences built within it.' },
    { key: 'about.value3.title', value: 'Method' },
    { key: 'about.value3.text', value: 'Strategy first, design-led, engineered to last. Every pixel and every millisecond matters.' },
  ]
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // NEVER touch ContactMessage — those are user-submitted inquiries and
  // must survive every deploy.
  console.log('[seed] Idempotent seed complete. ContactMessage table untouched.')
}

main()
  .catch((e) => {
    console.error('[seed] failed (non-fatal):', e)
    // Exit 0 so a seed failure never breaks the Vercel build. The site
    // has static fallback data and env-var auth — both work without the DB.
    process.exit(0)
  })
  .finally(async () => {
    await db.$disconnect()
  })
