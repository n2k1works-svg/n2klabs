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
- **SEO** — metadata, OpenGraph (dynamic 1200×630 image), JSON-LD structured data, sitemap, robots, security headers (CSP, HSTS).

## 🚀 Quick Deploy to Vercel (5 minutes)

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
3. Vercel auto-detects Next.js — **no build config needed** (see `vercel.json`).
4. Add these env vars (Vercel → Project → Settings → Environment Variables):

   | Key | Value | Required |
   |---|---|---|
   | `DATABASE_URL` | Turso libSQL connection string (see Step 3) | ✅ Yes |
   | `ADMIN_PASSWORD` | A strong password for the admin dashboard | ✅ Yes |
   | `ADMIN_EMAIL` | `n2k1works@gmail.com` (display only) | Recommended |
   | `RESEND_API_KEY` | from [resend.com](https://resend.com) | ✉️ Optional (email) |
   | `RESEND_FROM` | `onboarding@resend.dev` (or your verified domain) | ✉️ Optional |
   | `CONTACT_EMAIL` | `hello@n2klabs.com` (where inquiries are delivered) | ✉️ Optional |
   | `NEXT_PUBLIC_SITE_URL` | `https://n2klabs.com` (set when you add a custom domain) | ✉️ Optional |

5. Click **Deploy**. Live in ~90 seconds.

### Step 3 — Set up the production database (Turso)

> **Why Turso?** Vercel's serverless filesystem is read-only, so a local
> SQLite file would be wiped on every cold start. Turso is libSQL
> (SQLite-compatible) with an edge network — fast, free tier is generous,
> and the Prisma driver adapter (`@prisma/adapter-libsql`) handles the
> `libsql://` protocol natively.

1. Go to **[turso.tech](https://turso.tech)** → sign in → create a database.
   - Region: `aws-ap-northeast-1` (Tokyo) is closest to Fiji/South Pacific.
2. Go to the database's **Settings** page → copy the **URL** and generate an
   **auth token**.
3. Combine them into the connection string:
   ```
   libsql://<db-name>-<handle>.turso.io?authToken=<token>
   ```
4. Set `DATABASE_URL` to this value in:
   - Your local `.env` (copy `.env.example` → `.env` and fill in)
   - Vercel → Project → Settings → Environment Variables (all 3 environments)
5. Push the schema and seed the data:
   ```bash
   bun --env-file=.env run db:push     # creates all 7 tables in Turso
   bun --env-file=.env run db:seed     # seeds default services, projects, settings, stats
   ```
6. Commit + push → Vercel auto-redeploys.

### Step 4 — (Optional) Custom domain

Vercel → Project → Settings → Domains → add `n2klabs.com` → follow the DNS instructions (auto-HTTPS via Let's Encrypt). Then set `NEXT_PUBLIC_SITE_URL=https://n2klabs.com` in Vercel env vars so the sitemap, OG tags, and JSON-LD all point to the correct domain.

## 💻 Local Development

```bash
bun install
cp .env.example .env    # then fill in DATABASE_URL, ADMIN_PASSWORD, etc.
bun --env-file=.env run db:push   # creates tables in Turso
bun --env-file=.env run db:seed   # seeds demo content (create-only, safe to re-run)
bun run dev                       # starts on http://localhost:3000
```

**Admin access:** Set `ADMIN_PASSWORD` (and optionally `ADMIN_EMAIL`) in `.env`, then visit `http://localhost:3000/?view=admin`. The password is checked against the env var — no DB row needed. Change the password anytime by updating the env var.

> **Note:** Prisma 7 does NOT auto-load `.env` files. Always prefix Prisma
> commands with `bun --env-file=.env`. The Next.js dev server DOES auto-load
> `.env`, so `bun run dev` works without the prefix.

## 🎛 Admin Dashboard

- **URL:** `/?view=admin`
- **Entry points:**
  1. `Ctrl+Shift+A` keyboard shortcut from anywhere on the site.
  2. Direct URL navigation.
- **Edit Mode** (default): full CRUD — Add New, Edit, Delete, Save, status dropdowns.
- **View Mode:** click the "View" pill in the header (or press `Ctrl+Shift+E`) to hide every Edit/Delete/Save/Add New control. Settings inputs become disabled, the password form is replaced with a hidden message, and message status dropdowns become colored badge pills. Preference persists across reloads.
- **Back to Site:** click the ← arrow in the header or press `Escape`.

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Turso (libSQL) + Prisma 7 ORM |
| Auth | Custom env-var + SHA-256 session cookie (database-free) |
| Animation | Framer Motion |
| Email | Resend |
| Analytics | Vercel Analytics |
| Icons | Lucide |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home + admin route (?view=admin)
│   ├── layout.tsx                # Root layout, fonts, Toaster
│   ├── globals.css               # Cyberpunk theme + scroll-color CSS vars
│   ├── error.tsx / not-found.tsx / loading.tsx / global-error.tsx
│   ├── opengraph-image.tsx        # Dynamic 1200×630 OG image
│   ├── api/                      # auth, contact, projects, services, etc.
│   │   ├── health/               # /api/health — DB connectivity check
│   │   ├── upload/               # /api/upload — admin image uploads
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
│   ├── db.ts                     # Prisma 7 client + Turso driver adapter
│   ├── auth.ts                   # Custom env-var auth + session cookie
│   ├── validate.ts               # Zod schemas for all API routes
│   ├── rate-limit.ts             # In-memory rate limiter
│   ├── escape.ts                 # HTML escape for email bodies
│   ├── data.ts                   # Server-side data fetchers (with DB fallbacks)
│   └── utils.ts
└── prisma/
    ├── schema.prisma             # 7 models: AdminUser, Project, Service, Testimonial, Stat, Setting, ContactMessage
    └── seed.ts                   # Demo content (create-only, safe to re-run)
```

## 🔄 Auto-Deploy Workflow

Once connected to Vercel:

1. Make changes locally (in this sandbox or your local clone).
2. `git add -A && git commit -m "your message"` → `git push`.
3. Vercel auto-builds + deploys in ~90 seconds.
4. Preview deployments are created automatically for every PR.

## 📝 License

Proprietary — © N2K Labs. All rights reserved.
