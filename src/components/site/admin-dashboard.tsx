"use client";

/**
 * AdminDashboard — full-page admin view, rendered at /?view=admin
 *
 * - Replaces the previous overlay-only AdminPanel.
 * - Dedicated URL (book-markable, shareable, presentable on a public screen).
 * - Header includes:
 *     • "Back to Site" link (returns to /)
 *     • Edit Mode / View Mode toggle (persisted to localStorage).
 *       In View Mode every Edit / Delete / Save / Add New / status control
 *       is hidden and the dashboard becomes a clean read-only gallery.
 * - Keyboard: Escape returns to site; Ctrl+Shift+A also opens this page.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowLeft,
  Eye,
  Pencil,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  TABS,
  type Tab,
  LoginPanel,
  ProjectsAdmin,
  TestimonialsAdmin,
  ServicesAdmin,
  MessagesAdmin,
  SettingsAdmin,
  PasswordAdmin,
} from "@/components/site/admin-shared";

const VIEW_MODE_KEY = "n2k-admin-view-mode";

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("projects");
  const [readOnly, setReadOnly] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(VIEW_MODE_KEY) === "1";
    } catch {
      return false;
    }
  });
  // Defer rendering of readOnly-dependent UI until after mount so the SSR
  // HTML and the first client render agree (no hydration mismatch), AND
  // the visible label/state is correct from the very first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const showReadOnly = mounted && readOnly;

  // Persist view-mode preference.
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, readOnly ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [readOnly]);

  // Check existing session.
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.user))
      .catch(() => {})
      .finally(() => setBootChecked(true));
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Escape returns to the site.
      if (e.key === "Escape") {
        window.location.href = "/";
      }
      // Ctrl+Shift+E toggles Edit / View mode (when authed).
      if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        setReadOnly((r) => !r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0c] text-[#f0ece6]">
      {/* ambient layers */}
      <div className="noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="pointer-events-none fixed inset-0 z-[1] grid-overlay opacity-20" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-64 bg-[radial-gradient(ellipse_at_top,rgba(var(--accent-rgb),0.10),transparent_70%)]" />

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0c]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          {/* left: back + brand */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              aria-label="Back to site"
              data-cursor="hover"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8a8a93] transition-colors hover:border-white/30 hover:text-[#f0ece6]"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.05)] text-[var(--accent)]">
                <Lock className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-[#f0ece6] flex items-center gap-2">
                  N2K Admin
                  {mounted && (
                    <span className="hidden sm:inline mono-label text-[var(--accent)]">
                      {showReadOnly ? "/ VIEW MODE" : "/ EDIT MODE"}
                    </span>
                  )}
                </div>
                <div className="mono-label text-[#9aa0a8]">
                  {authed ? "Authenticated" : "Locked"}
                </div>
              </div>
            </div>
          </div>

          {/* right: view-mode toggle + logout */}
          <div className="flex items-center gap-2">
            {authed && (
              <>
                <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/[0.02] p-1">
                  <button
                    onClick={() => setReadOnly(false)}
                    data-cursor="hover"
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      !readOnly
                        ? "bg-[var(--accent)] text-[#0a0a0c]"
                        : "text-[#8a8a93] hover:text-[#f0ece6]"
                    }`}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setReadOnly(true)}
                    data-cursor="hover"
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      readOnly
                        ? "bg-[var(--accent)] text-[#0a0a0c]"
                        : "text-[#8a8a93] hover:text-[#f0ece6]"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                </div>

                {/* compact toggle on mobile */}
                <button
                  onClick={() => setReadOnly((r) => !r)}
                  data-cursor="hover"
                  className="sm:hidden flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#8a8a93]"
                >
                  {readOnly ? <Eye className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                  {readOnly ? "View" : "Edit"}
                </button>

                <button
                  onClick={onLogout}
                  data-cursor="hover"
                  className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-[#8a8a93] transition-colors hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="relative z-10 flex-1 flex flex-col">
        {!bootChecked ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
          </div>
        ) : !authed ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
              <LoginPanel onLoggedIn={() => setAuthed(true)} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-[1600px] flex-1 gap-0"
          >
            {/* tabs sidebar */}
            <nav className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-56 shrink-0 flex-col border-r border-white/10 p-3 md:flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-cursor="hover"
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)]"
                      : "text-[#8a8a93] hover:bg-white/5 hover:text-[#f0ece6]"
                  }`}
                >
                  <t.icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              ))}
              <div className="mt-auto pt-4">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <div className="mono-label text-[var(--accent)] mb-1">TIP</div>
                  <p className="text-[11px] leading-relaxed text-[#8a8a93]">
                    Press{" "}
                    <kbd className="rounded border border-white/15 bg-white/5 px-1 py-0.5 text-[10px]">
                      Ctrl+Shift+E
                    </kbd>{" "}
                    to toggle Edit / View mode.
                  </p>
                </div>
              </div>
            </nav>

            {/* mobile tab strip */}
            <div className="md:hidden flex w-full overflow-x-auto border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-medium transition-colors ${
                    tab === t.id
                      ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                      : "text-[#8a8a93]"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-h-[calc(100vh-73px)]">
              {tab === "projects" && <ProjectsAdmin readOnly={readOnly} />}
              {tab === "testimonials" && <TestimonialsAdmin readOnly={readOnly} />}
              {tab === "services" && <ServicesAdmin readOnly={readOnly} />}
              {tab === "messages" && <MessagesAdmin readOnly={readOnly} />}
              {tab === "settings" && <SettingsAdmin readOnly={readOnly} />}
              {tab === "password" && <PasswordAdmin readOnly={readOnly} />}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
