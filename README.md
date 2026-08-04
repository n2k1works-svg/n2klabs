# N2K Labs — Cyberpunk Agency Website

A premium, world-class cyberpunk agency website for **N2K Labs**, built with Next.js 16, TypeScript, Tailwind CSS 4, Prisma, and Framer Motion. Features a scroll-driven Heaven → Earth → Hell color transition, 3D interactive laptop, full CMS admin dashboard, and Resend email integration.

## ✨ Features

- **Single-page marketing site** — Hero, Stats, About, Services, Portfolio (with 3D interactive laptop), Process, Testimonials, Contact, sticky Footer.
- **Scroll color transition** — accent shifts blue (Heaven) → gold (Earth) → red (Hell) as you scroll, retinting the entire UI.
- **Admin dashboard** at `/?view=admin` — full CMS for Projects, Testimonials, Services, Messages, Settings, Password.
- **Edit / View mode toggle** — hide all editing controls for a clean, presentable read-only view (persisted to localStorage).
- **3D interactive laptop** — auto-rotates by default; toggle to MANUAL mode to tilt it with your mouse via a HUD crosshair.
- **Custom cursor, scroll progress, live clock, magnetic buttons, preloader**.
- **Resend email** integration on the contact form.
- **Image upload** for project screenshots.
- **SEO** — metadata, OpenGraph, sitemap, robots.

## 🚀 Quick Deploy to Vercel (5 minutes)

This is the recommended path — same workflow as our Elux Designs site.

### Step 1 — Push to GitHub

```bash
# from /home/z/my-project
gh repo create n2klabs --public --source=. --remote=origin --push
```

(If you don't have `gh` CLI installed, create the repo on github.com first, then:)

```bash
git remote add origin git@github.com:YOUR_USERNAME/n2klabs.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Pick your `n2klabs` GitHub repo.
3. Vercel auto-detects Next.js — **no build config needed**.
4. Add these env vars (Vercel → Project → Settings → Environment Variables):

   | Key | Value | Required |
   |---|---|---|
   | `DATABASE_URL` | Neon Postgres connection string (see below) | ✅ Yes |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` | ✅ Yes |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` (update after first deploy) | ✅ Yes |
   | `RESEND_API_KEY` | from [resend.com](https://resend.com) | ✉️ Optional (email) |
   | `RESEND_FROM` | `N2K Labs <hello@n2klabs.com>` | ✉️ Optional |
   | `CONTACT_EMAIL` | `hello@n2klabs.com` | ✉️ Optional |

5. Click **Deploy**. Live in ~90 seconds.

### Step 3 — Set up the production database (Neon Postgres)

> ⚠️ **Required for production.** SQLite (the dev default) is a local file — Vercel's serverless filesystem is read-only, so your data would be wiped on every cold start. Use Postgres for any persistent data.

1. Go to **[neon.tech](https://neon.tech)** → sign in with GitHub → create a project (region: `ap-southeast-1` for South Pacific).
2. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
3. In `prisma/schema.prisma`, change line 9:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Set `DATABASE_URL` in your `.env` locally → run:
   ```bash
   bun run db:push     # creates tables in Postgres
   bunx tsx prisma/seed.ts   # seeds admin user + demo content
   ```
5. Commit + push → Vercel auto-redeploys with the new schema.

### Step 4 — (Optional) Custom domain

Vercel → Project → Settings → Domains → add `n2klabs.com` → follow the DNS instructions (auto-HTTPS via Let's Encrypt).

## 💻 Local Development

```bash
bun install
bun run db:push     # creates SQLite db/custom.db
bunx tsx prisma/seed.ts   # optional: seed demo data (requires ADMIN_PASSWORD env var — see below)
bun run dev         # starts on http://localhost:3000
```

**Admin credentials:** Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` (see `.env.example`), then run `bunx tsx prisma/seed.ts` to seed the admin user. Change the password anytime in production via `/?view=admin` → Password tab.

## 🎛 Admin Dashboard

- **URL:** `/?view=admin`
- **Entry points:**
  1. Footer "Admin Access" link.
  2. `Ctrl+Shift+A` keyboard shortcut from anywhere on the site.
  3. Direct URL navigation.
- **Edit Mode** (default): full CRUD — Add New, Edit, Delete, Save, status dropdowns.
- **View Mode:** click the "View" pill in the header (or press `Ctrl+Shift+E`) to hide every Edit/Delete/Save/Add New control. Settings inputs become disabled, the password form is replaced with a hidden message, and message status dropdowns become colored badge pills. Preference persists across reloads.
- **Back to Site:** click the ← arrow in the header or press `Escape`.

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM (SQLite dev / Postgres prod) |
| Auth | NextAuth.js v4 (cookie-based) |
| Animation | Framer Motion |
| Email | Resend |
| Icons | Lucide |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home + admin route (?view=admin)
│   ├── layout.tsx                # Root layout, fonts, Toaster
│   ├── globals.css               # Cyberpunk theme + scroll-color CSS vars
│   ├── api/                      # auth, contact, projects, services, etc.
│   ├── sitemap.ts / robots.ts
├── components/
│   ├── site/                     # All N2K-specific components
│   │   ├── hero.tsx
│   │   ├── navigation.tsx
│   │   ├── admin-dashboard.tsx   # Full-page admin
│   │   ├── admin-shared.tsx      # Admin tab components (readOnly-aware)
│   │   ├── scroll-color-transition.tsx
│   │   ├── laptop-3d.tsx
│   │   └── ...
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── data.ts                   # Server-side data fetchers
│   └── utils.ts
└── prisma/
    ├── schema.prisma             # 7 models: AdminUser, Project, Service, Testimonial, Stat, Setting, ContactMessage
    └── seed.ts                   # Demo content + admin user
```

## 🔄 Auto-Deploy Workflow

Once connected to Vercel:

1. Make changes locally (in this sandbox or your local clone).
2. `git add -A && git commit -m "your message"` → `git push`.
3. Vercel auto-builds + deploys in ~90 seconds.
4. Preview deployments are created automatically for every PR.

## 📝 License

Proprietary — © N2K Labs. All rights reserved.
