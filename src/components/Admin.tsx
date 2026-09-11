import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  Project,
  MainCategory,
  LONGFORM_SUBCATEGORIES,
  SHORTFORM_SUBCATEGORIES,
  WORK_ITEMS,
} from "../types";
import { extractYouTubeId, getYouTubeThumbnail } from "../utils/youtube";

interface AdminProps {
  projects: Project[];
  onSave: (project: Project, isEditing: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleFeatured: (project: Project) => Promise<void>;
  onClose: () => void;
}

type AdminTab = "manage" | "add";

const inputClass =
  "w-full border border-[rgba(238,234,229,0.15)] bg-[#141210] px-4 py-3 text-[0.875rem] font-sans text-[#eeeae5] placeholder:text-[#3d3a38] focus:outline-none focus:border-[rgba(238,234,229,0.45)] transition-colors";

export default function Admin({ projects, onSave, onDelete, onToggleFeatured, onClose }: AdminProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const [tab, setTab] = useState<AdminTab>("manage");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const deleteProject = async (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    setBusy(true);
    setActionError("");
    try {
      await onDelete(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    setActionError("");
    try {
      await onToggleFeatured(project);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update project.");
    }
  };

  const handleSave = async (project: Project) => {
    setBusy(true);
    setActionError("");
    try {
      await onSave(project, editingProject !== null);
      setEditingProject(null);
      setTab("manage");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setTab("add");
  };

  const cancelForm = () => {
    setEditingProject(null);
    setTab("manage");
  };

  const isFormView = tab === "add" || editingProject !== null;

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <p className="font-sans text-[#7a7570] text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onClose={onClose} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0908]">
      <header className="border-b border-[rgba(238,234,229,0.07)] px-6 md:px-12 py-5">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-medium text-[#eeeae5]">
              Lawrie — Admin
            </span>
            <div className="flex gap-6">
              {(
                [
                  ["manage", "Projects"],
                  ["add", "Add New"],
                ] as [AdminTab, string][]
              ).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => { if (t === "manage") cancelForm(); else setTab(t); }}
                  className={`text-[11px] uppercase tracking-[0.2em] font-sans transition-colors ${
                    tab === t ? "text-[#eeeae5]" : "text-[#7a7570] hover:text-[#eeeae5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Site</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-12">
        {actionError && (
          <p className="text-[0.82rem] font-sans text-[#cc5555] mb-6">{actionError}</p>
        )}
        {isFormView ? (
          <ProjectForm project={editingProject} busy={busy} onSave={handleSave} onCancel={cancelForm} />
        ) : (
          <ProjectsTable
            projects={projects}
            onEdit={startEdit}
            onDelete={deleteProject}
            onToggleFeatured={toggleFeatured}
          />
        )}
      </main>
    </div>
  );
}

function AdminLogin({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <h1
          className="font-display text-[#eeeae5] mb-8"
          style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
        >
          Admin Sign In
        </h1>
        <div className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className={inputClass}
          />
          {error && <p className="text-[0.82rem] font-sans text-[#cc5555]">{error}</p>}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="px-8 py-3 bg-[#eeeae5] text-[#0a0908] text-[11px] uppercase tracking-[0.2em] font-sans hover:bg-[#c8c4bf] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  busy,
  onSave,
  onCancel,
}: {
  project: Project | null;
  busy: boolean;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(
    project?.youtubeId ? `https://youtube.com/watch?v=${project.youtubeId}` : ""
  );
  const [mainCategory, setMainCategory] = useState<MainCategory>(project?.mainCategory ?? "longform");
  const [subcategory, setSubcategory] = useState(project?.subcategory ?? "real-estate");
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [workItems, setWorkItems] = useState<string[]>(project?.workItems ?? []);
  const [error, setError] = useState("");

  const subcategories = (
    mainCategory === "longform" ? LONGFORM_SUBCATEGORIES : SHORTFORM_SUBCATEGORIES
  ).filter((s) => s.id !== "all");

  const detectedId = extractYouTubeId(youtubeUrl);

  const handleSubmit = () => {
    if (!title.trim()) { setError("Project title is required."); return; }
    if (!detectedId)   { setError("Please enter a valid YouTube URL."); return; }
    setError("");
    const saved: Project = {
      id: project?.id ?? Date.now().toString(),
      title: title.trim(),
      mainCategory,
      subcategory,
      youtubeId: detectedId,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      description: description.trim(),
      featured,
      workItems,
      createdAt: project?.createdAt ?? new Date().toISOString().split("T")[0],
    };
    onSave(saved);
  };

  const toggleWorkItem = (item: string) => {
    setWorkItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="max-w-[600px]">
      <h2
        className="font-display text-[#eeeae5] mb-10"
        style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
      >
        {project ? "Edit Project" : "Add New Project"}
      </h2>

      <div className="space-y-7">
        <Field label="Project Title">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Luxury Villa — Lavington" className={inputClass} />
        </Field>

        <Field label="YouTube URL">
          <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
          {youtubeUrl && (
            <p className={`mt-1.5 text-[11px] font-sans ${detectedId ? "text-[#7a7570]" : "text-[#cc5555]"}`}>
              {detectedId ? `✓ Video ID: ${detectedId}` : "✗ Could not detect a video ID"}
            </p>
          )}
        </Field>

        <Field label="Main Category">
          <div className="flex gap-3">
            {(["longform", "shortform"] as MainCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setMainCategory(cat); setSubcategory("real-estate"); }}
                className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] font-sans transition-all ${
                  mainCategory === cat
                    ? "bg-[#eeeae5] text-[#0a0908]"
                    : "border border-[rgba(238,234,229,0.15)] text-[#7a7570] hover:border-[rgba(238,234,229,0.4)]"
                }`}
              >
                {cat === "longform" ? "Long Form" : "Short Form"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Subcategory">
          <div className="relative">
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className={`${inputClass} appearance-none pr-10 cursor-pointer`}
            >
              {subcategories.map(({ id, label }) => (
                <option key={id} value={id} className="bg-[#141210]">{label}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4845] pointer-events-none text-xs">↓</span>
          </div>
        </Field>

        <Field label="Custom Thumbnail URL (optional)">
          <input type="text" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Leave empty to use YouTube thumbnail" className={inputClass} />
        </Field>

        <Field label="Description (optional)">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short description of the project..." className={`${inputClass} resize-none`} />
        </Field>

        <Field label="What I Worked On">
          <div className="flex flex-wrap gap-2">
            {WORK_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleWorkItem(item)}
                className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-sans transition-all ${
                  workItems.includes(item)
                    ? "bg-[#eeeae5] text-[#0a0908]"
                    : "border border-[rgba(238,234,229,0.15)] text-[#7a7570] hover:border-[rgba(238,234,229,0.4)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </Field>

        {/* Featured toggle */}
        <div className="flex items-center justify-between py-4 border-t border-b border-[rgba(238,234,229,0.07)]">
          <div>
            <span className="text-[0.875rem] font-sans text-[#eeeae5] font-medium">Feature this project</span>
            <p className="text-[0.78rem] font-sans text-[#7a7570] mt-0.5">Highlights this project on the homepage</p>
          </div>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`relative w-10 h-5 transition-colors duration-300 ${featured ? "bg-[#eeeae5]" : "bg-[rgba(238,234,229,0.12)]"}`}
            role="switch"
            aria-checked={featured}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[#0a0908] transition-transform duration-300 ${featured ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {error && <p className="text-[0.82rem] font-sans text-[#cc5555]">{error}</p>}

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="px-8 py-3 bg-[#eeeae5] text-[#0a0908] text-[11px] uppercase tracking-[0.2em] font-sans hover:bg-[#c8c4bf] transition-colors disabled:opacity-50"
          >
            {busy ? "Saving…" : project ? "Save Changes" : "Add Project"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.25em] text-[#7a7570] font-sans mb-2">{label}</label>
      {children}
    </div>
  );
}

function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "longform" | "shortform">("all");
  const filtered = filter === "all" ? projects : projects.filter((p) => p.mainCategory === filter);
  const getThumbnail = (p: Project) => p.thumbnailUrl || getYouTubeThumbnail(p.youtubeId);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-[#eeeae5]" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}>
          Projects{" "}
          <span className="text-[#4a4845] font-sans text-base font-normal">({projects.length})</span>
        </h2>
        <div className="flex gap-5">
          {(["all", "longform", "shortform"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] uppercase tracking-[0.22em] font-sans transition-colors ${
                filter === f ? "text-[#eeeae5]" : "text-[#4a4845] hover:text-[#7a7570]"
              }`}
            >
              {f === "all" ? "All" : f === "longform" ? "Long Form" : "Short Form"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-[#4a4845] text-sm py-12 text-center">
          No projects yet. Add your first project.
        </p>
      ) : (
        <div className="border border-[rgba(238,234,229,0.07)]">
          <div className="grid grid-cols-[56px_1fr_100px_110px_70px_100px] gap-4 px-5 py-3 border-b border-[rgba(238,234,229,0.07)] bg-[rgba(238,234,229,0.02)]">
            {["", "Title", "Category", "Subcategory", "Featured", "Actions"].map((h) => (
              <span key={h} className="text-[9px] uppercase tracking-[0.25em] text-[#4a4845] font-sans">{h}</span>
            ))}
          </div>

          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`grid grid-cols-[56px_1fr_100px_110px_70px_100px] gap-4 px-5 py-3.5 items-center hover:bg-[rgba(238,234,229,0.02)] transition-colors ${
                i < filtered.length - 1 ? "border-b border-[rgba(238,234,229,0.05)]" : ""
              }`}
            >
              <img src={getThumbnail(project)} alt={project.title} className="w-14 aspect-video object-cover bg-[#1a1715]" />
              <span className="text-[0.82rem] font-sans text-[#eeeae5] truncate pr-2">{project.title}</span>
              <span className="text-[10px] font-sans text-[#7a7570] uppercase tracking-wide">
                {project.mainCategory === "longform" ? "Long" : "Short"}
              </span>
              <span className="text-[10px] font-sans text-[#7a7570] capitalize">
                {project.subcategory.replace(/-/g, " ")}
              </span>
              <button onClick={() => onToggleFeatured(project.id)} className="text-[12px] text-[#7a7570] hover:text-[#eeeae5] transition-colors text-left" title="Toggle featured">
                {project.featured ? "★" : "☆"}
              </button>
              <div className="flex gap-3">
                <button onClick={() => onEdit(project)} className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#7a7570] hover:text-[#eeeae5] transition-colors">Edit</button>
                <button onClick={() => onDelete(project.id)} className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#7a7570] hover:text-[#cc5555] transition-colors">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}