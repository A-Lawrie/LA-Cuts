import { useEffect, useRef } from "react";
import timelineBg from "@/imports/timeline.jpg";
import { Project } from "../types";
import { getYouTubeThumbnail } from "../utils/youtube";

interface HeroProps {
  featuredProject?: Project;
  onViewWork: () => void;
}

/** DaVinci Resolve–style razor / cut-tool icon */
function CutBlade() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center mx-[0.06em]"
      style={{ height: "0.82em", verticalAlign: "middle", position: "relative", top: "-0.04em" }}
    >
      {/* Blade body — right-pointing wedge */}
      <svg viewBox="0 0 14 36" fill="none" style={{ height: "100%", width: "auto" }}>
        <polygon points="0,0 14,18 0,36" fill="#eeeae5" opacity="0.92" />
      </svg>
      {/* Dashed cut line */}
      <svg viewBox="0 0 5 36" fill="none" style={{ height: "100%", width: "auto", marginLeft: "-0.5px" }}>
        <line
          x1="2" y1="3" x2="2" y2="33"
          stroke="rgba(238,234,229,0.45)"
          strokeWidth="1.8"
          strokeDasharray="5 2.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function Hero({ featuredProject, onViewWork }: HeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      { el: eyebrowRef.current,  delay: 0 },
      { el: headlineRef.current, delay: 160 },
      { el: thumbRef.current,    delay: 340 },
      { el: ctaRef.current,      delay: 500 },
    ];
    elements.forEach(({ el, delay }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });
  }, []);

  const thumbnail = featuredProject
    ? featuredProject.thumbnailUrl || getYouTubeThumbnail(featuredProject.youtubeId)
    : null;

  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-10 overflow-hidden">

      {/* ── Background: timeline image + layered overlays ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={timelineBg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ filter: "saturate(1.1)" }}
        />
        {/* Primary dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(8,7,6,0.74)" }} />
        {/* Vignette — edges darker than center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(5,4,4,0.55) 100%)",
          }}
        />
        {/* Bottom fade into site background */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: "linear-gradient(to top, #0a0908, transparent)" }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1fr_auto] lg:gap-16 items-center">

          {/* Left column */}
          <div>
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#7a7570] font-sans">
                Video Editor &amp; Visual Storyteller &nbsp;—&nbsp; Nairobi, Kenya
              </span>
            </div>

            {/* Headline with split "footage" */}
            <div ref={headlineRef}>
              <h1
                className="font-display font-bold leading-[0.91] tracking-tight text-[#eeeae5]"
                style={{ fontSize: "clamp(3.6rem, 9.5vw, 10rem)" }}
              >
                {/* Line 1 */}
                Good{" "}
                <span className="inline-flex items-center">
                  {/* Solid half */}
                  <span>foot</span>
                  {/* DaVinci cut tool */}
                  <CutBlade />
                  {/* Outline-only half */}
                  <span className="text-outline">age</span>
                </span>
                <br />
                {/* Line 2 */}
                deserves a
                <br />
                {/* Line 3 — italic */}
                <em style={{ fontStyle: "italic" }}>good edit.</em>
              </h1>
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="mt-12 lg:mt-14">
              <button
                onClick={onViewWork}
                className="group flex items-center gap-4 text-[#7a7570] hover:text-[#eeeae5] transition-colors duration-300"
              >
                <span className="text-[11px] uppercase tracking-[0.25em] font-sans">
                  View my work
                </span>
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-y-1">
                  ↓
                </span>
              </button>
            </div>
          </div>

          {/* Right column: featured thumbnail — desktop only */}
          {thumbnail && (
            <div
              ref={thumbRef}
              className="hidden lg:block w-[26vw] max-w-[360px] min-w-[260px]"
            >
              <div
                className="aspect-video overflow-hidden"
                style={{ border: "1px solid rgba(238,234,229,0.1)" }}
              >
                <img
                  src={thumbnail}
                  alt={featuredProject?.title ?? "Featured project"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#4a4845] font-sans">
                  Featured
                </span>
                <span className="w-px h-2.5 bg-[rgba(238,234,229,0.15)]" />
                <p className="text-[11px] font-sans text-[#7a7570] truncate">
                  {featuredProject?.title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom status line ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pt-8 border-t border-[rgba(238,234,229,0.07)]">
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#4a4845] font-sans">
          Lawrie Abuna
        </span>
        <span className="text-[10px] font-sans text-[#4a4845]">
          DaVinci Resolve &nbsp;·&nbsp; Video Editing &nbsp;·&nbsp; Color Grading
        </span>
      </div>
    </section>
  );
}
