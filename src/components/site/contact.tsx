"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { SettingsMap } from "@/lib/data";

const SERVICES = [
  "Web Development",
  "UI/UX Design",
  "E-Commerce Solutions",
  "Digital Strategy",
  "Brand Identity",
  "SEO & Analytics",
  "Other",
];
const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k+", "Not sure yet"];

/**
 * Contact form — POSTs to /api/contact which sends email via Resend.
 * Get a free API key at https://resend.com and add RESEND_API_KEY to .env
 * (locally) and to Vercel environment variables (production).
 */
export function Contact({ settings }: { settings: SettingsMap }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", service: "", budget: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const email = settings["contact.email"] || "hello@n2klabs.com";

  return (
    <section id="contact" className="cv-auto contain-paint relative py-24 md:py-36 bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(var(--accent-rgb),0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionHeading
          index="/ 06"
          kicker="Start a Project"
          title={
            <>
              Let&apos;s build
              <br />
              <span className="text-gradient-cyan">something exceptional.</span>
            </>
          }
          description="Tell us about your project. We'll get back within one business day."
        />

        <div className="mt-16 mx-auto max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            onSubmit={onSubmit}
            className="glass relative rounded-2xl p-6 md:p-8 hud-corners"
          >
            <div className="mono-label text-[var(--accent)] mb-6">{"INQUIRY FORM"}</div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Your Name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Doe"
                  className="n2k-input"
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@company.com"
                  className="n2k-input"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Field label="Service">
                <select
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                  className="n2k-input"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Budget Range">
                <select
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="n2k-input"
                >
                  <option value="">Select a budget</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Project Details" required>
              <textarea
                required
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={6}
                placeholder="Tell us about your goals, timeline, and what success looks like..."
                className="n2k-input resize-none"
              />
            </Field>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              data-cursor="hover"
              className="btn-shine group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f0ece6] px-6 py-4 text-sm font-semibold text-[#0a0a0c] transition-all hover:shadow-[0_0_30px_rgba(240,236,230,0.4)] disabled:opacity-60"
            >
              {status === "loading" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Message Sent
                </>
              )}
              {(status === "idle" || status === "error") && (
                <>
                  Send Inquiry
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {status === "error" && (
              <p className="mt-3 text-center text-sm text-[#ff4d5e]">
                Something went wrong. Please email us directly at {email}.
              </p>
            )}
          </motion.form>
        </div>
      </div>

      <style jsx>{`
        :global(.n2k-input) {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.625rem;
          padding: 0.75rem 1rem;
          color: #f0ece6;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        :global(.n2k-input::placeholder) {
          color: #5a5a63;
        }
        :global(.n2k-input:focus) {
          border-color: rgba(var(--accent-rgb), 0.5);
          background: rgba(var(--accent-rgb), 0.03);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
        }
        :global(.n2k-input option) {
          background: #121218;
          color: #f0ece6;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mono-label text-[#8a8a93] mb-2 block">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </span>
      {children}
    </label>
  );
}
