"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  FolderKanban,
  MessageSquare,
  Wrench,
  Settings,
  KeyRound,
  Plus,
  Trash2,
  Save,
  Loader2,
  Check,
  Upload,
  Star,
  ExternalLink,
} from "lucide-react";

type Tab = "projects" | "testimonials" | "services" | "messages" | "settings" | "password";

const TABS: { id: Tab; label: string; icon: typeof Lock }[] = [
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "services", label: "Services", icon: Wrench },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "password", label: "Password", icon: KeyRound },
];

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("projects");

  // keyboard shortcut Ctrl+Shift+A
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const onOpen = () => setOpen(true);
    window.addEventListener("n2k-open-admin", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("n2k-open-admin", onOpen);
    };
  }, []);

  // check existing session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.user))
      .catch(() => {})
      .finally(() => setBootChecked(true));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-0 grid-overlay opacity-20" />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 ml-auto h-full w-full max-w-6xl bg-[#0e0e12] border-l border-white/10 flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/5 text-[#00d4ff]">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-[#f0ece6]">N2K Admin</div>
                  <div className="mono-label text-[#9aa0a8]">
                    {authed ? "Authenticated" : "Locked"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {authed && (
                  <button
                    onClick={onLogout}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-[#8a8a93] transition-colors hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"
                  >
                    Logout
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close admin"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8a8a93] transition-colors hover:border-white/30 hover:text-[#f0ece6]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-hidden">
              {!bootChecked ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#00d4ff]" />
                </div>
              ) : !authed ? (
                <LoginPanel onLoggedIn={() => setAuthed(true)} />
              ) : (
                <div className="flex h-full">
                  {/* tabs */}
                  <div className="w-16 md:w-56 shrink-0 border-r border-white/10 p-2 md:p-3 space-y-1 overflow-y-auto">
                    {TABS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          tab === t.id
                            ? "bg-[#00d4ff]/10 text-[#00d4ff]"
                            : "text-[#8a8a93] hover:bg-white/5 hover:text-[#f0ece6]"
                        }`}
                      >
                        <t.icon className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">{t.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* content */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {tab === "projects" && <ProjectsAdmin />}
                    {tab === "testimonials" && <TestimonialsAdmin />}
                    {tab === "services" && <ServicesAdmin />}
                    {tab === "messages" && <MessagesAdmin />}
                    {tab === "settings" && <SettingsAdmin />}
                    {tab === "password" && <PasswordAdmin />}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ LOGIN ============ */
function LoginPanel({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("admin@n2klabs.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLoggedIn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mono-label text-[#00d4ff] mb-2">{"SECURE ACCESS"}</div>
          <h2 className="text-3xl font-black text-[#f0ece6]">Admin Console</h2>
          <p className="mt-2 text-sm text-[#8a8a93]">
            Default: admin@n2klabs.com / n2k-admin-2024
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mono-label text-[#8a8a93] mb-2 block">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="n2k-input"
              type="email"
              required
            />
          </div>
          <div>
            <label className="mono-label text-[#8a8a93] mb-2 block">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="n2k-input"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          {err && <p className="text-sm text-[#ff4d5e]">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-shine flex w-full items-center justify-center gap-2 rounded-full bg-[#f0ece6] py-3 text-sm font-semibold text-[#0a0a0c] transition-shadow hover:shadow-[0_0_24px_rgba(240,236,230,0.4)] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Unlock
          </button>
        </form>
      </div>
      <style jsx>{`
        :global(.n2k-input) {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.625rem;
          padding: 0.65rem 0.9rem;
          color: #f0ece6;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.n2k-input:focus) {
          border-color: rgba(0, 212, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

/* ============ shared hooks ============ */
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  return { data, loading, err, reload, setData };
}

function Toolbar({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="mono-label text-[#00d4ff] mb-1">{"MANAGE"}</div>
        <h2 className="text-2xl font-black text-[#f0ece6]">{title}</h2>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-4 py-2 text-xs font-semibold text-[#0a0a0c] transition-shadow hover:shadow-[0_0_20px_rgba(240,236,230,0.4)]"
        >
          <Plus className="h-3.5 w-3.5" /> Add New
        </button>
      )}
    </div>
  );
}

function ItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#121218] p-4">{children}</div>
  );
}

const inputCls =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f0ece6] outline-none focus:border-[#00d4ff]/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono-label text-[#9aa0a8] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

/* ============ PROJECTS ============ */
type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  url?: string | null;
  image?: string | null;
  tags?: string | null;
  featured: boolean;
  order: number;
};

function ProjectsAdmin() {
  const { data, loading, reload, setData } = useFetch<{ projects: Project[] }>("/api/projects");
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const onSave = async (p: Project) => {
    setSaving(true);
    try {
      const tags = typeof p.tags === "string" ? JSON.parse(p.tags || "[]") : p.tags || [];
      const body = { ...p, tags };
      const method = p.id ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("save failed");
      setEditing(null);
      reload();
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    reload();
  };

  if (loading) return <Loader />;
  const projects = data?.projects || [];

  return (
    <div>
      <Toolbar title="Projects" onAdd={() => setEditing({} as Project)} />
      {editing && (
        <ProjectEditor
          project={editing}
          saving={saving}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      )}
      <div className="space-y-3">
        {projects.map((p) => (
          <ItemCard key={p.id}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FolderKanban className="h-5 w-5 text-[#00d4ff]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#f0ece6] truncate">{p.title}</span>
                  {p.featured && (
                    <span className="rounded px-1.5 py-0.5 text-[9px] bg-[#00d4ff]/10 text-[#00d4ff] font-mono">
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="mono-label text-[#9aa0a8] mt-0.5">
                  {p.client} · {p.category}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="rounded-lg border border-white/10 p-1.5 text-[#8a8a93] hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </ItemCard>
        ))}
        {projects.length === 0 && <Empty label="No projects yet" />}
      </div>
    </div>
  );
}

function ProjectEditor({
  project,
  saving,
  onSave,
  onCancel,
}: {
  project: Project;
  saving: boolean;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Project>(project);
  const set = (k: keyof Project, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const tagsStr =
    typeof f.tags === "string"
      ? (() => {
          try {
            return JSON.parse(f.tags || "[]").join(", ");
          } catch {
            return "";
          }
        })()
      : "";

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (d.url) set("image", d.url);
  };

  return (
    <div className="mb-6 rounded-xl border border-[#00d4ff]/30 bg-[#0a0a0c]/50 p-5">
      <div className="mono-label text-[#00d4ff] mb-4">
        {project.id ? "EDIT PROJECT" : "NEW PROJECT"}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Title"><input className={inputCls} value={f.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Client"><input className={inputCls} value={f.client || ""} onChange={(e) => set("client", e.target.value)} /></Field>
        <Field label="Category"><input className={inputCls} value={f.category || ""} onChange={(e) => set("category", e.target.value)} placeholder="Web Development" /></Field>
        <Field label="URL"><input className={inputCls} value={f.url || ""} onChange={(e) => set("url", e.target.value)} placeholder="https://..." /></Field>
        <Field label="Order"><input className={inputCls} type="number" value={f.order || 0} onChange={(e) => set("order", Number(e.target.value))} /></Field>
        <Field label="Featured">
          <select className={inputCls} value={f.featured ? "1" : "0"} onChange={(e) => set("featured", e.target.value === "1")}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </Field>
      </div>
      <div className="mt-3 space-y-3">
        <Field label="Description"><textarea className={inputCls} rows={2} value={f.description || ""} onChange={(e) => set("description", e.target.value)} /></Field>
        <Field label="Challenge"><textarea className={inputCls} rows={2} value={f.challenge || ""} onChange={(e) => set("challenge", e.target.value)} /></Field>
        <Field label="Solution"><textarea className={inputCls} rows={2} value={f.solution || ""} onChange={(e) => set("solution", e.target.value)} /></Field>
        <Field label="Result"><textarea className={inputCls} rows={2} value={f.result || ""} onChange={(e) => set("result", e.target.value)} /></Field>
        <Field label="Tags (comma separated)"><input className={inputCls} defaultValue={tagsStr} onBlur={(e) => set("tags", JSON.stringify(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)))} /></Field>
        <Field label="Image">
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="hidden" id="proj-img" />
            <label htmlFor="proj-img" className="cursor-pointer flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#8a8a93] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]">
              <Upload className="h-3.5 w-3.5" /> Upload
            </label>
            {f.image && <span className="text-xs text-[#8a8a93] truncate">{f.image}</span>}
            {f.image && (
              <button onClick={() => set("image", null)} className="text-xs text-[#ff4d5e]">remove</button>
            )}
          </div>
        </Field>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onSave(f)} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
        </button>
        <button onClick={onCancel} className="rounded-full border border-white/10 px-5 py-2 text-xs text-[#8a8a93] hover:text-[#f0ece6]">Cancel</button>
      </div>
    </div>
  );
}

/* ============ TESTIMONIALS ============ */
type Testimonial = {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  quote: string;
  rating: number;
  order: number;
};

function TestimonialsAdmin() {
  const { data, loading, reload } = useFetch<{ testimonials: Testimonial[] }>("/api/testimonials");
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const onSave = async (t: Testimonial) => {
    setSaving(true);
    try {
      const method = t.id ? "PUT" : "POST";
      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (!res.ok) throw new Error();
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    reload();
  };

  if (loading) return <Loader />;
  const items = data?.testimonials || [];

  return (
    <div>
      <Toolbar title="Testimonials" onAdd={() => setEditing({} as Testimonial)} />
      {editing && (
        <div className="mb-6 rounded-xl border border-[#00d4ff]/30 bg-[#0a0a0c]/50 p-5 space-y-3">
          <div className="mono-label text-[#00d4ff]">{editing.id ? "EDIT" : "NEW"}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name"><input className={inputCls} value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Role"><input className={inputCls} value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></Field>
            <Field label="Company"><input className={inputCls} value={editing.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></Field>
            <Field label="Rating"><input type="number" min={1} max={5} className={inputCls} value={editing.rating || 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Quote"><textarea className={inputCls} rows={3} value={editing.quote || ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></Field>
          <div className="flex gap-2">
            <button onClick={() => onSave(editing)} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
            </button>
            <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-5 py-2 text-xs text-[#8a8a93]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items.map((t) => (
          <ItemCard key={t.id}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#f0ece6]">{t.name}</div>
                <div className="mono-label text-[#9aa0a8]">{t.role}{t.company ? ` · ${t.company}` : ""}</div>
                <p className="mt-2 text-sm text-[#8a8a93] line-clamp-2">{t.quote}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(t)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]">Edit</button>
                <button onClick={() => onDelete(t.id)} className="rounded-lg border border-white/10 p-1.5 text-[#8a8a93] hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No testimonials yet" />}
      </div>
    </div>
  );
}

/* ============ SERVICES ============ */
type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features?: string | null;
  icon?: string | null;
  order: number;
};

function ServicesAdmin() {
  const { data, loading, reload } = useFetch<{ services: Service[] }>("/api/services");
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  const onSave = async (s: Service) => {
    setSaving(true);
    try {
      const features = s.features ? (typeof s.features === "string" ? JSON.parse(s.features) : s.features) : [];
      const body = { ...s, features };
      const method = s.id ? "PUT" : "POST";
      const res = await fetch("/api/services", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setEditing(null);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/services", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    reload();
  };

  if (loading) return <Loader />;
  const items = data?.services || [];

  return (
    <div>
      <Toolbar title="Services" onAdd={() => setEditing({} as Service)} />
      {editing && (
        <div className="mb-6 rounded-xl border border-[#00d4ff]/30 bg-[#0a0a0c]/50 p-5 space-y-3">
          <div className="mono-label text-[#00d4ff]">{editing.id ? "EDIT" : "NEW"}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title"><input className={inputCls} value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Icon (lucide name)"><input className={inputCls} value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="Code2" /></Field>
          </div>
          <Field label="Description"><textarea className={inputCls} rows={2} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Features (comma separated)"><input className={inputCls} defaultValue={(() => { try { return JSON.parse(editing.features || "[]").join(", "); } catch { return ""; } })()} onBlur={(e) => setEditing({ ...editing, features: JSON.stringify(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)) })} /></Field>
          <div className="flex gap-2">
            <button onClick={() => onSave(editing)} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save</button>
            <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-5 py-2 text-xs text-[#8a8a93]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items.map((s) => (
          <ItemCard key={s.id}>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#f0ece6]">{s.title}</div>
                <div className="mono-label text-[#9aa0a8] mt-0.5">{s.icon || "—"}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(s)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]">Edit</button>
                <button onClick={() => onDelete(s.id)} className="rounded-lg border border-white/10 p-1.5 text-[#8a8a93] hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No services yet" />}
      </div>
    </div>
  );
}

/* ============ MESSAGES ============ */
type Message = {
  id: string;
  name: string;
  email: string;
  service?: string | null;
  budget?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

function MessagesAdmin() {
  const { data, loading, reload } = useFetch<{ messages: Message[] }>("/api/admin/messages");

  const setStatus = async (id: string, status: string) => {
    await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    reload();
  };

  if (loading) return <Loader />;
  const items = data?.messages || [];

  return (
    <div>
      <Toolbar title="Messages" />
      <div className="space-y-3">
        {items.map((m) => (
          <ItemCard key={m.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#f0ece6]">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-xs text-[#00d4ff] hover:underline flex items-center gap-1">
                    {m.email} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="mono-label text-[#9aa0a8] mt-1">
                  {m.service || "—"} · {m.budget || "—"} · {new Date(m.createdAt).toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-[#b0aca6]">{m.message}</p>
              </div>
              <select
                value={m.status}
                onChange={(e) => setStatus(m.id, e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1 text-xs text-[#f0ece6]"
              >
                <option value="new">new</option>
                <option value="read">read</option>
                <option value="replied">replied</option>
                <option value="archived">archived</option>
              </select>
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No messages yet" />}
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */
const SETTING_FIELDS = [
  { key: "contact.email", label: "Contact Email" },
  { key: "contact.phone", label: "Contact Phone" },
  { key: "contact.location", label: "Contact Location" },
  { key: "social.twitter", label: "Twitter URL" },
  { key: "social.instagram", label: "Instagram URL" },
  { key: "social.website", label: "Website URL" },
  { key: "social.github", label: "GitHub URL" },
  { key: "site.tagline", label: "Site Tagline" },
  { key: "site.description", label: "Site Description" },
];

function SettingsAdmin() {
  const { data, loading } = useFetch<{ settings: Record<string, string> }>("/api/settings");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.settings) setVals(data.settings);
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: vals }) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Toolbar title="Settings" />
      <div className="space-y-4 max-w-2xl">
        {SETTING_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              className={inputCls}
              value={vals[f.key] || ""}
              onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          </Field>
        ))}
        <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2.5 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? "Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

/* ============ PASSWORD ============ */
function PasswordAdmin() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: cur, newPassword: next }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "failed");
      setMsg({ ok: true, text: "Password updated successfully." });
      setCur(""); setNext("");
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toolbar title="Change Password" />
      <form onSubmit={submit} className="space-y-4 max-w-sm">
        <Field label="Current Password"><input type="password" className={inputCls} value={cur} onChange={(e) => setCur(e.target.value)} required /></Field>
        <Field label="New Password"><input type="password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} required /></Field>
        {msg && <p className={`text-sm ${msg.ok ? "text-[#00d4ff]" : "text-[#ff4d5e]"}`}>{msg.text}</p>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2.5 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />} Update Password
        </button>
      </form>
    </div>
  );
}

/* ============ helpers ============ */
function Loader() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#00d4ff]" />
    </div>
  );
}
function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-12 text-center mono-label text-[#9aa0a8]">
      {label}
    </div>
  );
}
