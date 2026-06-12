import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const CONFIG = {
  timeZone: "Europe/Zagreb",
};

const PROJECTS = [
  { artist: "DEATH ON THE BALCONY", album: "VICE", category: "SINGLE", label: "SELF RELEASED", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-001.jpg" },
  { artist: "JIMMY WHOO", album: "NIGHTFALL", category: "EP", label: "DEEP HOUSE", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-002.jpg" },
  { artist: "HERMANOS GUTIÉRREZ", album: "EL BUENO Y EL MALO", category: "ALBUM", label: "EASY EYE SOUND", year: "2022", image:"https://images.unsplash.com/photo-1602353195884-44ea7e76e196?w=200" },
  { artist: "NEIL FRANCES", album: "LINES", category: "ALBUM", label: "ISKA DHAMD", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-004.jpg" },
  { artist: "ADDEX", album: "MIDNIGHT SESSIONS", category: "EP", label: "ELECTRONIC", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-005.jpg" },
  { artist: "BEYHUDE", album: "YALNIZLIK", category: "SINGLE", label: "ALBÜM YAPIM", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-006.jpg" },
  { artist: "THING", album: "SHAPES", category: "ALBUM", label: "KOMPAKT", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-007.jpg" },
  { artist: "ABAKUS", album: "THAT MUCH CLOSER TO THE SUN", category: "ALBUM", label: "BEATSERVICE", year: "2020", image: "https://assets.codepen.io/7558/portrait-fashion-008.jpg" },
  { artist: "SAINTÉ", album: "ANXIETY", category: "SINGLE", label: "PARLOPHONE", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-001.jpg" },
  { artist: "CANNONS", album: "FEVER DREAM", category: "ALBUM", label: "COLUMBIA", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-002.jpg" },
  { artist: "BAWO", album: "REAL LIES", category: "EP", label: "NINJA TUNE", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-003.jpg" },
  { artist: "SUMAC DUB", album: "ECHOES FROM THE VOID", category: "ALBUM", label: "DUB RECORDS", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-004.jpg" },
  { artist: "LEISURE", album: "THE BIG DOOR", category: "ALBUM", label: "CASCINE", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-005.jpg" },
  { artist: "MINDCHATTER", album: "IMAGINARY FRIENDS", category: "ALBUM", label: "INDEPENDENT", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-006.jpg" },
  { artist: "DJ CINÉMA QUARTIER LATIN", album: "NUIT BLANCHE", category: "MIX", label: "KITSUNE", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-007.jpg" },
  { artist: "EVREN FURTUNA", album: "COSMIC FREQUENCIES", category: "EP", label: "DEEP TECH", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-008.jpg" },
  { artist: "PABLO BOLIVAR", album: "MEMORIES", category: "ALBUM", label: "SEVEN VILLAS", year: "2021", image: "https://assets.codepen.io/7558/portrait-fashion-001.jpg" },
  { artist: "DIALE", album: "FRAGMENTS", category: "EP", label: "AFTERLIFE", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-002.jpg" },
  { artist: "MARTIN ROTH", album: "REBIRTH", category: "ALBUM", label: "IBOGA", year: "2022", image: "https://assets.codepen.io/7558/portrait-fashion-003.jpg" },
  { artist: "KLARTRAUM", album: "LUCID", category: "ALBUM", label: "LUCIDFLOW", year: "2023", image: "https://assets.codepen.io/7558/portrait-fashion-004.jpg" },
];

// ─── Time Display ─────────────────────────────────────────────────────────────
function useTime() {
  const [time, setTime] = useState({ hours: "", minutes: "", dayPeriod: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: CONFIG.timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      });
      const parts = formatter.formatToParts(now);
      setTime({
        hours: parts.find((p) => p.type === "hour")?.value ?? "",
        minutes: parts.find((p) => p.type === "minute")?.value ?? "",
        dayPeriod: parts.find((p) => p.type === "dayPeriod")?.value ?? "",
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  
  return time;
}

// ─── Project Row ──────────────────────────────────────────────────────────────
function ProjectRow({ project, index, isActive, isHasActive, onEnter, onLeave }) {
  const artistRef = useRef(null);
  const albumRef = useRef(null);
  const categoryRef = useRef(null);
  const labelRef = useRef(null);
  const yearRef = useRef(null);
  const refs = [artistRef, albumRef, categoryRef, labelRef, yearRef];
  const texts = [project.artist, project.album, project.category, project.label, project.year];

  const handleMouseEnter = useCallback(() => {
    onEnter(index);
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      gsap.to(ref.current, {
        duration: 0.8,
        scrambleText: {
          text: texts[i],
          chars: "qwerty1337h@ck3r",
          revealDelay: 0.3,
          speed: 0.4,
        },
      });
    });
  }, [index, onEnter]);

  const handleMouseLeave = useCallback(() => {
    onLeave();
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      gsap.killTweensOf(ref.current);
      ref.current.textContent = texts[i];
    });
  }, [onLeave]);

  const num = String(index + 1).padStart(2, "0");

  const rowOpacity =
    isHasActive && !isActive ? "opacity-30" : "opacity-100";

  return (
    <li
      className={`
        group relative w-full flex items-center
        border-b border-[rgba(200,255,200,0.1)]
        py-3 cursor-pointer transition-all duration-300
        ${rowOpacity}
        ${isActive ? "shadow-[inset_0_1px_0_rgba(200,255,200,0.2),inset_0_-1px_0_rgba(200,255,200,0.2)]" : ""}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Counter */}
      <span className="w-10 shrink-0 text-[rgba(250,225,250,0.6)] z-10 relative transition-opacity duration-100">
        {num}
      </span>

      {/* Grid of data */}
      <div className="flex-1 grid grid-cols-[1fr_2fr_1fr_1fr_80px] gap-x-8 items-center max-xl:grid-cols-[1fr_1.5fr_0.8fr_0.8fr_60px] max-xl:gap-x-4 max-md:grid-cols-[1fr_1fr] max-md:gap-x-4">
        {[
          { ref: artistRef, text: project.artist, cls: "justify-self-start" },
          { ref: albumRef,  text: project.album,  cls: "justify-self-start" },
          { ref: categoryRef, text: project.category, cls: "justify-self-start max-md:hidden" },
          { ref: labelRef, text: project.label, cls: "justify-self-start max-md:hidden" },
          { ref: yearRef,  text: project.year,  cls: "justify-self-end text-right max-md:hidden" },
        ].map(({ ref, text, cls }, i) => (
          <span
            key={i}
            ref={ref}
            className={`
              relative whitespace-nowrap overflow-hidden text-ellipsis leading-none
              text-[rgb(250,225,250)] z-[1] transition-all duration-300 py-0.5 px-0.5
              group-hover:text-[rgb(10,10,10)]
              before:content-[''] before:absolute before:top-0 before:-left-2 before:w-[calc(100%+16px)] before:h-[calc(100%-2px)]
              before:bg-[rgb(255,223,0)] before:transition-transform before:duration-300
              before:scale-x-0 before:origin-left before:-z-[1]
              group-hover:before:scale-x-100
              ${cls}
            `}
          >
            {text}
          </span>
        ))}
      </div>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MusicPortfolio() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [bgImage, setBgImage] = useState("");
  const [bgVisible, setBgVisible] = useState(false);
  const [bgScale, setBgScale] = useState(1.2);

  const bgRef = useRef(null);
  const idleTimerRef = useRef(null);
  const idleAnimRef = useRef(null);
  const containerRef = useRef(null);
  const time = useTime();

  // Preload images
  useEffect(() => {
    PROJECTS.forEach((p) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.image;
    });
  }, []);

  const stopIdleAnimation = useCallback(() => {
    if (idleAnimRef.current) {
      idleAnimRef.current.kill();
      idleAnimRef.current = null;
      gsap.set(document.querySelectorAll(".proj-data"), { opacity: 1 });
    }
  }, []);

  const startIdleAnimation = useCallback(() => {
    if (idleAnimRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    idleAnimRef.current = tl;

    const columns = ["artist", "album", "category", "label", "year"].map((cls) =>
      [...document.querySelectorAll(`.proj-${cls}`)]
    );

    const totalRows = PROJECTS.length;
    const rowDelay = 0.05;
    const hideShowGap = totalRows * rowDelay * 0.5;
    const columnStartDelay = 0.25;

    columns.forEach((elements, colIdx) => {
      const colStart = (colIdx + 1) * columnStartDelay;
      elements.forEach((el, rowIdx) => {
        tl.to(el, { duration: 0.1, opacity: 0.05, ease: "power2.inOut" }, colStart + rowIdx * rowDelay);
        tl.to(el, { duration: 0.1, opacity: 1,    ease: "power2.inOut" }, colStart + hideShowGap + rowIdx * rowDelay);
      });
    });
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) startIdleAnimation();
    }, 3000);
  }, [activeIndex, startIdleAnimation]);

  // Start idle on mount
  useEffect(() => {
    startIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const showBg = (imageUrl) => {
    setBgImage(imageUrl);
    setBgScale(1.2);
    setBgVisible(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setBgScale(1.0))
    );
  };

  const hideBg = () => setBgVisible(false);

  const handleRowEnter = useCallback((index) => {
    stopIdleAnimation();
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setActiveIndex(index);
    showBg(PROJECTS[index].image);
  }, [stopIdleAnimation]);

  const handleRowLeave = useCallback(() => {
    // individual row leave — do nothing, container leave handles clearing
  }, []);

  const handleContainerLeave = useCallback(() => {
    setActiveIndex(-1);
    hideBg();
    startIdleTimer();
  }, [startIdleTimer]);

  return (
    <div
      className="relative z-0 min-h-screen overflow-hidden flex justify-center items-center"
      style={{ backgroundColor: "rgb(5,5,5)", color: "rgb(250,225,250)" }}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.05) 4px)`,
        }}
      />

      {/* Noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[100] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Background image */}
      <div
        ref={bgRef}
        className="fixed top-1/2 left-1/2 w-[800px] h-[600px] -z-[2] bg-cover bg-center transition-[opacity,transform] duration-[600ms,800ms] ease-[ease,cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : "none",
          opacity: bgVisible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${bgScale})`,
        }}
      />

      {/* Portfolio list */}
      <main
        ref={containerRef}
        className="w-full px-8 max-md:px-4 relative"
        style={{ fontFamily: "'PP Supply Mono', monospace" }}
        onMouseLeave={handleContainerLeave}
      >
        <h1 className="sr-only">Music Portfolio</h1>
        <ul role="list" className="m-0 p-0 list-none">
          {PROJECTS.map((project, i) => (
            <ProjectRow
              key={i}
              project={project}
              index={i}
              isActive={activeIndex === i}
              isHasActive={activeIndex !== -1}
              onEnter={handleRowEnter}
              onLeave={handleRowLeave}
            />
          ))}
        </ul>
      </main>

      {/* Corner elements */}
      <aside
        className="fixed inset-0 grid pointer-events-none p-8 z-[200]"
        style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}
      >
        {/* Top-left square */}
        <div className="self-start justify-self-start pointer-events-auto">
          <div className="w-2 h-2" style={{ backgroundColor: "rgb(250,225,250)" }} />
        </div>

        {/* Top-right nav */}
        <nav
          className="self-start justify-self-end pointer-events-auto text-xs tracking-wider uppercase"
          style={{ fontFamily: "'PP Supply Mono', monospace", color: "rgb(250,225,250)" }}
        >
          <a href="https://open.spotify.com/user/226ilulo57zutgtiwjsjqnqsy" className="hover:underline" style={{ color: "inherit" }}>Spotify</a>
          {" | "}
          <a href="mailto:hi@filip.fyi" className="hover:underline" style={{ color: "inherit" }}>Email</a>
          {" | "}
          <a href="https://x.com/filipz" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "inherit" }}>X</a>
        </nav>

        {/* Bottom-left coords */}
        <div
          className="self-end justify-self-start text-xs tracking-wider uppercase"
          style={{ fontFamily: "'PP Supply Mono', monospace", color: "rgb(250,225,250)" }}
        >
          43.9250° N, 19.5530° E
        </div>

        {/* Bottom-right time */}
        <time
          className="self-end justify-self-end text-xs tracking-wider uppercase"
          style={{ fontFamily: "'PP Supply Mono', monospace", color: "rgb(250,225,250)" }}
        >
          {time.hours}
          <span className="animate-[blink_1s_steps(1)_infinite]">:</span>
          {time.minutes} {time.dayPeriod}
        </time>
      </aside>

      {/* Font + blink keyframes */}
      <style>{`
        @font-face {
          font-family: "PP Supply Mono";
          src: url("https://assets.codepen.io/7558/PPSupplyMono-Variable.woff2") format("woff2");
          font-weight: 100 900;
          font-display: swap;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        body {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>

    </div>
  );
}