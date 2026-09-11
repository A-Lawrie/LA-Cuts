import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-4 bg-[#0a0908]/95 backdrop-blur-sm border-b border-[rgba(238,234,229,0.07)]"
          : "py-7 bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-[11px] uppercase tracking-[0.25em] font-sans font-medium text-[#eeeae5] hover:text-[#7a7570] transition-colors"
        >
          Lawrie Abuna
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Work",    id: "work"    },
            { label: "About",   id: "about"   },
            { label: "Contact", id: "contact" },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-[11px] uppercase tracking-[0.22em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-[#eeeae5] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-px bg-[#eeeae5] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-[#eeeae5] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(238,234,229,0.07)] bg-[#0a0908]/98 backdrop-blur-sm">
          <div className="px-6 py-6 flex flex-col gap-5">
            {[
              { label: "Work",    id: "work"    },
              { label: "About",   id: "about"   },
              { label: "Contact", id: "contact" },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-[11px] uppercase tracking-[0.22em] font-sans text-[#7a7570] hover:text-[#eeeae5] transition-colors text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
