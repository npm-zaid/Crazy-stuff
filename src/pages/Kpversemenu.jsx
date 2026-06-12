import { useState, useEffect, useRef, useCallback } from "react";

const menuItems = [
  { label: "story", sub: "page 001" },
  { label: "Protocol", sub: "20 ideas" },
  { label: "journal", sub: "10 notes" },
  { label: "contact", sub: "email now" },
  { label: "gallery", sub: "check out", active: true },
  { label: "about", sub: "our office" },
];

const bottomLinks = [
  { title: "connect", content: "Discord" },
  { title: "buy On", content: "Opensea" },
  { title: "us-en", content: "2022" },
];

// ── Shuffle effect on any element whose chars are already split ──────────────
function addShuffleEffect(chars, originalTexts) {
  const SHUFFLE_INTERVAL = 10;
  const RESET_DELAY = 75;
  const ADDITIONAL_DELAY = 150;

  chars.forEach((char, i) => {
    setTimeout(() => {
      const interval = setInterval(() => {
        char.textContent = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      }, SHUFFLE_INTERVAL);
      setTimeout(() => {
        clearInterval(interval);
        char.textContent = originalTexts[i];
      }, RESET_DELAY + i * ADDITIONAL_DELAY);
    }, i * SHUFFLE_INTERVAL);
  });
}

// ── Split a DOM element's text into individual <span> char nodes ─────────────
function splitIntoChars(el) {
  const text = el.textContent;
  el.textContent = "";
  const spans = [...text].map((ch) => {
    const s = document.createElement("span");
    s.textContent = ch;
    s.className = "char";
    el.appendChild(s);
    return s;
  });
  return { spans, originals: [...text] };
}

// ── MenuItem ─────────────────────────────────────────────────────────────────
function MenuItem({ label, sub, active, animateIn, delay = 0 }) {
  const linkRef = useRef(null);
  const spanRef = useRef(null);
  const bgRef = useRef(null);
  const charStateRef = useRef(null);

  // Split chars once on mount
  useEffect(() => {
    const linkEl = linkRef.current;
    const spanEl = spanRef.current;
    if (!linkEl || !spanEl) return;

    const linkSplit = splitIntoChars(linkEl);
    const spanSplit = splitIntoChars(spanEl);

    // Size the bg-hover based on link width
    if (bgRef.current) {
      bgRef.current.style.width = linkEl.offsetWidth + 30 + "px";
    }
    // Position the sub-label
    spanEl.style.left = linkEl.offsetWidth + 40 + "px";

    charStateRef.current = {
      linkChars: linkSplit.spans,
      linkOriginals: linkSplit.originals,
      spanChars: spanSplit.spans,
      spanOriginals: spanSplit.originals,
    };
  }, []);

  const handleEnter = useCallback(() => {
    const s = charStateRef.current;
    if (!s) return;
    // Shuffle both link + span
    addShuffleEffect(s.linkChars, s.linkOriginals);
    addShuffleEffect(s.spanChars, s.spanOriginals);
    // Animate span chars to char-active
    s.spanChars.forEach((c, i) => {
      setTimeout(() => c.classList.add("char-active"), i * 50);
    });
  }, []);

  const handleLeave = useCallback(() => {
    const s = charStateRef.current;
    if (!s) return;
    s.spanChars.forEach((c) => c.classList.remove("char-active"));
  }, []);

  return (
    <div
      className="menu-item relative"
      style={{
        padding: "0.4em 0",
        left: animateIn ? "0px" : "-100px",
        transition: `left 0.3s ease ${delay}ms`,
      }}
    >
      <div className="menu-item-link relative" style={{ display: "inline-block" }}>
        {/* Sliding background */}
        <div
          ref={bgRef}
          className="bg-hover absolute top-0 left-0 h-full"
          style={{
            backgroundColor: active ? "aquamarine" : "#fff",
            clipPath: "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0% 50%)",
            zIndex: 0,
            opacity: active ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        />
        <a
          href="#"
          ref={linkRef}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="relative z-10 no-underline font-bold"
          style={{
            fontSize: "clamp(28px, 4.5vw, 52px)",
            letterSpacing: -2,
            color: active ? "#000" : "#fff",
            paddingLeft: 10,
            textTransform: "uppercase",
            display: "block",
            lineHeight: 1.1,
          }}
          onClick={(e) => e.preventDefault()}
        >
          {label}
        </a>
      </div>
      {/* Animated sub-label */}
      <span
        ref={spanRef}
        className="absolute top-0"
        style={{
          paddingTop: "1.4em",
          fontSize: 10,
          textTransform: "uppercase",
          lineHeight: "100%",
          color: active ? "#fff" : "#555",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </span>

      <style>{`
        .menu-item:hover .bg-hover { opacity: 1 !important; }
        .menu-item:hover a { color: #000 !important; }
        .char-active { color: #fff !important; }
        .char { color: inherit; }
      `}</style>
    </div>
  );
}

// ── BottomSubItem ─────────────────────────────────────────────────────────────
function BottomSubItem({ title, content }) {
  const contentRef = useRef(null);
  const charStateRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const split = splitIntoChars(el);
    charStateRef.current = split;
  }, []);

  const handleEnter = useCallback(() => {
    const s = charStateRef.current;
    if (!s) return;
    addShuffleEffect(s.spans, s.originals);
  }, []);

  return (
    <div
      className="flex gap-4 w-full"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.125)",
        padding: "1em 2em",
      }}
    >
      <div className="flex-1">
        <p style={{ fontSize: 10, textTransform: "uppercase", lineHeight: "100%", color: "#fff" }}>
          {title}
        </p>
      </div>
      <div className="flex-[4] pl-8">
        <p
          ref={contentRef}
          onMouseEnter={handleEnter}
          className="relative w-max cursor-pointer"
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            lineHeight: "100%",
            color: "#fff",
            padding: "0.125em",
          }}
        >
          {content}
          <style>{`
            p.hover-wipe::after {
              content: '';
              position: absolute;
              top: 0; left: 0;
              width: 0%; height: 100%;
              background: #fff;
              mix-blend-mode: difference;
              animation: hoverEffect 1s ease forwards;
            }
            @keyframes hoverEffect {
              0%,100% { width: 0%; left: 0; }
              50% { width: 100%; left: 0; }
              51% { left: auto; right: 0; width: 100%; }
              100% { left: auto; right: 0; width: 0%; }
            }
          `}</style>
        </p>
      </div>
    </div>
  );
}

// ── Main KPVerseMenu ──────────────────────────────────────────────────────────
export default function KPVerseMenu() {
  const [open, setOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    // slight delay so CSS transition kicks in first
    setTimeout(() => setAnimateIn(true), 20);
  }, []);

  const handleClose = useCallback(() => {
    setAnimateIn(false);
    setTimeout(() => setOpen(false), 500);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Google font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full flex justify-between items-center p-8 z-10">
        <button
          onClick={handleOpen}
          className="bg-transparent border-none cursor-pointer"
          style={{ fontSize: 10, textTransform: "uppercase", fontFamily: "inherit" }}
        >
          Menu
        </button>
        <p style={{ fontSize: 10, textTransform: "uppercase" }}>Collection</p>
      </nav>

      {/* Menu panel */}
      <div
        className="fixed top-0 left-0 h-full p-6 flex justify-center items-center z-20"
        style={{
          width: "clamp(360px, 45vw, 640px)",
          transform: open ? "translateX(0)" : "translateX(-110%)",
          transition: "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
        }}
      >
        <div
          className="w-full h-full rounded-[20px] flex"
          style={{ background: "#000", color: "#fff", overflow: "hidden" }}
        >
          {/* Main column — takes all space except the narrow sidebar */}
          <div
            className="flex flex-col justify-between min-w-0"
            style={{ flex: "1 1 0", borderRight: "1px solid rgba(255,255,255,0.125)" }}
          >
            {/* Top */}
            <div
              className="flex min-w-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.125)" }}
            >
              {/* "DISCOVER" label — hidden on small panels */}
              <div
                className="p-8 shrink-0 hidden sm:block"
                style={{ width: 80 }}
              >
                <p style={{ fontSize: 10, textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>discover</p>
              </div>

              {/* Items — take remaining width, no overflow clipping */}
              <div
                className="flex flex-col min-w-0 w-full"
                style={{ padding: "1.25em 0", overflow: "visible" }}
              >
                {menuItems.map((item, i) => (
                  <MenuItem
                    key={item.label}
                    {...item}
                    animateIn={animateIn}
                    delay={i * 50}
                  />
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col">
              {bottomLinks.map((bl) => (
                <BottomSubItem key={bl.title} {...bl} />
              ))}
            </div>
          </div>

          {/* Sidebar — fixed narrow strip */}
          <div
            className="flex flex-col justify-between shrink-0"
            style={{ width: 44 }}
          >
            <button
              onClick={handleClose}
              className="flex items-center justify-center cursor-pointer bg-transparent border-none text-white"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.125)",
                padding: "1.25em 0",
                fontSize: 16,
                width: "100%",
              }}
            >
              ✕
            </button>
            <div className="flex items-center justify-center pb-6" style={{ fontSize: 16, color: "#fff" }}>
              ⬡
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-10"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={handleClose}
        />
      )}
    </div>
  );
}