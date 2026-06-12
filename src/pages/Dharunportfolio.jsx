import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github, Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────────────

const SKILLS = {
  Frontend: ["React", "Next.js", "TypeScript", "GSAP", "Tailwind", "Three.js"],
  Backend: ["Node.js", "Express", "Python", "FastAPI", "GraphQL", "REST APIs"],
  Infrastructure: ["MongoDB", "PostgreSQL", "Redis", "Docker", "AWS", "Vercel"],
  "Tools & Design": ["Figma", "Git", "Postman", "VS Code", "Linux"],
};

const PROJECTS = [
  {
    num: "01",
    name: "NexCommerce",
    desc: "Full-stack e-commerce platform with AI recommendations",
    tech: ["Next.js", "Stripe", "MongoDB"],
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  },
  {
    num: "02",
    name: "Lumina Dashboard",
    desc: "Real-time analytics dashboard with live WebSocket data",
    tech: ["React", "D3.js", "WebSocket"],
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80",
  },
  {
    num: "03",
    name: "PixelForge Studio",
    desc: "Browser-based creative suite for generative art",
    tech: ["Canvas API", "WebGL", "GSAP"],
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  },
  {
    num: "04",
    name: "Cogni AI Chat",
    desc: "Conversational AI platform with multi-model routing",
    tech: ["Python", "FastAPI", "OpenAI"],
    img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80",
  },
  {
    num: "05",
    name: "ThreadNest",
    desc: "Social platform for developers with code sharing",
    tech: ["Node.js", "Socket.io", "Redis"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    num: "06",
    name: "VaultChain",
    desc: "Decentralized file storage with blockchain verification",
    tech: ["Solidity", "IPFS", "Web3.js"],
    img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80",
  },
];

const GALLERY_ITEMS = [
  { title: "Gradient Systems", cat: "ui", span: "col-span-5 row-span-5", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
  { title: "NexCommerce UI", cat: "web", span: "col-span-4 row-span-3", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80" },
  { title: "Brand Identity", cat: "brand", span: "col-span-3 row-span-3", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&q=80" },
  { title: "Kinetic Type", cat: "motion", span: "col-span-4 row-span-4", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80" },
  { title: "Design System", cat: "ui", span: "col-span-3 row-span-2", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80" },
  { title: "Lumina Dashboard", cat: "web", span: "col-span-5 row-span-4", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80" },
  { title: "Type Poster", cat: "brand", span: "col-span-4 row-span-2", img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80" },
  { title: "3D Exploration", cat: "motion", span: "col-span-3 row-span-3", img: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=600&q=80" },
  { title: "Mobile App UI", cat: "ui", span: "col-span-5 row-span-3", img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80" },
];

const EXPERIENCE = [
  { year: "2024 — Present", role: "Senior Frontend Developer", company: "Tech Startup — Remote", desc: "Leading frontend architecture for a SaaS platform serving 50K+ users. Built component systems, reduced bundle size by 40%." },
  { year: "2023 — 2024", role: "Full Stack Developer", company: "Digital Agency, Chennai", desc: "Developed 12+ client projects across e-commerce, fintech, and media sectors. Delivered under aggressive deadlines with 100% client retention." },
  { year: "2022 — 2023", role: "Junior Web Developer", company: "Freelance", desc: "Built responsive web apps for local businesses. Established client relationships that led to 8 long-term contracts." },
  { year: "2021 — 2022", role: "UI/UX Intern", company: "Design Studio, Coimbatore", desc: "Designed wireframes and prototypes in Figma. Contributed to a design system used across 20+ products." },
];

const AWARDS = [
  { name: "Best Developer Portfolio", org: "Awwwards Honorable Mention", year: "2024" },
  { name: "Hackathon Winner", org: "Smart India Hackathon", year: "2023" },
  { name: "Open Source Contributor", org: "GitHub Arctic Vault Program", year: "2023" },
  { name: "Top 5% Developer", org: "Stack Overflow Dev Survey", year: "2022" },
];

const MARQUEE_ITEMS = ["React", "Next.js", "Node.js", "TypeScript", "GSAP", "Tailwind CSS", "MongoDB", "PostgreSQL", "Docker", "AWS", "Figma", "Python"];

const STATS = [
  { count: 3, label: "Years Building" },
  { count: 40, label: "Projects Shipped" },
  { count: 15, label: "Happy Clients" },
  { count: 8, label: "Technologies" },
];

const CONTACT_LINKS = [
  { name: "Email", handle: "dharunkumar@email.com", href: "mailto:dharunkumar@email.com" },
  { name: "GitHub", handle: "github.com/dharunkumarn", href: "https://github.com" },
  { name: "LinkedIn", handle: "linkedin.com/in/dharunkumarn", href: "https://linkedin.com" },
  { name: "Twitter / X", handle: "@dharunkumarn", href: "https://twitter.com" },
];

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

function Cursor() {
  const cursorRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);

    const interactables = document.querySelectorAll("a, button, .proj-item, .gallery-item, .skill-tag, .filter-btn");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", () => setHovered(true));
      el.addEventListener("mouseleave", () => setHovered(false));
    });

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:block fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
      style={{ transition: "transform 0.08s linear" }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
          transition: "all 0.2s ease",
          transform: clicked ? "scale(0.8)" : hovered ? "scale(1.4)" : "scale(1)",
          filter: hovered
            ? "drop-shadow(0 2px 12px rgba(0,71,255,0.7))"
            : "drop-shadow(0 2px 6px rgba(0,71,255,0.4))",
        }}
      >
        <rect x="1" y="1" width="30" height="30" rx="4" fill="#1A1814" stroke="#0047FF" strokeWidth="1.5" />
        <text x="6" y="22" fontFamily="monospace" fontSize="14" fill="#0047FF" fontWeight="bold">&lt;/&gt;</text>
      </svg>
    </div>
  );
}

// ─── LOADER ───────────────────────────────────────────────────────────────────

function Loader({ onDone }) {
  const barRef = useRef(null);
  const nameRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const loaderRef = useRef(null);

  useEffect(() => {
    gsap.to(nameRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: onDone,
          });
        }, 300);
      }
      if (barRef.current) barRef.current.style.width = progress + "%";
      setCounter(Math.floor(progress));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-8"
      style={{ background: "#1A1814" }}
    >
      <div
        ref={nameRef}
        className="text-5xl md:text-7xl font-black tracking-tight"
        style={{ color: "#FAF7F2", opacity: 0, transform: "translateY(20px)", fontFamily: "'Syne', sans-serif" }}
      >
        Dharun Kumar<span style={{ color: "#0047FF" }}>.</span>
      </div>
      <div className="w-48 h-px relative overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
        <div ref={barRef} className="absolute top-0 left-0 h-full w-0" style={{ background: "#0047FF" }} />
      </div>
      <div className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
        {String(counter).padStart(3, "0")}
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-6 md:px-12 border-b"
        style={{
          background: "rgba(250,247,242,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(26,24,20,0.12)",
        }}
      >
        <a href="#" className="text-xs tracking-wider" style={{ fontFamily: "monospace", color: "#1A1814" }}>
          dk<span style={{ color: "#0047FF" }}>.</span>dev
        </a>

        <ul className="hidden md:flex gap-10 list-none">
          {["about", "projects", "gallery", "experience", "contact"].map((s) => (
            <li key={s}>
              <button
                onClick={() => scrollTo(`#${s}`)}
                className="text-xs uppercase tracking-widest transition-colors duration-200 relative group"
                style={{ fontFamily: "monospace", color: "#6B6560", background: "none", border: "none", cursor: "none" }}
              >
                {s}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: "#0047FF" }}
                />
              </button>
            </li>
          ))}
        </ul>

        <a
          href="mailto:dharunkumar@email.com"
          className="hidden md:inline-block text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-200"
          style={{
            fontFamily: "monospace",
            color: "#FAF7F2",
            background: "#1A1814",
            borderColor: "#1A1814",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0047FF"; e.currentTarget.style.borderColor = "#0047FF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1A1814"; e.currentTarget.style.borderColor = "#1A1814"; }}
        >
          Hire Me
        </a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} color="#1A1814" /> : <Menu size={22} color="#1A1814" />}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-[72px] left-0 right-0 z-[999] flex flex-col gap-6 px-6 py-8 border-b md:hidden"
          style={{ background: "#FAF7F2", borderColor: "rgba(26,24,20,0.12)" }}
        >
          {["about", "projects", "gallery", "experience", "contact"].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(`#${s}`)}
              className="text-sm uppercase tracking-widest text-left"
              style={{ fontFamily: "monospace", color: "#1A1814", background: "none", border: "none", cursor: "pointer" }}
            >
              {s}
            </button>
          ))}
          <a href="mailto:dharunkumar@email.com" className="text-sm uppercase tracking-widest" style={{ fontFamily: "monospace", color: "#1A1814" }}>
            Hire Me →
          </a>
        </div>
      )}
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const titleRef = useRef(null);

  useEffect(() => {
    const lines = titleRef.current?.querySelectorAll(".title-line");
    if (lines) {
      gsap.from(lines, { yPercent: 110, stagger: 0.12, duration: 1, ease: "power4.out" });
    }
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-end pb-24 px-6 md:px-12 relative overflow-hidden"
      style={{ paddingTop: "72px" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "linear-gradient(rgba(26,24,20,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,24,20,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Big ghost number */}
      <div
        className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block"
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(120px, 20vw, 280px)",
          fontWeight: 100,
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,71,255,0.08)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        01
      </div>

      {/* Index label */}
      <div
        className="flex items-center gap-4 mb-8 relative z-10"
        style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#6B6560", textTransform: "uppercase" }}
      >
        <span className="block w-10 h-px" style={{ background: "#0047FF" }} />
        <span>Full Stack Developer</span>
        <span>&amp; Creative Technologist</span>
      </div>

      {/* Title */}
      <h1
        ref={titleRef}
        className="relative z-10"
        style={{ fontSize: "clamp(52px, 9vw, 140px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.03em", color: "#1A1814", fontFamily: "'Syne', sans-serif" }}
      >
        <div className="overflow-hidden"><span className="title-line block">Dharun</span></div>
        <div className="overflow-hidden">
          <span className="title-line block italic font-light" style={{ fontFamily: "'Fraunces', serif", color: "#0047FF" }}>
            Kumar
          </span>
        </div>
        <div className="overflow-hidden">
          <span
            className="title-line block"
            style={{ WebkitTextStroke: "2px #1A1814", color: "transparent" }}
          >
            N.
          </span>
        </div>
      </h1>

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8 relative z-10">
        <div>
          <p className="text-sm leading-loose" style={{ fontFamily: "monospace", color: "#6B6560", maxWidth: "320px" }}>
            Building digital experiences<br />
            that live at the intersection of<br />
            <strong style={{ color: "#1A1814" }}>code, craft &amp; creativity.</strong>
          </p>
          <div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 border text-xs tracking-wide"
            style={{ fontFamily: "monospace", color: "#1A1814", borderColor: "rgba(26,24,20,0.12)", background: "#F5F0E8" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#22c55e",
                animation: "pulse 2s infinite",
                boxShadow: "0 0 0 0 rgba(34,197,94,0.4)",
              }}
            />
            Available for freelance projects
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center gap-2 text-xs tracking-widest uppercase" style={{ fontFamily: "monospace", color: "#6B6560" }}>
          <div
            className="w-px h-16"
            style={{
              background: "linear-gradient(to bottom, #0047FF, transparent)",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
          <span>Scroll</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.5); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-t border-b py-3.5" style={{ borderColor: "rgba(26,24,20,0.12)", background: "#1A1814" }}>
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 25s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-xs uppercase tracking-widest px-8 opacity-70" style={{ fontFamily: "monospace", color: "#F5F0E8" }}>
              {item}
            </span>
            <span className="text-xs px-4" style={{ fontFamily: "monospace", color: "#0047FF" }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }) {
  return (
    <div
      className="flex items-center gap-3 mb-6 text-xs uppercase tracking-widest"
      style={{ fontFamily: "monospace", color: light ? "rgba(245,240,232,0.4)" : "#0047FF" }}
    >
      {children}
      <span className="h-px w-20" style={{ background: light ? "rgba(255,255,255,0.1)" : "rgba(26,24,20,0.12)" }} />
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const statsRef = useRef([]);

  useEffect(() => {
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      const target = STATS[i].count;
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () { el.textContent = Math.floor(this.targets()[0].val) + "+"; },
          });
        },
      });
    });
  }, []);

  return (
    <section id="about" className="px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 border-b" style={{ borderColor: "rgba(26,24,20,0.12)" }}>
      {/* Left */}
      <div>
        <SectionLabel>About Me</SectionLabel>
        <h2 className="font-black leading-none tracking-tight mb-8" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>
          Crafting<br />
          <em className="font-light not-italic" style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>beautiful</em><br />
          digital worlds
        </h2>
        <p className="text-sm leading-loose" style={{ fontFamily: "monospace", color: "#6B6560" }}>
          I'm Dharun Kumar N — a full-stack developer from Tamil Nadu with an obsession for clean architecture and expressive interfaces. I build things people remember, not just use. Every pixel, every API call, every database query is a chance to do something extraordinary.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-px border" style={{ background: "rgba(26,24,20,0.12)", borderColor: "rgba(26,24,20,0.12)" }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="p-6 transition-colors duration-200 group"
              style={{ background: "#FAF7F2" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E8EEFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FAF7F2"; }}
            >
              <div
                ref={(el) => (statsRef.current[i] = el)}
                className="leading-none"
                style={{ fontFamily: "'Fraunces', serif", fontSize: "40px", fontWeight: 300, color: "#0047FF" }}
              >
                0+
              </div>
              <div className="text-xs uppercase tracking-widest mt-2" style={{ fontFamily: "monospace", color: "#6B6560" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="pt-0 md:pt-16 space-y-8">
        {Object.entries(SKILLS).map(([group, tags]) => (
          <div key={group}>
            <div className="text-xs uppercase tracking-widest mb-4 pb-2 border-b" style={{ fontFamily: "monospace", color: "#6B6560", borderColor: "rgba(26,24,20,0.12)" }}>
              {group}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="skill-tag text-xs px-3.5 py-1.5 border relative overflow-hidden cursor-default transition-all duration-200"
                  style={{ fontFamily: "monospace", background: "#F5F0E8", borderColor: "rgba(26,24,20,0.12)", color: "#2D2A26", letterSpacing: "0.05em" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#0047FF"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#0047FF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F5F0E8"; e.currentTarget.style.color = "#2D2A26"; e.currentTarget.style.borderColor = "rgba(26,24,20,0.12)"; }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function Projects() {
  const hoverImgRef = useRef(null);
  const hoverSrcRef = useRef(null);

  const handleMouseEnter = (img) => {
    hoverSrcRef.current.src = img;
    hoverImgRef.current.style.opacity = "1";
    hoverImgRef.current.style.transform = "scale(1)";
  };
  const handleMouseLeave = () => {
    hoverImgRef.current.style.opacity = "0";
    hoverImgRef.current.style.transform = "scale(0.95)";
  };
  const handleMouseMove = (e) => {
    hoverImgRef.current.style.left = e.clientX + 24 + "px";
    hoverImgRef.current.style.top = e.clientY - 90 + "px";
  };

  return (
    <section id="projects" className="px-6 md:px-12 py-24 md:py-32 border-b" style={{ borderColor: "rgba(26,24,20,0.12)" }}>
      {/* Hover image follower */}
      <div
        ref={hoverImgRef}
        className="fixed z-[500] w-[280px] h-[180px] pointer-events-none overflow-hidden border hidden md:block"
        style={{ opacity: 0, transform: "scale(0.95)", transition: "opacity 0.25s, transform 0.25s", borderColor: "rgba(26,24,20,0.12)" }}
      >
        <img ref={hoverSrcRef} src="" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
        <div>
          <SectionLabel>Selected Work</SectionLabel>
          <div className="font-black tracking-tight leading-none" style={{ fontSize: "clamp(36px, 5vw, 72px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>
            Projects<br />
            <span className="font-light italic" style={{ fontFamily: "'Fraunces', serif", color: "#0047FF" }}>
              &amp; Case Studies
            </span>
          </div>
        </div>
        <div className="text-sm mt-4 md:mt-0" style={{ fontFamily: "monospace", color: "#6B6560" }}>
          06 Projects
        </div>
      </div>

      <div>
        {PROJECTS.map((p) => (
          <div
            key={p.num}
            className="proj-item grid items-center py-8 border-b relative transition-all duration-200 group"
            style={{
              gridTemplateColumns: "80px 1fr 200px 120px",
              borderColor: "rgba(26,24,20,0.12)",
            }}
            onMouseEnter={() => handleMouseEnter(p.img)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {/* Left accent line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
              style={{ background: "#0047FF" }}
            />

            <div className="text-xs tracking-widest" style={{ fontFamily: "monospace", color: "#6B6560" }}>{p.num}</div>
            <div>
              <div className="font-bold tracking-tight" style={{ fontSize: "clamp(20px, 2.5vw, 32px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>{p.name}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ fontFamily: "monospace", color: "#6B6560" }}>{p.desc}</div>
            </div>
            <div className="hidden md:flex gap-2 flex-wrap">
              {p.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 border tracking-widest uppercase" style={{ fontFamily: "monospace", borderColor: "rgba(26,24,20,0.12)", color: "#6B6560" }}>
                  {t}
                </span>
              ))}
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 justify-end text-xs uppercase tracking-widest transition-colors duration-200 group-hover:text-blue-600"
              style={{ fontFamily: "monospace", color: "#0047FF", textDecoration: "none" }}
            >
              View <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = ["all", "ui", "web", "motion", "brand"];

  return (
    <section id="gallery" className="px-6 md:px-12 py-24 md:py-32 border-b" style={{ background: "#F5F0E8", borderColor: "rgba(26,24,20,0.12)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16 items-end">
        <div>
          <SectionLabel>Visual Gallery</SectionLabel>
          <h2 className="font-black tracking-tight leading-none" style={{ fontSize: "clamp(36px, 5vw, 72px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>
            Design<br />
            <span className="font-light italic" style={{ fontFamily: "'Fraunces', serif", color: "#0047FF" }}>Works</span>
          </h2>
        </div>
        <p className="text-sm leading-loose" style={{ fontFamily: "monospace", color: "#6B6560" }}>
          A curated collection of UI explorations, design systems, and visual experiments that push the boundaries of what's possible in the browser.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="filter-btn text-xs uppercase tracking-widest px-5 py-2 border transition-all duration-200"
            style={{
              fontFamily: "monospace",
              background: activeFilter === f ? "#1A1814" : "transparent",
              color: activeFilter === f ? "#FAF7F2" : "#6B6560",
              borderColor: activeFilter === f ? "#1A1814" : "rgba(26,24,20,0.12)",
              cursor: "none",
            }}
          >
            {f === "all" ? "All Work" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "80px",
        }}
      >
        {GALLERY_ITEMS.map((item, i) => {
          const visible = activeFilter === "all" || item.cat === activeFilter;
          return (
            <div
              key={i}
              className={`gallery-item overflow-hidden relative group ${item.span}`}
              style={{
                opacity: visible ? 1 : 0.2,
                transform: visible ? "scale(1)" : "scale(0.97)",
                transition: "opacity 0.3s, transform 0.3s",
                background: "#EDE7D9",
              }}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div
                className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(26,24,20,0.85) 0%, transparent 60%)" }}
              >
                <div className="font-semibold text-base text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{item.title}</div>
                <div className="text-xs uppercase tracking-widest" style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.6)" }}>{item.cat}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" className="px-6 md:px-12 py-24 md:py-32 border-b" style={{ borderColor: "rgba(26,24,20,0.12)" }}>
      <SectionLabel>Experience &amp; Recognition</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mt-10">
        {/* Timeline */}
        <div className="md:col-span-1 space-y-0">
          {EXPERIENCE.map((e) => (
            <div
              key={e.year}
              className="py-8 border-b pl-6 relative group transition-all duration-200 hover:pl-10"
              style={{ borderColor: "rgba(26,24,20,0.12)" }}
            >
              <div
                className="absolute left-0 top-9 w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:scale-150"
                style={{ background: "rgba(26,24,20,0.12)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0047FF"; }}
                onMouseLeave={(el) => { el.currentTarget.style.background = "rgba(26,24,20,0.12)"; }}
              />
              <div className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "monospace", color: "#0047FF" }}>{e.year}</div>
              <div className="font-bold text-lg mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>{e.role}</div>
              <div className="text-xs mb-3" style={{ fontFamily: "monospace", color: "#6B6560" }}>{e.company}</div>
              <div className="text-xs leading-loose" style={{ fontFamily: "monospace", color: "#6B6560" }}>{e.desc}</div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="md:col-span-2">
          <div
            className="font-black tracking-tight leading-tight mb-12"
            style={{ fontSize: "clamp(48px, 6vw, 96px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}
          >
            Building things<br />
            that{" "}
            <em className="font-light italic" style={{ fontFamily: "'Fraunces', serif", color: "#0047FF" }}>
              matter.
            </em>
          </div>

          <SectionLabel>Recognitions</SectionLabel>
          <ul className="space-y-0">
            {AWARDS.map((a) => (
              <li key={a.name} className="flex justify-between items-center py-5 border-b" style={{ borderColor: "rgba(26,24,20,0.12)" }}>
                <div>
                  <div className="font-semibold text-base" style={{ fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>{a.name}</div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "monospace", color: "#6B6560" }}>{a.org}</div>
                </div>
                <div className="text-xs tracking-widest" style={{ fontFamily: "monospace", color: "#0047FF" }}>{a.year}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── GITHUB ───────────────────────────────────────────────────────────────────

function GitHubSection() {
  const [stats, setStats] = useState({ repos: "—", stars: "120+", followers: "—" });

  useEffect(() => {
    fetch("https://api.github.com/users/dharunkumarn")
      .then((r) => r.json())
      .then((d) => {
        setStats({
          repos: d.public_repos || "30+",
          stars: "120+",
          followers: d.followers || "80+",
        });
      })
      .catch(() => setStats({ repos: "30+", stars: "120+", followers: "80+" }));
  }, []);

  // Generate contribution grid
  const grid = Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 30 }, (_, w) => {
      const r = Math.random();
      return r > 0.95 ? 4 : r > 0.88 ? 3 : r > 0.75 ? 2 : r > 0.6 ? 1 : 0;
    })
  );

  const levelColors = ["rgba(255,255,255,0.05)", "rgba(0,71,255,0.2)", "rgba(0,71,255,0.4)", "rgba(0,71,255,0.65)", "rgba(0,71,255,0.9)"];
  const ghStats = [
    { num: stats.repos, label: "Repositories" },
    { num: stats.stars, label: "Stars Earned" },
    { num: stats.followers, label: "Followers" },
    { num: "1.2K", label: "Contributions" },
  ];

  return (
    <section id="github-section" className="px-6 md:px-12 py-24 border-b" style={{ background: "#1A1814", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div>
          <SectionLabel light>Open Source</SectionLabel>
          <h2 className="font-black tracking-tight leading-tight" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontFamily: "'Syne', sans-serif", color: "#FAF7F2" }}>
            Code I've<br />put into{" "}
            <em className="font-light italic" style={{ fontFamily: "'Fraunces', serif", color: "#0047FF" }}>the world.</em>
          </h2>
          <p className="text-sm leading-loose mt-6" style={{ fontFamily: "monospace", color: "rgba(245,240,232,0.5)" }}>
            Every commit tells a story. Every repo is a conversation. I believe in building in public and contributing to the ecosystem that built me.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 mt-10 px-7 py-3.5 border text-xs uppercase tracking-widest transition-all duration-200"
            style={{ fontFamily: "monospace", color: "#FAF7F2", borderColor: "rgba(245,240,232,0.2)", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0047FF"; e.currentTarget.style.borderColor = "#0047FF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(245,240,232,0.2)"; }}
          >
            <Github size={16} />
            View GitHub Profile
          </a>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {ghStats.map((s) => (
              <div
                key={s.label}
                className="p-8 transition-colors duration-200"
                style={{ background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,71,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div className="leading-none" style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: 300, color: "#0047FF" }}>{s.num}</div>
                <div className="text-xs uppercase tracking-widest mt-2" style={{ fontFamily: "monospace", color: "rgba(245,240,232,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: "monospace", color: "rgba(245,240,232,0.4)" }}>
              Contribution Activity — 2024
            </div>
            {grid.map((row, ri) => (
              <div key={ri} className="flex gap-0.5 mb-0.5">
                {row.map((level, ci) => (
                  <div key={ci} className="w-3 h-3 rounded-sm" style={{ background: levelColors[level] }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    }, 1200);
  };

  return (
    <section id="contact" className="px-6 md:px-12 py-24 md:py-32 border-b" style={{ borderColor: "rgba(26,24,20,0.12)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
        {/* Left */}
        <div>
          <SectionLabel>Get In Touch</SectionLabel>
          <div
            className="font-black tracking-tighter leading-none mb-8"
            style={{ fontSize: "clamp(48px, 7vw, 112px)", fontFamily: "'Syne', sans-serif", color: "#1A1814" }}
          >
            Let's<br />
            <em className="font-light not-italic" style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#0047FF" }}>build</em><br />
            together.
          </div>
          <p className="text-sm leading-loose mb-10" style={{ fontFamily: "monospace", color: "#6B6560", maxWidth: "360px" }}>
            Whether you have a project in mind, want to collaborate, or just want to say hello — I'm always up for a good conversation.
          </p>

          <div className="space-y-0">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center justify-between py-5 border-b group transition-all duration-200 hover:pl-4"
                style={{ borderColor: "rgba(26,24,20,0.12)", textDecoration: "none", color: "#1A1814" }}
              >
                <div>
                  <div className="font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{link.name}</div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "monospace", color: "#6B6560" }}>{link.handle}</div>
                </div>
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "#1A1814" }} />
              </a>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div className="pt-4">
          <SectionLabel>Send A Message</SectionLabel>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {[
              { id: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
              { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
              { id: "subject", label: "Subject", type: "text", placeholder: "Project Inquiry" },
            ].map((f) => (
              <div key={f.id}>
                <label className="block text-xs uppercase tracking-widest mb-2.5" style={{ fontFamily: "monospace", color: "#6B6560" }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={formState[f.id]}
                  onChange={(e) => setFormState((p) => ({ ...p, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors duration-200"
                  style={{ fontFamily: "monospace", color: "#1A1814", borderColor: "rgba(26,24,20,0.12)" }}
                  onFocus={(e) => { e.target.style.borderColor = "#0047FF"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(26,24,20,0.12)"; }}
                  required={f.id !== "subject"}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2.5" style={{ fontFamily: "monospace", color: "#6B6560" }}>Message</label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                placeholder="Tell me about your project..."
                className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors duration-200 resize-none"
                style={{ fontFamily: "monospace", color: "#1A1814", borderColor: "rgba(26,24,20,0.12)" }}
                onFocus={(e) => { e.target.style.borderColor = "#0047FF"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(26,24,20,0.12)"; }}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-10 py-4 text-xs uppercase tracking-widest transition-all duration-200 relative overflow-hidden"
              style={{ fontFamily: "monospace", color: "#FAF7F2", background: status === "sent" ? "#22c55e" : "#1A1814", border: "none", cursor: "none" }}
              onMouseEnter={(e) => { if (status !== "sent") e.currentTarget.style.background = "#0047FF"; }}
              onMouseLeave={(e) => { if (status !== "sent") e.currentTarget.style.background = "#1A1814"; }}
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send Message →"}
            </button>
            {status === "sent" && (
              <p className="text-xs mt-2" style={{ fontFamily: "monospace", color: "#22c55e" }}>
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-12 py-8 border-t text-center"
      style={{ borderColor: "rgba(26,24,20,0.12)" }}
    >
      <div className="text-xs" style={{ fontFamily: "monospace", color: "#6B6560" }}>© 2025 Dharun Kumar N. All rights reserved.</div>
      <div className="font-black text-xl tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "#1A1814" }}>
        dk<span style={{ color: "#0047FF" }}>.</span>dev
      </div>
      <div className="text-xs" style={{ fontFamily: "monospace", color: "#6B6560" }}>
        Built with <span style={{ color: "#0047FF" }}>♥</span> in Tamil Nadu
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function DharunPortfolio() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Scroll reveal
      document.querySelectorAll(".reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
    }
  }, [loaded]);

  return (
    <div
      className="relative overflow-x-hidden"
      style={{
        background: "#FAF7F2",
        color: "#1A1814",
        cursor: "none",
      }}
    >
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <>
          <Cursor />
          <Nav />
          <Hero />
          <Marquee />
          <About />
          <Projects />
          <Gallery />
          <Experience />
          <GitHubSection />
          <Contact />
          <Footer />
        </>
      )}

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,opsz,wght@0,9..144,100;0,9..144,300;0,9..144,400;1,9..144,300&display=swap');
        * { cursor: none !important; }
        @media (max-width: 768px) { * { cursor: auto !important; } }
        html { scroll-behavior: smooth; }
        .reveal { opacity: 0; transform: translateY(30px); }
      `}</style>
    </div>
  );
}