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

  // Admin user (password: "n2k-admin-2024" — hashed simply; in production use bcrypt)
  // We store a simple hash placeholder; real auth compares via API.
  await db.adminUser.create({
    data: {
      email: 'admin@n2klabs.com',
      passwordHash: 'n2k-admin-2024', // plain for demo; API hashes on compare
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
      title: 'Elux Design',
      client: 'Elux Architecture',
      category: 'Web Development',
      description: 'A premium digital presence for a South Pacific architecture firm — custom CMS, integrated email, and a private admin panel.',
      challenge: 'Elux needed a portfolio that matched the craftsmanship of their architecture — refined, fast, and easy for their team to update without touching code.',
      solution: 'We built a bespoke platform with a custom headless CMS, project management admin panel, and transactional email integration — all wrapped in a cinematic, editorial design system.',
      result: '40% faster load times, zero-dependency content workflow, and a portfolio that converts high-end project inquiries.',
      url: 'https://eluxfiji.com',
      image: '/uploads/elux.jpg',
      tags: JSON.stringify(['Editorial', 'Custom CMS', 'Email Integration', 'Admin Panel']),
      featured: true,
      order: 0,
    },
    {
      title: 'Pacific Trade Portal',
      client: 'Island Exports Co.',
      category: 'E-Commerce',
      description: 'A multilingual commerce platform connecting South Pacific artisans with global markets.',
      challenge: 'Fragmented logistics and a dated storefront limited reach for regional exporters.',
      solution: 'Headless commerce build with multi-currency, regional shipping logic, and a bilingual experience.',
      result: '3x international orders within the first quarter of launch.',
      image: '/uploads/pacific-trade.jpg',
      tags: JSON.stringify(['E-Commerce', 'Headless', 'Multi-currency']),
      featured: true,
      order: 1,
    },
    {
      title: 'Lumina Analytics',
      client: 'Lumina Group',
      category: 'Web App',
      description: 'A real-time analytics dashboard for a regional hospitality group tracking bookings and revenue across properties.',
      challenge: 'Data siloed across properties with no unified view for decision-makers.',
      solution: 'Custom dashboard with live data pipelines, role-based access, and exportable reporting.',
      result: 'Cut weekly reporting time from 6 hours to 4 minutes.',
      image: '/uploads/lumina.jpg',
      tags: JSON.stringify(['Dashboard', 'Real-time', 'Data Viz']),
      featured: true,
      order: 2,
    },
    {
      title: 'Tides Resort',
      client: 'Tides Fiji',
      category: 'Brand & Web',
      description: 'Full brand refresh and a cinematic booking-driven website for a luxury island resort.',
      challenge: 'An aging brand and a slow website failed to convey the premium resort experience.',
      solution: 'New identity system paired with a performant custom-built site and integrated booking flow.',
      result: 'Direct bookings increased 58% post-launch.',
      image: '/uploads/tides.jpg',
      tags: JSON.stringify(['Branding', 'Resort', 'Booking']),
      featured: false,
      order: 3,
    },
  ]
  for (const p of projects) {
    await db.project.create({ data: p })
  }

  // Testimonials
  const testimonials = [
    { name: 'Sera Maiwai', role: 'Founder', company: 'Elux Architecture', quote: 'N2K Labs delivered a website that feels like our architecture made digital — precise, beautiful, and considered in every detail. The CMS makes updates effortless.', rating: 5, order: 0 },
    { name: 'James Lal', role: 'Director', company: 'Island Exports Co.', quote: 'Our new platform opened doors to markets we could never reach before. The team understood our region and built something that truly works here.', rating: 5, order: 1 },
    { name: 'Ana Volavola', role: 'Marketing Lead', company: 'Lumina Group', quote: 'The analytics dashboard transformed how we operate. We went from guessing to knowing — every decision is now backed by real-time data.', rating: 5, order: 2 },
    { name: 'Marcus Benn', role: 'GM', company: 'Tides Fiji', quote: 'From brand to booking, N2K handled everything with a level of polish we did not think was possible in the South Pacific. World-class.', rating: 5, order: 3 },
  ]
  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  // Stats
  const stats = [
    { label: 'Projects Delivered', value: 87, suffix: '+', order: 0 },
    { label: 'Happy Clients', value: 64, suffix: '+', order: 1 },
    { label: 'Years Experience', value: 9, suffix: '', order: 2 },
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
