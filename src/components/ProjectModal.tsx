import { useEffect, useState } from "react";
import { Project } from "../types";

function toTitleCase(str: string): string {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ProjectModalProps {
  project: Project;
  projects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export default function ProjectModal({
  project,
  projects,
  onClose,
  onSelectProject,
}: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(t);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevProject) onSelectProject(prevProject);
      if (e.key === "ArrowRight" && nextProject) onSelectProject(nextProject);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const sameCategory = projects.filter((p) => p.mainCategory === project.mainCategory);
  const currentIndex = sameCategory.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? sameCategory[currentIndex - 1] : null;
  const nextProject = currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null;
  const isShortForm = project.mainCategory === "shortform";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300 ${
        mounted ? "bg-black/90" : "bg-transparent"
      }`}
      style={{ backdropFilter: mounted ? "blur(8px)" : "none" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`bg-[#111009] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-[rgba(238,234,229,0.08)] transition-all duration-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-[rgba(238,234,229,0.08)] sticky top-0 bg-[#111009] z-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#4a4845] font-sans">
            {project.mainCategory === "longform" ? "Long Form" : "Short Form"}
            &nbsp;·&nbsp;
            {toTitleCase(project.subcategory)}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[10px] uppercase tracking-[0.25em] text-[#7a7570] hover:text-[#eeeae5] transition-colors duration-200 font-sans flex items-center gap-2"
          >
            Close&nbsp;×
          </button>
        </div>

        {/* Video */}
        <div className={isShortForm ? "bg-[rgba(238,234,229,0.03)] flex justify-center py-10 px-6" : ""}>
          <div className={isShortForm ? "w-full max-w-[300px]" : "w-full"}>
            <div style={{ position: "relative", paddingTop: isShortForm ? "177.78%" : "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeId}?rel=0&modestbranding=1&color=white`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 md:px-10 py-8 md:py-10">
          <div className="grid md:grid-cols-[1fr_220px] gap-8 items-start">
            <div>
              <h2
                className="font-display text-[#eeeae5] leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
              >
                {project.title}
              </h2>
              {project.description && (
                <p className="mt-4 font-sans text-[#7a7570] leading-[1.8] text-[0.88rem] max-w-xl">
                  {project.description}
                </p>
              )}
            </div>

            {project.workItems.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#4a4845] font-sans mb-3">
                  What I worked on
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.workItems.map((item) => (
                    <span
                      key={item}
                      className="text-[9px] uppercase tracking-[0.15em] font-sans text-[#7a7570] border border-[rgba(238,234,229,0.13)] px-2.5 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next */}
          <div className="mt-10 pt-6 border-t border-[rgba(238,234,229,0.07)] flex justify-between items-center">
            <button
              onClick={() => prevProject && onSelectProject(prevProject)}
              disabled={!prevProject}
              className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span>←</span>
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="text-[10px] font-sans text-[#4a4845] tabular-nums">
              {currentIndex + 1} / {sameCategory.length}
            </span>
            <button
              onClick={() => nextProject && onSelectProject(nextProject)}
              disabled={!nextProject}
              className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-sans text-[#7a7570] hover:text-[#eeeae5] disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="hidden sm:inline">Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
