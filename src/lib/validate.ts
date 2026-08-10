import { z } from "zod";

/**
 * Zod validation schemas for all API routes.
 *
 * These are used to validate incoming request bodies before they touch the
 * database. This prevents:
 *   - Type coercion bugs (null becoming "null", objects becoming "[object Object]")
 *   - Oversized payloads DOSing the DB (string length caps)
 *   - Invalid enum values (e.g., message status)
 *   - SQL/HTML injection via Prisma (Prisma parameterizes, but unvalidated
 *     strings can still cause unexpected behavior in JSON columns)
 *
 * Usage in a route:
 *   const parsed = projectCreateSchema.safeParse(body);
 *   if (!parsed.success) {
 *     return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
 *   }
 *   // parsed.data is now fully typed and safe
 */

// ── Contact form ──────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z
    .string()
    .min(1, "Email is required")
    .max(200)
    .email("Invalid email address"),
  service: z.string().max(100).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  message: z.string().min(1, "Message is required").max(5000),
  // Honeypot field — bots fill this in, humans don't see it.
  // Accept any string (don't reject); we check non-empty in the handler
  // and silently drop the submission.
  website: z.string().max(2000).optional(),
});

// ── Auth ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  password: z.string().min(1, "Password required").max(1000),
});

// ── Projects ─────────────────────────────────────────────────
export const projectCreateSchema = z.object({
  title: z.string().min(1).max(500),
  client: z.string().min(1).max(300),
  category: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  challenge: z.string().max(5000).optional().nullable(),
  solution: z.string().max(5000).optional().nullable(),
  result: z.string().max(5000).optional().nullable(),
  url: z.string().url().max(2000).optional().nullable(),
  image: z.string().max(10_000_000).optional().nullable(), // base64 data URL can be large
  images: z.array(z.string().max(10_000_000)).max(20).optional().nullable(),
  tags: z.array(z.string().max(100)).max(50).optional().nullable(),
  gallery: z.array(z.string().max(10_000_000)).max(20).optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().min(-9999).max(9999).optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const projectDeleteSchema = z.object({
  id: z.string().min(1),
});

// ── Services ─────────────────────────────────────────────────
export const serviceCreateSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z
    .string()
    .max(300)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, with hyphens")
    .optional(),
  description: z.string().min(1).max(5000),
  features: z.array(z.string().max(300)).max(50).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  order: z.number().int().min(-9999).max(9999).optional(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const serviceDeleteSchema = z.object({
  id: z.string().min(1),
});

// ── Testimonials ─────────────────────────────────────────────
export const testimonialCreateSchema = z.object({
  name: z.string().min(1).max(300),
  role: z.string().min(1).max(300),
  company: z.string().max(300).optional().nullable(),
  quote: z.string().min(1).max(5000),
  rating: z.number().int().min(1).max(5).optional(),
  avatar: z.string().max(10_000_000).optional().nullable(),
  order: z.number().int().min(-9999).max(9999).optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const testimonialDeleteSchema = z.object({
  id: z.string().min(1),
});

// ── Stats ────────────────────────────────────────────────────
export const statCreateSchema = z.object({
  label: z.string().min(1).max(300),
  value: z.number().int().min(-999999999).max(999999999),
  suffix: z.string().max(20).optional().nullable(),
  order: z.number().int().min(-9999).max(9999).optional(),
});

export const statUpdateSchema = statCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const statDeleteSchema = z.object({
  id: z.string().min(1),
});

// ── Settings ─────────────────────────────────────────────────
export const settingsUpdateSchema = z.object({
  settings: z.record(z.string(), z.string().max(10_000)).refine(
    (val) => Object.keys(val).length <= 200,
    "Too many settings at once (max 200)",
  ),
});

// ── Admin messages ───────────────────────────────────────────
export const messageUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "read", "replied", "archived"]),
});

// ── Password change ──────────────────────────────────────────
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(1000),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(1000),
});
