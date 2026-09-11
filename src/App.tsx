import { useState, useEffect } from "react";
import { Project } from "./types";
import { sampleProjects } from "./data";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import ProjectModal from "./components/ProjectModal";
import Contact from "./components/Contact";
import Admin from "./components/Admin";

export default function App() {
  const [view, setView] = useState<"site" | "admin">("site");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem("lawrie-portfolio-projects");
      if (stored) return JSON.parse(stored) as Project[];
    } catch {
      // ignore
    }
    return sampleProjects;
  });

  useEffect(() => {
    localStorage.setItem(
      "lawrie-portfolio-projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  const featuredProject = projects.find(
    (p) => p.featured && p.mainCategory === "longform"
  );

  if (view === "admin") {
    return (
      <Admin
        projects={projects}
        setProjects={setProjects}
        onClose={() => setView("site")}
      />
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
          projects={projects}
          onSelectProject={setSelectedProject}
        />
        <Contact onAdminClick={() => setView("admin")} />
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
