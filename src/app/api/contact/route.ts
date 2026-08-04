import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** Send contact email via Resend if RESEND_API_KEY is configured.
 *  Always persists the message to the DB regardless of email success. */
async function sendEmailWithResend(payload: {
  name: string;
  email: string;
  service?: string;
  budget?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "no-key" };

  try {
    const fromEmail =
      process.env.RESEND_FROM || "onboarding@resend.dev";
    const toEmail = process.env.CONTACT_EMAIL || "hello@n2klabs.com";

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
        subject: `New inquiry from ${payload.name}${payload.service ? ` — ${payload.service}` : ""}`,
        html: `
          <div style="font-family: ui-sans-serif, system-ui; background:#0a0a0c; color:#f0ece6; padding:32px;">
            <h2 style="color:#00d4ff; margin:0 0 16px;">New Project Inquiry</h2>
            <table style="border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Name</td><td>${payload.name}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Email</td><td>${payload.email}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Service</td><td>${payload.service || "—"}</td></tr>
              <tr><td style="padding:6px 16px 6px 0; color:#8a8a93;">Budget</td><td>${payload.budget || "—"}</td></tr>
            </table>
            <h3 style="color:#f0ece6; margin:24px 0 8px;">Message</h3>
            <p style="line-height:1.6; color:#b0aca6; white-space:pre-wrap;">${payload.message}</p>
            <hr style="border:0; border-top:1px solid #2a2a30; margin:24px 0;" />
            <p style="color:#5a5a63; font-size:12px;">Sent from n2klabs.com contact form</p>
          </div>
        `,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, reason: `resend-${res.status}`, detail: t };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: "exception" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Persist to DB (graceful if DB unavailable)
    try {
      await db.contactMessage.create({
        data: {
          name: String(name).slice(0, 200),
          email: String(email).slice(0, 200),
          service: service ? String(service).slice(0, 100) : null,
          budget: budget ? String(budget).slice(0, 100) : null,
          message: String(message).slice(0, 5000),
        },
      });
    } catch {
      // DB optional
    }

    // Try email
    const emailRes = await sendEmailWithResend({
      name,
      email,
      service,
      budget,
      message,
    });

    return NextResponse.json({
      ok: true,
      emailSent: emailRes.ok,
      note: emailRes.ok ? undefined : "Message saved. We'll reply by email.",
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
