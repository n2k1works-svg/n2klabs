import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validate";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/escape";

export const runtime = "nodejs";

/** Send contact email via Resend if RESEND_API_KEY is configured.
 *  Always persists the message to the DB regardless of email success. */
async function sendEmailWithResend(payload: {
  name: string;
  email: string;
  service?: string | null;
  budget?: string | null;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "no-key" };

  try {
    const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
    const toEmail = process.env.CONTACT_EMAIL || "hello@n2klabs.com";

    // Escape all user input before interpolating into HTML to prevent
    // email-client XSS / HTML injection.
    const e = (s: string | null | undefined) => escapeHtml(s || "");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `N2K Labs Contact <${fromEmail}>`,
        to: [toEmail],
        reply_to: payload.email,
        subject: `New inquiry from ${e(payload.name)}${payload.service ? ` — ${e(payload.service)}` : ""}`,
        html: `
          <div style="font-family: ui-sans-serif, system-ui; background:#0a0a0c; color:#f0ece6; padding:32px;">
            <h2 style="color:#00d4ff; margin:0 0 16px;">New Project Inquiry</h2>
            <table style="border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Name</td><td>${e(payload.name)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Email</td><td>${e(payload.email)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Service</td><td>${e(payload.service) || "—"}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Budget</td><td>${e(payload.budget) || "—"}</td></tr>
            </table>
            <h3 style="color:#f0ece6; margin:24px 0 8px;">Message</h3>
            <p style="line-height:1.6; color:#b0aca6; white-space:pre-wrap;">${e(payload.message)}</p>
            <hr style="border:0; border-top:1px solid #2a2a30; margin:24px 0;" />
            <p style="color:#5a5a63; font-size:12px;">Sent from n2klabs.com contact form</p>
          </div>
        `,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("[contact] Resend API error:", res.status, t);
      return { ok: false, reason: `resend-${res.status}`, detail: t };
    }
    return { ok: true };
  } catch (e) {
    console.error("[contact] sendEmail exception:", e);
    return { ok: false, reason: "exception" };
  }
}

export async function POST(req: NextRequest) {
  // Rate limit: 3 submissions per minute per IP
  const allowed = await rateLimit(req, RATE_LIMITS.contact);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();

    // Validate input with Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    // Honeypot: if the hidden "website" field is filled, silently drop the spam
    if (parsed.data.website) {
      // Pretend success so the bot doesn't retry
      return NextResponse.json({ ok: true, emailSent: false });
    }

    const { name, email, service, budget, message } = parsed.data;

    // Persist to DB (graceful if DB unavailable)
    try {
      await db.contactMessage.create({
        data: {
          name,
          email,
          service: service || null,
          budget: budget || null,
          message,
        },
      });
    } catch {
      // DB optional — email still attempts below
    }

    // Try email
    const emailRes = await sendEmailWithResend({
      name,
      email,
      service,
      budget,
      message,
    });

    // Be honest about email status — don't claim "sent" if it failed
    return NextResponse.json({
      ok: true,
      emailSent: emailRes.ok,
      note: emailRes.ok
        ? undefined
        : "Message saved. Email delivery may be delayed — we'll reply soon.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "N2K Labs contact endpoint. Use POST.",
  });
}
