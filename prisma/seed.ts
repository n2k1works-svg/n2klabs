import { db } from '../src/lib/db'

async function main() {
  // Clean
  await db.contactMessage.deleteMany()
  await db.setting.deleteMany()
  await db.stat.deleteMany()
  await db.testimonial.deleteMany()
  await db.service.deleteMany()
  await db.project.deleteMany()
  await db.adminUser.deleteMany()

  // Admin user — password is read from the ADMIN_PASSWORD env var.
  // This keeps the credential out of the source tree.
  // Set ADMIN_PASSWORD in your .env (locally) or your hosting platform's
  // env vars (production) before running this seed.
  const adminEmail = process.env.ADMIN_EMAIL || 'n2k1works@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD env var is required to seed the admin user. ' +
      'Set it in .env (locally) or in your hosting platform env vars, then re-run: bunx tsx prisma/seed.ts'
    )
  }
  await db.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash: adminPassword, // API hashes on compare; bcrypt recommended for production
      name: 'N2K Admin',
    },
  })

  // Services
  const services = [
    { title: 'Web Development', slug: 'web-development', icon: 'Code2', description: 'High-performance websites & web apps engineered for speed, scale, and conversion. Pixel-perfect, blazing-fast, built to grow with your business.', features: ['Custom-built frontends', 'Editorial & marketing sites', 'Headless commerce', 'Core Web Vitals optimized'] },
    { title: 'UI/UX Design', slug: 'ui-ux-design', icon: 'PenTool', description: 'Interface design that fuses aesthetics with function. We craft intuitive flows, design systems, and interaction patterns users love.', features: ['Design systems', 'Prototyping', 'Interaction design', 'Usability testing'] },
    { title: 'E-Commerce Solutions', slug: 'ecommerce-solutions', icon: 'ShoppingBag', description: 'Conversion-focused storefronts with custom CMS, secure payments, and inventory built for growth in the South Pacific and beyond.', features: ['Custom storefronts', 'Payment integration', 'Headless CMS', 'Inventory & orders'] },
    { title: 'Digital Strategy', slug: 'digital-strategy', icon: 'Compass', description: 'Roadmaps grounded in data. We align technology, brand, and growth into a strategy that moves the needle.', features: ['Market analysis', 'Growth roadmaps', 'Tech architecture', 'KPI frameworks'] },
    { title: 'Brand Identity', slug: 'brand-identity', icon: 'Sparkles', description: 'Distinctive visual identities — logo systems, typography, and guidelines that make your brand unmistakable.', features: ['Logo & mark', 'Type & color systems', 'Brand guidelines', 'Asset libraries'] },
    { title: 'SEO & Analytics', slug: 'seo-analytics', icon: 'LineChart', description: 'Technical SEO, structured data, and analytics dashboards that turn traffic into measurable revenue.', features: ['Technical SEO', 'Schema markup', 'Analytics dashboards', 'Conversion tracking'] },
  ]
  for (let i = 0; i < services.length; i++) {
    await db.service.create({
      data: { ...services[i], features: JSON.stringify(services[i].features), order: i },
    })
  }

  // Projects / Case Studies
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
    await db.project.create({ data: p })
  }

  // Testimonials
  const testimonials = [
    { name: 'Elvind Govind', role: 'Founder', company: 'Elux Designs', quote: 'N2K Labs delivered a website that feels like our design work made digital — precise, beautiful, and considered in every detail. The CMS makes updates effortless.', rating: 5, order: 0 },
  ]
  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  // Stats
  const stats = [
    { label: 'Projects Delivered', value: 1, suffix: '', order: 0 },
    { label: 'Happy Clients', value: 1, suffix: '', order: 1 },
    { label: 'Founded', value: 2026, suffix: '', order: 2 },
    { label: 'Avg. Load Time', value: 1, suffix: 's', order: 3 },
  ]
  for (const s of stats) {
    await db.stat.create({ data: s })
  }

  // Settings (key-value)
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
  ]
  for (const s of settings) {
    await db.setting.create({ data: s })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
