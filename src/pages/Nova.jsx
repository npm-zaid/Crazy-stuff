import { useEffect, useRef } from "react";

// ─── Inline styles for things Tailwind can't express ─────────────────────────
const cssVars = `
  :root {
    --bg:      #f5efe2;
    --bg-2:    #ede6d6;
    --ink:     #141416;
    --ink-soft:#2b2b30;
    --mute:    #8b847a;
    --line:    #dad2bf;
    --ghost:   #c5bfae;
    --o1:      #d9351f;
    --o2:      #e85a2b;
    --o3:      #f58b4e;
    --o4:      #fdc68a;
  }
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..900;1,9..40,400..900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: var(--bg); color: var(--ink); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
`;

// ─── Card data ─────────────────────────────────────────────────────────────
const CARDS = [
  { img: "photo-1500648767791-00dcc994a43e", rot: -9, depth: 14, w: 130, h: 180, left: "4%",  top: 30 },
  { img: "photo-1507003211169-0a1dd7228f2d", rot: -5, depth: 10, w: 160, h: 220, left: "12%", top: 50 },
  { img: "photo-1494790108377-be9c29b29330", rot: -2, depth:  8, w: 200, h: 270, left: "22%", top: 20 },
  { img: "photo-1535713875002-d1d0cf377fde", rot:  3, depth: 12, w: 150, h: 200, left: "36%", top: 70 },
  { img: "photo-1531123897727-8f129e1688ce", rot:  0, depth:  6, w: 230, h: 310, left: "44%", top:  0 },
  { img: "photo-1599566150163-29194dcaad36", rot:  4, depth: 11, w: 160, h: 215, left: "59%", top: 55 },
  { img: "photo-1438761681033-6461ffad8d80", rot:  7, depth:  9, w: 175, h: 240, left: "70%", top: 30 },
  { img: "photo-1544005313-94ddf0286df2", rot: -4, depth: 13, w: 130, h: 175, left: "84%", top: 50 },
];

const TEAM = [
  { img: "photo-1500648767791-00dcc994a43e", name: "Mateus Aldana",  role: "Creative Director" },
  { img: "photo-1507003211169-0a1dd7228f2d", name: "Eli Ramirez",    role: "Design Lead"        },
  { img: "photo-1494790108377-be9c29b29330", name: "Naomi Park",     role: "Brand Strategist"   },
  { img: "photo-1535713875002-d1d0cf377fde", name: "Theo Vance",     role: "Senior Engineer"    },
  { img: "photo-1531123897727-8f129e1688ce", name: "Kit Bellamy",    role: "Art Direction"      },
  { img: "photo-1599566150163-29194dcaad36", name: "Ravi Saigal",    role: "Motion · 3D"        },
  { img: "photo-1438761681033-6461ffad8d80", name: "Iris Caldwell",  role: "Producer"           },
  { img: "photo-1544005313-94ddf0286df2", name: "Maya Okafor",    role: "Founder · CEO"      },
];

const STATS = [
  { count: 62, label: "Projects shipped",  suffix: ""    },
  { count: 14, label: "Combined craft",    suffix: "yrs" },
  { count: 9,  label: "Avg NPS",           suffix: ".4"  },
];

// ─── Arrow SVG ──────────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function NovaBrew() {
  const navRef      = useRef(null);
  const heroRef     = useRef(null);
  const cardsRef    = useRef([]);
  const bigRef      = useRef(null);
  const smallRef    = useRef(null);
  const sublineRef  = useRef(null);
  const statsRef    = useRef(null);
  const tCardsRef   = useRef([]);
  const statNumsRef = useRef([]);
  const rafRef      = useRef(null);
  const mouseRef    = useRef({ mx: 0, my: 0, tx: 0, ty: 0 });

  useEffect(() => {
    let gsap, ScrollTrigger;

    async function init() {
      const g  = await import("gsap");
      const st = await import("gsap/ScrollTrigger");
      gsap = g.gsap;
      ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // ── Initial states ──────────────────────────────────────────────────
      gsap.set(navRef.current,    { opacity: 0, y: -20 });
      gsap.set(".word > span",    { y: "105%" });
      gsap.set(".big-letter",     { y: 80, opacity: 0 });
      gsap.set(sublineRef.current,{ opacity: 0, y: 20 });
      gsap.set(".t-card",         { opacity: 0 });
      gsap.set(statsRef.current,  { opacity: 0 });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        const rot = parseFloat(card.dataset.rot) || 0;
        card.dataset.restRot = rot;
        gsap.set(card, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
      });

      // ── Intro timeline ───────────────────────────────────────────────────
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(navRef.current,    { opacity: 1, y: 0, duration: 0.8 }, 0.1)
        .to(".word > span",    { y: "0%", duration: 0.9, stagger: 0.08 }, 0.3)
        .to(".big-letter",     { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "back.out(1.6)" }, 0.55)
        .to(".hero-card",      {
          y: 0, opacity: 1, scale: 1,
          rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
          duration: 1.1,
          stagger: { each: 0.08, from: "center" },
          ease: "back.out(1.4)"
        }, 0.8)
        .to(sublineRef.current,{ opacity: 1, y: 0, duration: 0.8 }, 1.6);

      // ── Float animation ──────────────────────────────────────────────────
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const rot = parseFloat(card.dataset.restRot) || 0;
        gsap.to(card, {
          y: `+=${8 + (i % 3) * 5}`,
          rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
          duration: 3 + (i % 4) * 0.5,
          delay: 1.8 + i * 0.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // ── Parallax RAF ─────────────────────────────────────────────────────
      function parallax() {
        const m = mouseRef.current;
        m.tx += (m.mx - m.tx) * 0.05;
        m.ty += (m.my - m.ty) * 0.05;
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const d = parseFloat(card.dataset.depth) || 8;
          card.style.translate = `${m.tx * d}px ${m.ty * d * 0.5}px`;
        });
        rafRef.current = requestAnimationFrame(parallax);
      }
      parallax();

      // ── Card hover 3D ────────────────────────────────────────────────────
      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top)  / r.height - 0.5;
          gsap.to(card, { rotateX: -py * 16, rotateY: px * 16, scale: 1.12, zIndex: 20, duration: 0.4, ease: "power2.out", transformPerspective: 700, overwrite: "auto" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1,0.6)", overwrite: "auto" });
        });
        card.addEventListener("click", () => {
          gsap.fromTo(card, { scale: 1.15 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
        });
      });

      // ── Scroll: cards fan + big results ─────────────────────────────────
      const MOVES = [
        { x: -260, y: -40, rot: -25 }, { x: -200, y:  20, rot: -18 },
        { x: -120, y:  80, rot: -10 }, { x:  -40, y: 120, rot:  -4 },
        { x:   40, y: 120, rot:   4 }, { x:  120, y:  80, rot:  12 },
        { x:  200, y:  20, rot:  22 }, { x:  260, y: -40, rot:  28 },
      ];
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(bigRef.current,   { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
          gsap.set(smallRef.current, { y: -60 * p, opacity: 1 - p * 1.5 });
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const m = MOVES[i];
            const rest = parseFloat(card.dataset.restRot) || 0;
            gsap.set(card, { x: m.x * p, y: m.y * p, rotation: rest + m.rot * p });
          });
          gsap.set(sublineRef.current, { opacity: 1 - p * 2 });
        },
      });

      // ── Team grid reveal ─────────────────────────────────────────────────
      gsap.from(".team-head-item", {
        opacity: 0, y: 30, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".team-head", start: "top 80%" },
      });
      gsap.to(".t-card", {
        opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
      });
      gsap.from(".t-card", {
        y: 80, scale: 0.9,
        rotation: (i) => (i % 2 === 0 ? -3 : 3),
        duration: 1, stagger: 0.08, ease: "back.out(1.3)",
        scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
      });

      // ── Stats reveal + counters ──────────────────────────────────────────
      gsap.to(statsRef.current, {
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
      });
      gsap.from(statsRef.current, {
        y: 60, scale: 0.97, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".stats-section", start: "top 80%" },
      });
      ScrollTrigger.create({
        trigger: ".stats-section",
        start: "top 75%",
        once: true,
        onEnter: () => {
          statNumsRef.current.forEach((el, i) => {
            if (!el) return;
            const target = STATS[i].count;
            const span   = el.querySelector("span");
            gsap.to({ v: 0 }, {
              v: target, duration: 2, ease: "power2.out",
              onUpdate: function () { span.textContent = Math.floor(this.targets()[0].v); },
            });
          });
        },
      });

      // ── Big results hover ────────────────────────────────────────────────
      const bigWrap = document.querySelector(".big-results-wrap");
      bigWrap?.addEventListener("mouseenter", () => {
        gsap.to(".big-letter", { y: -8, duration: 0.5, stagger: 0.03, ease: "back.out(1.6)" });
      });
      bigWrap?.addEventListener("mouseleave", () => {
        gsap.to(".big-letter", { y: 0, duration: 0.6, stagger: 0.03, ease: "elastic.out(1,0.6)" });
      });

      // ── Button clicks ────────────────────────────────────────────────────
      document.querySelectorAll(".pill-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          gsap.fromTo(btn, { scale: 1 }, { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
        });
      });
    }

    init();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Mouse tracking ────────────────────────────────────────────────────────
  function handleHeroMouseMove(e) {
    const r = heroRef.current.getBoundingClientRect();
    mouseRef.current.mx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    mouseRef.current.my = ((e.clientY - r.top)  / r.height - 0.5) * 2;
  }
  function handleHeroMouseLeave() {
    mouseRef.current.mx = 0;
    mouseRef.current.my = 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{cssVars}</style>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.06,
          mixBlendMode: "multiply",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* ── NAV ── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-7"
      >
        <div className="flex items-center gap-2.5 font-bold tracking-tight text-base" style={{ color: "var(--ink)" }}>
          <span
            className="w-5 h-5 rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--o1), var(--o4))",
              boxShadow: "0 4px 8px -2px rgba(220,60,30,.4), inset 0 1px 0 rgba(255,255,255,.4), inset 0 -2px 3px rgba(120,20,0,.3)",
            }}
          />
          novabrew
        </div>

        <ul className="hidden md:flex gap-8 list-none">
          {["Work","Studio","Process","Contact"].map((l) => (
            <li key={l}>
              <a
                href="#"
                className="text-sm font-medium no-underline relative group transition-colors duration-300"
                style={{ color: "var(--ink-soft)" }}
              >
                {l}
                <span
                  className="absolute left-0 -bottom-0.5 h-px w-0 rounded-full bg-current transition-all duration-500 group-hover:w-full"
                  style={{ transitionTimingFunction: "cubic-bezier(.7,0,.2,1)" }}
                />
              </a>
            </li>
          ))}
        </ul>

        <button
          className="pill-btn inline-flex items-center gap-2 text-xs font-semibold rounded-full px-5 py-3 border-none cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
          style={{
            background: "var(--ink)", color: "#fafaf7",
            boxShadow: "0 12px 20px -8px rgba(0,0,0,.4),0 4px 8px -2px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 4px rgba(0,0,0,.4)",
            fontFamily: "inherit",
          }}
        >
          Start a project <ArrowIcon />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center z-10"
        style={{ padding: "130px 32px 60px", background: "radial-gradient(120% 70% at 50% 0%, #f8f3e7 0%, #f2ead6 60%, #e9dec3 100%)" }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Small team */}
        <h1
          ref={smallRef}
          className="relative z-10 text-center font-bold"
          style={{ fontSize: "clamp(40px,6.4vw,92px)", letterSpacing: "-0.035em", lineHeight: 1, color: "var(--ink)" }}
        >
          {["Small","team,"].map((w) => (
            <span key={w} className="word inline-block overflow-hidden align-top" style={{ marginRight: "0.25em" }}>
              <span className="inline-block">{w}</span>
            </span>
          ))}
        </h1>

        {/* Big results */}
        <div className="big-results-wrap relative w-full flex justify-center z-[1]" style={{ marginTop: "-20px" }}>
          <div
            ref={bigRef}
            className="font-extrabold italic text-center whitespace-nowrap select-none"
            style={{
              fontSize: "clamp(110px,21vw,300px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.85,
              color: "var(--ghost)",
              textShadow: "0 4px 12px rgba(120,100,50,.04)",
            }}
          >
            {"big results".split("").map((l, i) => (
              <span key={i} className="big-letter inline-block" style={{ transformOrigin: "bottom" }}>{l === " " ? "\u00A0" : l}</span>
            ))}
          </div>
        </div>

        {/* Cards row */}
        <div className="absolute left-0 right-0 z-[3] pointer-events-none" style={{ top: "50%", height: 320 }}>
          {CARDS.map((c, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="hero-card absolute rounded-[18px] overflow-hidden cursor-pointer"
              data-rot={c.rot}
              data-depth={c.depth}
              data-rest-rot={c.rot}
              style={{
                width: c.w, height: c.h,
                left: c.left, top: c.top,
                pointerEvents: "auto",
                background: "linear-gradient(180deg,var(--o1) 0%,var(--o2) 35%,var(--o3) 70%,var(--o4) 100%)",
                boxShadow: "0 30px 50px -16px rgba(180,50,20,.5),0 14px 26px -8px rgba(140,40,10,.32),0 5px 10px -2px rgba(80,20,0,.2),inset 0 2px 0 rgba(255,220,180,.45),inset 0 -4px 8px rgba(120,20,0,.4)",
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none rounded-[inherit] z-[2]"
                style={{ background: "linear-gradient(155deg,rgba(255,255,255,.25) 0%,transparent 30%,transparent 70%,rgba(100,20,0,.25) 100%)" }}
              />
              <img
                src={`https://images.unsplash.com/${c.img}?w=400&h=600&fit=crop&crop=faces&q=80`}
                alt=""
                className="w-full h-full object-cover object-top block"
              />
            </div>
          ))}
        </div>

        {/* Subline */}
        <div ref={sublineRef} className="mt-44 text-center z-10 relative">
          <button
            className="pill-btn inline-flex items-center gap-2.5 border-none rounded-full font-medium cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
            style={{
              background: "var(--ink)", color: "#fafaf7",
              padding: "12px 20px 12px 24px", fontSize: 14, fontFamily: "inherit",
              boxShadow: "0 14px 24px -8px rgba(0,0,0,.4),0 5px 10px -2px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 4px rgba(0,0,0,.4)",
            }}
          >
            Meet the crew
            <span
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45"
              style={{ background: "linear-gradient(180deg,var(--o1),var(--o3))" }}
            >
              <ArrowIcon />
            </span>
          </button>
          <p className="mt-5 text-[13px] tracking-[0.06em]" style={{ color: "var(--mute)" }}>
            8 people. 60+ shipped projects. Zero filler.
          </p>
        </div>
      </section>

      {/* ── TEAM SECTION ── */}
      <section className="relative z-10" style={{ padding: "140px 40px 80px" }}>
        <div className="team-head max-w-[1280px] mx-auto mb-16 flex justify-between items-end gap-10 flex-wrap">
          <div className="team-head-item">
            <div
              className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.28em] uppercase font-medium mb-4"
              style={{ color: "var(--mute)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--o1)", boxShadow: "0 0 0 3px rgba(217,53,31,.2)" }}
              />
              The Crew · Eight strong
            </div>
            <h2
              className="team-head-item font-bold"
              style={{ fontSize: "clamp(34px,4.4vw,64px)", lineHeight: 1, letterSpacing: "-0.03em" }}
            >
              Designers, builders
              <br />
              and the{" "}
              <em
                className="not-italic font-extrabold italic"
                style={{
                  background: "linear-gradient(135deg,var(--o1),var(--o3))",
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                }}
              >
                quietly brilliant
              </em>.
            </h2>
          </div>
          <p className="team-head-item text-[15px] leading-[1.55] max-w-[320px]" style={{ color: "var(--ink-soft)" }}>
            Every person you see here touches every project we ship. No middle layer, no handoffs to strangers — just direct work with the people doing it.
          </p>
        </div>

        <div className="team-grid max-w-[1280px] mx-auto grid gap-6" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          {TEAM.map((m, i) => (
            <div
              key={i}
              ref={(el) => (tCardsRef.current[i] = el)}
              className="t-card relative rounded-[22px] overflow-hidden cursor-pointer group"
              style={{
                aspectRatio: "3/4",
                background: "linear-gradient(180deg,var(--o1) 0%,var(--o2) 35%,var(--o3) 70%,var(--o4) 100%)",
                boxShadow: "0 24px 40px -16px rgba(180,50,20,.4),0 10px 22px -6px rgba(140,40,10,.22),inset 0 2px 0 rgba(255,220,180,.4),inset 0 -3px 6px rgba(120,20,0,.3)",
                transition: "transform .5s cubic-bezier(.6,0,.2,1), box-shadow .5s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px) rotate(-1deg)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <span
                className="absolute inset-0 pointer-events-none z-[2] rounded-[inherit]"
                style={{ background: "linear-gradient(155deg,rgba(255,255,255,.22) 0%,transparent 30%,transparent 70%,rgba(100,20,0,.22) 100%)" }}
              />
              <img
                src={`https://images.unsplash.com/${m.img}?w=400&h=540&fit=crop&crop=faces&q=80`}
                alt={m.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Hover overlay */}
              <div
                className="absolute left-3.5 right-3.5 bottom-3.5 z-[3] rounded-2xl border text-[#fafaf7] transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                style={{
                  background: "rgba(20,10,6,.7)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  padding: "12px 16px",
                  borderColor: "rgba(255,255,255,.12)",
                }}
              >
                <div className="font-bold text-sm">{m.name}</div>
                <div className="text-[11px] mt-0.5 tracking-[0.03em]" style={{ color: "rgba(255,255,255,.65)" }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section relative z-10" style={{ padding: "80px 40px 140px" }}>
        <div
          ref={statsRef}
          className="max-w-[1280px] mx-auto rounded-[36px] relative overflow-hidden grid gap-10"
          style={{
            background: "var(--ink)",
            padding: "80px 60px",
            color: "#f4edde",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            alignItems: "end",
            boxShadow: "0 40px 80px -30px rgba(20,8,0,.45),0 16px 32px -12px rgba(20,8,0,.25),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -3px 8px rgba(0,0,0,.5)",
          }}
        >
          {/* Glow blobs */}
          <span className="absolute rounded-full pointer-events-none" style={{ width:500,height:500,top:-200,right:-100,background:"radial-gradient(circle,rgba(232,90,43,.35),transparent 65%)",filter:"blur(40px)" }}/>
          <span className="absolute rounded-full pointer-events-none" style={{ width:350,height:350,bottom:-150,left:"20%",background:"radial-gradient(circle,rgba(253,198,138,.2),transparent 65%)",filter:"blur(30px)" }}/>

          <h3
            className="relative z-[1] font-bold"
            style={{ fontSize: "clamp(28px,3vw,42px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Eight humans.<br />
            One{" "}
            <em
              className="italic font-extrabold"
              style={{
                background: "linear-gradient(135deg,var(--o3),var(--o4))",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}
            >
              tight ship
            </em>.
          </h3>

          {STATS.map((s, i) => (
            <div key={i} className="relative z-[1]">
              <div
                ref={(el) => (statNumsRef.current[i] = el)}
                className="font-bold flex items-baseline gap-1"
                data-count={s.count}
                style={{ fontSize: "clamp(44px,4.5vw,68px)", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                <span>0</span>
                {s.suffix && <small className="font-medium" style={{ fontSize: "0.42em", color: "var(--mute)" }}>{s.suffix}</small>}
              </div>
              <div
                className="text-[12px] uppercase tracking-[0.16em] mt-3.5 pt-3.5 border-t"
                style={{ color: "var(--mute)", borderColor: "rgba(255,255,255,.12)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}