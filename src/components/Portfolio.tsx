import { useState } from "react";
import { Project, LONGFORM_SUBCATEGORIES, SHORTFORM_SUBCATEGORIES } from "../types";
import { getYouTubeThumbnail } from "../utils/youtube";
import RevealWrapper from "./RevealWrapper";

interface PortfolioProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

function toTitleCase(str: string): string {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Portfolio({ projects, onSelectProject }: PortfolioProps) {
  const [mainCat, setMainCat] = useState<"longform" | "shortform">("shortform");
  const [subCat, setSubCat] = useState("all");

  const subcategories =
    mainCat === "longform" ? LONGFORM_SUBCATEGORIES : SHORTFORM_SUBCATEGORIES;

  const filtered = projects.filter((p) => {
    if (p.mainCategory !== mainCat) return false;
    if (subCat === "all") return true;
    return p.subcategory === subCat;
  });

  const switchMainCat = (cat: "longform" | "shortform") => {
    setMainCat(cat);
    setSubCat("all");
  };

  return (
    <section
      id="work"
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-[rgba(238,234,229,0.07)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <RevealWrapper className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#4a4845] font-sans">
            02 — Selected Work
          </span>
        </RevealWrapper>

        {/* Long Form / Short Form tabs */}
        <RevealWrapper delay={60}>
          <div className="flex gap-8 border-b border-[rgba(238,234,229,0.1)] mb-8">
            {(["shortform", "longform"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => switchMainCat(cat)}
                className={`pb-4 text-[11px] uppercase tracking-[0.22em] font-sans transition-colors duration-300 ${
                  mainCat === cat
                    ? "text-[#eeeae5] border-b border-[#eeeae5] -mb-px"
                    : "text-[#7a7570] hover:text-[#eeeae5]"
                }`}
              >
                {cat === "longform" ? "Long Form" : "Short Form"}
              </button>
            ))}
          </div>
        </RevealWrapper>

        {/* Subcategory pills */}
        <RevealWrapper delay={120}>
          <div className="flex flex-wrap gap-2 mb-14">
            {subcategories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSubCat(id)}
                className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-sans transition-all duration-200 ${
                  subCat === id
                    ? "bg-[#eeeae5] text-[#0a0908]"
                    : "text-[#7a7570] border border-[rgba(238,234,229,0.15)] hover:border-[rgba(238,234,229,0.45)] hover:text-[#eeeae5]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </RevealWrapper>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-28 text-center">
            <p className="text-[#4a4845] font-sans text-sm">
              No projects in this category yet.
            </p>
          </div>
        ) : (
          <div
            key={`${mainCat}-${subCat}`}
            className={`grid gap-x-6 gap-y-12 ${
              mainCat === "longform"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isShortForm={mainCat === "shortform"}
                onClick={() => onSelectProject(project)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  isShortForm,
  onClick,
  index,
}: {
  project: Project;
  isShortForm: boolean;
  onClick: () => void;
  index: number;
}) {
  const thumbnailUrl =
    project.thumbnailUrl || getYouTubeThumbnail(project.youtubeId);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full card-enter"
      style={{ animationDelay: `${index * 55}ms` } as React.CSSProperties}
    >
      {/* Thumbnail */}
      <div
        className={`relative overflow-hidden bg-[#1a1715] ${
          isShortForm ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        <img
          src={thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Hover overlay + play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-[rgba(238,234,229,0.12)] border border-[rgba(238,234,229,0.25)] flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <svg className="w-[14px] h-[14px] text-[#eeeae5] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-[9px] uppercase tracking-[0.18em] bg-[rgba(10,9,8,0.85)] text-[#eeeae5] px-2 py-[3px] font-sans border border-[rgba(238,234,229,0.15)]">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3.5">
        <span className="text-[9px] uppercase tracking-[0.22em] text-[#4a4845] font-sans">
          {project.mainCategory === "longform" ? "Long Form" : "Short Form"}
          &nbsp;·&nbsp;
          {toTitleCase(project.subcategory)}
        </span>
        <h3 className="mt-1 text-[0.85rem] font-sans font-medium text-[#eeeae5] leading-snug group-hover:text-[#7a7570] transition-colors duration-300">
          {project.title}
        </h3>
      </div>
    </button>
  );
}
