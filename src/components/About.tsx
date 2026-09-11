import mePhoto from "@/imports/me.jpg";
import RevealWrapper from "./RevealWrapper";

const pillars = [
  { label: "Pacing",  note: "Rhythm that holds attention" },
  { label: "Story",   note: "Structure that creates meaning" },
  { label: "Visuals", note: "Grade, motion, and light" },
  { label: "Sound",   note: "Music, atmosphere, clarity" },
  { label: "Color",   note: "Tone that sets the world" },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 md:py-36 px-6 md:px-12 lg:px-20 border-t border-[rgba(238,234,229,0.07)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <RevealWrapper className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#4a4845] font-sans">
            01 — About
          </span>
        </RevealWrapper>

        {/* Headline */}
        <RevealWrapper delay={70}>
          <h2
            className="font-display leading-[1.06] text-[#eeeae5] max-w-[900px] mb-16 md:mb-20"
            style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
          >
            I turn good footage into videos people{" "}
            <em style={{ fontStyle: "italic" }}>actually want to watch.</em>
          </h2>
        </RevealWrapper>

        {/* Three-column: photo | body copy | pillars */}
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr_260px] gap-12 lg:gap-16 items-start">

          {/* Photo */}
          <RevealWrapper delay={100}>
            <div className="w-full">
              <div
                className="overflow-hidden"
                style={{
                  aspectRatio: "4/5",
                  border: "1px solid rgba(238,234,229,0.08)",
                }}
              >
                <img
                  src={mePhoto}
                  alt="Lawrie Abuna"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </RevealWrapper>

          {/* Body copy */}
          <RevealWrapper delay={180}>
            <div className="space-y-5">
              <p className="font-sans text-[#7a7570] leading-[1.8] text-[0.93rem]">
                I'm Lawrie — a video editor based in Nairobi, Kenya. I work
                with creators, brands, and businesses to shape raw footage into
                polished, story-driven content that holds attention from the
                first frame to the last.
              </p>
              <p className="font-sans text-[#7a7570] leading-[1.8] text-[0.93rem]">
                My primary tool is DaVinci Resolve, and my work spans real
                estate walkthroughs, documentary shorts, brand films, YouTube
                content, and social media reels.
              </p>
              <p className="font-sans text-[#7a7570] leading-[1.8] text-[0.93rem]">
                Editing is not just cutting clips together. It's understanding
                what footage wants to say, then building the structure, rhythm,
                and feel that makes it land with the right audience.
              </p>
            </div>
          </RevealWrapper>

          {/* Pillars */}
          <RevealWrapper delay={260} className="md:col-span-2 lg:col-span-1">
            <div className="divide-y divide-[rgba(238,234,229,0.07)]">
              {pillars.map((pillar, i) => (
                <div key={pillar.label} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-5">
                    <span className="text-[9px] font-sans text-[#4a4845] w-4 text-right tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-[0.88rem] font-medium text-[#eeeae5] tracking-wide">
                      {pillar.label}
                    </span>
                  </div>
                  <span className="text-[0.75rem] font-sans text-[#4a4845] text-right">
                    {pillar.note}
                  </span>
                </div>
              ))}
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
