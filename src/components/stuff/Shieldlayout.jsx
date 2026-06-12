import { useEffect, useState } from "react";

/*
  Tailwind covers: layout, colors, sizing, flex, z-index, position, transitions.
  A tiny <style> block handles only the irreducible custom geometry:
    - skew transforms with translateX that Tailwind can't express
    - border appearing only on .ready state
    - the social link opacity transition-delay
*/

const SOCIAL = [
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path
          fill="black"
          d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
        />
        <line
          x1="17.5"
          y1="6.5"
          x2="17.51"
          y2="6.5"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" fill="none" stroke="black" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function ShieldLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay so the transition is visible on mount
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-black min-h-screen w-full font-mono text-white">
      <style>{`
        :root {
          --shield-bg: #252C37;
          --border: cyan;
        }

        /* Header curve skew */
        .header-left-inner {
          transition: transform 1s ease-out 1s, border 1s ease-out 1s;
        }
        .header-right-inner {
          transition: transform 1s ease-out 1s, border 1s ease-out 1s;
        }
        .ready .header-left-inner {
          transform: skew(-45deg) translateX(6%);
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .ready .header-right-inner {
          transform: skew(45deg) translateX(-6.8%);
          border-left: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        /* Footer curve skew */
        .footer-left-inner {
          transition: transform 1s ease-out 1s, border 1s ease-out 1s;
        }
        .footer-right-inner {
          transition: transform 1s ease-out 1s, border 1s ease-out 1s;
        }
        .ready .footer-left-inner {
          transform: skew(45deg) translateX(6%);
          border-right: 1px solid var(--border);
          border-top: 1px solid var(--border);
        }
        .ready .footer-right-inner {
          transform: skew(-45deg) translateX(-6.8%);
          border-left: 1px solid var(--border);
          border-top: 1px solid var(--border);
        }

        /* Center border lines */
        .header-center {
          transition: width 1s ease-out 1s;
          border-top: 1px solid var(--border);
        }
        .footer-center {
          transition: width 1s ease-out 1s;
          border-bottom: 1px solid var(--border);
        }

        /* Header / footer left–right bottom/top borders */
        .header-side { border-bottom: 1px solid var(--border); }
        .footer-side { border-top: 1px solid var(--border); }

        /* Social link staggered reveal */
        .social-link {
          opacity: 0;
          transition: opacity 0.5s ease-out, color 0.5s ease-out;
        }
        .ready .social-link {
          opacity: 1;
          transition: opacity 0.5s ease-out 2s, color 0.5s ease-out;
        }
        .social-link:hover { color: #999; }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 w-full z-50 ${ready ? "ready" : ""}`}
        style={{ background: "transparent" }}
      >
        {/* Shield box */}
        <div
          className="w-full transition-all duration-1000 ease-out"
          style={{
            height: ready ? "3vh" : "46vh",
            background: "var(--shield-bg)",
            transitionDelay: "1s",
          }}
        />

        {/* Curve row */}
        <div className="flex w-full" style={{ height: "4vh" }}>
          {/* Left wing */}
          <div
            className="relative w-1/2 h-full header-side"
            style={{ background: "var(--shield-bg)" }}
          >
            <div
              className="header-left-inner absolute inset-0"
              style={{ background: "var(--shield-bg)" }}
            />
          </div>

          {/* Center gap — expands on ready */}
          <div
            className="header-center h-full flex-shrink-0"
            style={{ width: ready ? "100%" : "0", transition: "width 1s ease-out 1s" }}
          />

          {/* Right wing */}
          <div
            className="relative w-1/2 h-full header-side"
            style={{ background: "var(--shield-bg)" }}
          >
            <div
              className="header-right-inner absolute inset-0"
              style={{ background: "var(--shield-bg)" }}
            />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT placeholder ──────────────────────────────────── */}
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-cyan-400 text-sm tracking-widest opacity-40 select-none">
          — content area —
        </p>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer
        className={`fixed bottom-0 w-full z-50 ${ready ? "ready" : ""}`}
        style={{ background: "transparent" }}
      >
        {/* Curve row */}
        <div className="flex w-full" style={{ height: "4vh" }}>
          {/* Left wing */}
          <div
            className="relative w-1/2 h-full footer-side"
            style={{ background: "var(--shield-bg)" }}
          >
            <div
              className="footer-left-inner absolute inset-0"
              style={{ background: "var(--shield-bg)" }}
            />
          </div>

          {/* Center gap */}
          <div
            className="footer-center h-full flex-shrink-0"
            style={{ width: ready ? "100%" : "0", transition: "width 1s ease-out 1s" }}
          />

          {/* Right wing + social icons */}
          <div
            className="relative w-1/2 h-full footer-side"
            style={{ background: "var(--shield-bg)" }}
          >
            <div
              className="footer-right-inner absolute inset-0"
              style={{ background: "var(--shield-bg)" }}
            />

            {/* Social icons layer */}
            <div className="absolute inset-0 flex items-center pl-[8%] gap-2 z-10">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="social-link text-white px-1"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Shield box */}
        <div
          className="w-full transition-all duration-1000 ease-out"
          style={{
            height: ready ? "3vh" : "46vh",
            background: "var(--shield-bg)",
            transitionDelay: "1s",
          }}
        />
      </footer>
    </div>
  );
}