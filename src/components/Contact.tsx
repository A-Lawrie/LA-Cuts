import RevealWrapper from "./RevealWrapper";

interface ContactProps {
  onAdminClick: () => void;
}

export default function Contact({ onAdminClick }: ContactProps) {
  return (
    <section
      id="contact"
      className="py-24 md:py-36 px-6 md:px-12 lg:px-20 border-t border-[rgba(238,234,229,0.07)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <RevealWrapper className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#4a4845] font-sans">
            03 — Contact
          </span>
        </RevealWrapper>

        <div className="grid lg:grid-cols-2 gap-16 items-end">
          {/* Headline + CTA */}
          <RevealWrapper delay={80}>
            <h2
              className="font-display leading-[1.05] text-[#eeeae5]"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.8rem)" }}
            >
              Have something
              <br />
              worth{" "}
              <em style={{ fontStyle: "italic" }}>editing?</em>
            </h2>

            <p className="mt-6 font-sans text-[#7a7570] text-lg leading-relaxed">
              Let's make it worth watching.
            </p>

            <div className="mt-10">
              <a
                href="mailto:lawrieabuna@gmail.com"
                className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.22em] text-[#eeeae5] hover:text-[#7a7570] transition-colors border-b border-[rgba(238,234,229,0.4)] pb-1 group"
              >
                Get in touch
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </RevealWrapper>

          {/* Social + location */}
          <RevealWrapper delay={200}>
            <div className="flex flex-col lg:items-end gap-5">
              <div className="flex gap-8">
                <a href="https://www.instagram.com/lawrie_tech?stkn=N3pqaTd5Y2Nqbm41&utm_source=qr" target="_blank" className="text-[11px] uppercase tracking-[0.22em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors">
                  Instagram
                </a>
                <a href="https://youtube.com/@lawrietech?si=kCErigBgRW8yuStL" target="_blank" className="text-[11px] uppercase tracking-[0.22em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors">
                  YouTube
                </a>
              </div>
              <p className="text-[11px] font-sans text-[#4a4845]">
                Nairobi, Kenya · Available for remote work worldwide
              </p>
            </div>
          </RevealWrapper>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-7 border-t border-[rgba(238,234,229,0.07)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span className="text-[10px] font-sans text-[#4a4845] uppercase tracking-[0.22em]">
            © 2026 Lawrie Abuna
          </span>
          <button
            onClick={onAdminClick}
            className="text-[9px] font-sans text-[rgba(238,234,229,0.1)] hover:text-[#4a4845] transition-colors uppercase tracking-[0.2em]"
          >
            admin
          </button>
        </div>
      </div>
    </section>
  );
}
