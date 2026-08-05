"use client";

/**
 * Admin shared engine — used by both the full-page AdminDashboard
 * (/?view=admin) and (legacy) overlay entry points.
 *
 * Every content tab accepts an optional `readOnly` prop. When true the
 * Edit / Delete / Save / Add New controls are hidden and the dashboard
 * becomes a clean, presentable, read-only view (useful for showing the
 * admin on a public screen without risk of accidental edits).
 */

import { useCallback, useEffect, useState } from "react";
import {
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

/* ============ tab definitions ============ */
export type Tab = "projects" | "testimonials" | "services" | "messages" | "settings" | "password";

export const TABS: { id: Tab; label: string; icon: typeof Lock }[] = [
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "services", label: "Services", icon: Wrench },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "password", label: "Password", icon: KeyRound },
];

/* ============ shared hooks ============ */
export function useFetch<T>(url: string) {
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

/* ============ shared primitives ============ */
export const inputCls =
  "w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f0ece6] outline-none focus:border-[rgba(var(--accent-rgb),0.5)]";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono-label text-[#9aa0a8] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function ItemCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-white/10 bg-[#121218] p-4">{children}</div>;
}

export function Toolbar({
  title,
  onAdd,
  readOnly,
}: {
  title: string;
  onAdd?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="mono-label text-[var(--accent)] mb-1">{"MANAGE"}</div>
        <h2 className="text-2xl font-black text-[#f0ece6]">{title}</h2>
      </div>
      {onAdd && !readOnly && (
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

export function Loader() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
    </div>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 py-12 text-center mono-label text-[#9aa0a8]">
      {label}
    </div>
  );
}

export function ReadOnlyBanner() {
  return (
    <div className="mb-4 rounded-lg border border-[rgba(var(--accent-rgb),0.25)] bg-[rgba(var(--accent-rgb),0.05)] px-4 py-2.5 text-xs text-[var(--accent)]">
      <span className="mono-label">VIEW MODE</span> — editing controls are hidden. Switch to Edit
      Mode in the header to make changes.
    </div>
  );
}

/* ============ LOGIN ============ */
export function LoginPanel({ onLoggedIn }: { onLoggedIn: () => void }) {
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
        body: JSON.stringify({ password }),
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
          <div className="mono-label text-[var(--accent)] mb-2">{"SECURE ACCESS"}</div>
          <h2 className="text-3xl font-black text-[#f0ece6]">Admin Console</h2>
          <p className="mt-2 text-sm text-[#8a8a93]">
            Authorized personnel only.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mono-label text-[#8a8a93] mb-2 block">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="n2k-input"
              type="password"
              required
              autoFocus
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
          border-color: rgba(var(--accent-rgb), 0.5);
          box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
        }
      `}</style>
    </div>
  );
}

/* ============ PROJECTS ============ */
export type Project = {
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

export function ProjectsAdmin({ readOnly }: { readOnly?: boolean }) {
  const { data, loading, reload } = useFetch<{ projects: Project[] }>("/api/projects");
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
      {readOnly && <ReadOnlyBanner />}
      <Toolbar
        title="Projects"
        readOnly={readOnly}
        onAdd={() => setEditing({} as Project)}
      />
      {editing && !readOnly && (
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
              <div className="h-12 w-12 shrink-0 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.2)] flex items-center justify-center overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FolderKanban className="h-5 w-5 text-[var(--accent)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#f0ece6] truncate">{p.title}</span>
                  {p.featured && (
                    <span className="rounded px-1.5 py-0.5 text-[9px] bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] font-mono">
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="mono-label text-[#9aa0a8] mt-0.5">
                  {p.client} · {p.category}
                </div>
                {!readOnly && p.description && (
                  <p className="mt-1 text-xs text-[#8a8a93] line-clamp-1">{p.description}</p>
                )}
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[rgba(var(--accent-rgb),0.5)] hover:text-[var(--accent)]"
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
              )}
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
    <div className="mb-6 rounded-xl border border-[rgba(var(--accent-rgb),0.3)] bg-[#0a0a0c]/50 p-5">
      <div className="mono-label text-[var(--accent)] mb-4">
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
            <label htmlFor="proj-img" className="cursor-pointer flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#8a8a93] hover:border-[rgba(var(--accent-rgb),0.5)] hover:text-[var(--accent)]">
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
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  quote: string;
  rating: number;
  order: number;
};

export function TestimonialsAdmin({ readOnly }: { readOnly?: boolean }) {
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
      {readOnly && <ReadOnlyBanner />}
      <Toolbar title="Testimonials" readOnly={readOnly} onAdd={() => setEditing({} as Testimonial)} />
      {editing && !readOnly && (
        <div className="mb-6 rounded-xl border border-[rgba(var(--accent-rgb),0.3)] bg-[#0a0a0c]/50 p-5 space-y-3">
          <div className="mono-label text-[var(--accent)]">{editing.id ? "EDIT" : "NEW"}</div>
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
              {!readOnly && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(t)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[rgba(var(--accent-rgb),0.5)] hover:text-[var(--accent)]">Edit</button>
                  <button onClick={() => onDelete(t.id)} className="rounded-lg border border-white/10 p-1.5 text-[#8a8a93] hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No testimonials yet" />}
      </div>
    </div>
  );
}

/* ============ SERVICES ============ */
export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  features?: string | null;
  icon?: string | null;
  order: number;
};

export function ServicesAdmin({ readOnly }: { readOnly?: boolean }) {
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
      {readOnly && <ReadOnlyBanner />}
      <Toolbar title="Services" readOnly={readOnly} onAdd={() => setEditing({} as Service)} />
      {editing && !readOnly && (
        <div className="mb-6 rounded-xl border border-[rgba(var(--accent-rgb),0.3)] bg-[#0a0a0c]/50 p-5 space-y-3">
          <div className="mono-label text-[var(--accent)]">{editing.id ? "EDIT" : "NEW"}</div>
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
                {readOnly && s.description && (
                  <p className="mt-1 text-xs text-[#8a8a93] line-clamp-2">{s.description}</p>
                )}
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(s)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#8a8a93] hover:border-[rgba(var(--accent-rgb),0.5)] hover:text-[var(--accent)]">Edit</button>
                  <button onClick={() => onDelete(s.id)} className="rounded-lg border border-white/10 p-1.5 text-[#8a8a93] hover:border-[#ff4d5e]/50 hover:text-[#ff4d5e]"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              )}
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No services yet" />}
      </div>
    </div>
  );
}

/* ============ MESSAGES ============ */
export type Message = {
  id: string;
  name: string;
  email: string;
  service?: string | null;
  budget?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  new: "text-[var(--accent)] border-[rgba(var(--accent-rgb),0.4)] bg-[rgba(var(--accent-rgb),0.08)]",
  read: "text-[#9aa0a8] border-white/20 bg-white/[0.04]",
  replied: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  archived: "text-[#8a8a93] border-white/10 bg-white/[0.02]",
};

export function MessagesAdmin({ readOnly }: { readOnly?: boolean }) {
  const { data, loading, reload } = useFetch<{ messages: Message[] }>("/api/admin/messages");

  const setStatus = async (id: string, status: string) => {
    await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    reload();
  };

  if (loading) return <Loader />;
  const items = data?.messages || [];

  return (
    <div>
      {readOnly && <ReadOnlyBanner />}
      <Toolbar title="Messages" readOnly={readOnly} />
      <div className="space-y-3">
        {items.map((m) => (
          <ItemCard key={m.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#f0ece6]">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                    {m.email} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="mono-label text-[#9aa0a8] mt-1">
                  {m.service || "—"} · {m.budget || "—"} · {new Date(m.createdAt).toLocaleString()}
                </div>
                <p className="mt-2 text-sm text-[#b0aca6]">{m.message}</p>
              </div>
              {readOnly ? (
                <span
                  className={`rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wide ${STATUS_STYLES[m.status] || STATUS_STYLES.new}`}
                >
                  {m.status}
                </span>
              ) : (
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
              )}
            </div>
          </ItemCard>
        ))}
        {items.length === 0 && <Empty label="No messages yet" />}
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */
export const SETTING_FIELDS = [
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

export function SettingsAdmin({ readOnly }: { readOnly?: boolean }) {
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
      {readOnly && <ReadOnlyBanner />}
      <Toolbar title="Settings" readOnly={readOnly} />
      <div className="space-y-4 max-w-2xl">
        {SETTING_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              className={inputCls}
              value={vals[f.key] || ""}
              disabled={readOnly}
              onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          </Field>
        ))}
        {!readOnly && (
          <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#f0ece6] px-5 py-2.5 text-xs font-semibold text-[#0a0a0c] disabled:opacity-60">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save Settings"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ============ PASSWORD ============ */
export function PasswordAdmin({ readOnly }: { readOnly?: boolean }) {
  return (
    <div>
      <Toolbar title="Change Password" />
      <div className="max-w-lg rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <p className="text-sm text-[#b0aca6]">
          The admin password is set via the <code className="rounded bg-white/10 px-1.5 py-0.5 text-[var(--accent)]">ADMIN_PASSWORD</code> environment variable.
          To change it:
        </p>
        <ol className="space-y-2 text-sm text-[#8a8a93] list-decimal list-inside">
          <li>
            <span className="text-[#f0ece6]">Local dev:</span> edit <code className="rounded bg-white/10 px-1.5 py-0.5 text-[var(--accent)]">.env</code> and
            update the <code className="rounded bg-white/10 px-1.5 py-0.5 text-[var(--accent)]">ADMIN_PASSWORD</code> value, then restart the dev server.
          </li>
          <li>
            <span className="text-[#f0ece6]">Production (Vercel):</span> go to Vercel → Settings → Environment Variables →
            update <code className="rounded bg-white/10 px-1.5 py-0.5 text-[var(--accent)]">ADMIN_PASSWORD</code> → redeploy.
          </li>
        </ol>
        <p className="text-xs text-[#5a5a63] pt-2 border-t border-white/5">
          This is more secure than storing the password in a database — the credential
          never touches the filesystem and can&apos;t be leaked through a DB dump.
        </p>
      </div>
    </div>
  );
}
