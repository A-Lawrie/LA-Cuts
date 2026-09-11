import { useState, useEffect } from "react";
import { Project } from "./types";
import {
  fetchProjects,
  insertProject,
  updateProject,
  deleteProjectById,
} from "./lib/projects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import ProjectModal from "./components/ProjectModal";
import Contact from "./components/Contact";
import Admin from "./components/Admin";

function getViewFromPath(): "site" | "admin" {
  return window.location.pathname === "/admin" ? "admin" : "site";
}

export default function App() {
  const [view, setView] = useState<"site" | "admin">(getViewFromPath);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const onPopState = () => setView(getViewFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => setLoadError(err.message ?? "Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const closeAdmin = () => {
    window.history.pushState({}, "", "/");
    setView("site");
  };

  const handleSaveProject = async (project: Project, isEditing: boolean) => {
    const saved = isEditing
      ? await updateProject(project)
      : await insertProject(project);
    setProjects((prev) =>
      isEditing
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...prev]
    );
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProjectById(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = async (project: Project) => {
    const updated = await updateProject({ ...project, featured: !project.featured });
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const featuredProject = projects.find(
    (p) => p.featured && p.mainCategory === "longform"
  );

  if (view === "admin") {
    return (
      <Admin
        projects={projects}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        onToggleFeatured={handleToggleFeatured}
        onClose={closeAdmin}
      />
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center px-6">
        <p className="font-sans text-[#7a7570] text-sm text-center">
          Couldn't load projects right now. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <Hero
          // featuredProject={featuredProject}
          // onViewWork={() =>
          //   document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
          // }
        />
        <About />
        <Portfolio
          projects={loading ? [] : projects}
          onSelectProject={setSelectedProject}
        />
        <Contact />
      </main>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          projects={projects}
          onClose={() => setSelectedProject(null)}
          onSelectProject={setSelectedProject}
        />
      )}
    </>
  );
}