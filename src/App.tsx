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

function getViewFromPath(): "site" | "admin" {
  return window.location.pathname === "/admin" ? "admin" : "site";
}

export default function App() {
  const [view, setView] = useState<"site" | "admin">(getViewFromPath());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

   useEffect(() => {
    const onPopState = () => setView(getViewFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const closeAdmin = () => {
    window.history.pushState({}, "", "/");
    setView("site");
  };

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
        onClose={closeAdmin}
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
