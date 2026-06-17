
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Bell, ChevronLeft, ChevronRight, Check, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const BOTTLE_IMG =
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/ret-square-05-trans.png?v=1753032835";

const RELATED_PRODUCTS = [
  { id: "retinol", tag: "New", name: "Retinol serum", sub: "Great subtext line", price: "£42", theme: "mint" },
  { id: "inflacin", tag: "Bestseller", name: "Inflacin serum", sub: "Great subtext line", price: "£38", theme: "peach" },
  { id: "litaderm", tag: "Limited", name: "Litaderm serum", sub: "Great subtext line", price: "£45", theme: "lavender" },
];

const ACCORDION_ITEMS = [
  {
    key: "description",
    label: "Description",
    body: "A premium kohaku-inspired sparkling water, sourced from a single Japanese alpine spring and infused with cold-pressed citrus oils.",
  },
  {
    key: "nutrition",
    label: "Nutrition",
    body: "Zero calories. Zero sugar. Trace electrolytes from natural mineral content — sodium, calcium, magnesium.",
  },
  {
    key: "ingredients",
    label: "Ingredients",
    body: "Fresh, tangy and zesty lime with refreshing minty notes.",
  },
];

const THEME_BG = {
  mint: "bg-gradient-to-br from-[#d4eedf] to-[#b8e6cf]",
  peach: "bg-gradient-to-br from-[#ffe4cc] to-[#ffcfa8]",
  lavender: "bg-gradient-to-br from-[#e4dcff] to-[#c8baff]",
};

const SPHERE_BASE =
  "absolute z-[4] rounded-full bg-[radial-gradient(circle_at_30%_25%,#ffffff_0%,#f0f0f3_40%,#c0c0c8_100%)] " +
  "shadow-[inset_0_-4px_8px_rgba(0,0,0,0.1),inset_0_3px_5px_rgba(255,255,255,0.6),0_6px_14px_rgba(0,0,0,0.1),0_18px_32px_rgba(0,0,0,0.06)]";

export default function ProductHero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cartBtnRef = useRef(null);
  const bellBtnRef = useRef(null);

  const [brandOn, setBrandOn] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [likedProducts, setLikedProducts] = useState({});
  const [openAccordion, setOpenAccordion] = useState("ingredients");
  const [cartCount, setCartCount] = useState(3);

  // ─────────────────────────────────────────────────────────
  // Page-load timeline, ambient floats, parallax, scroll reveal
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root) return;

    const q = (sel) => root.querySelector(sel);
    const qa = (sel) => Array.from(root.querySelectorAll(sel));

    // prep hand-drawn paths for stroke-draw animation
    const drawPaths = [q(".js-organic-path"), q(".js-arrow-path"), q(".js-ribbon-path"), ...qa(".js-stamp-path")].filter(
      Boolean
    );
    drawPaths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    gsap.set(qa(".js-header-item"), { y: -16, opacity: 0 });
    gsap.set(qa(".js-title-line"), { yPercent: 100, opacity: 0 });
    gsap.set(q(".js-stamp"), { scale: 0, opacity: 0 });
    gsap.set(qa(".js-price, .js-desc, .js-cta-row"), { y: 20, opacity: 0 });
    gsap.set(q(".js-arch"), { scale: 0.55, opacity: 0 });
    gsap.set(qa(".js-arch-ring"), { scale: 0.6, opacity: 0 });
    gsap.set(q(".js-bottle"), { y: 60, opacity: 0, scale: 0.92 });
    gsap.set(qa(".js-sphere"), { scale: 0, opacity: 0 });
    gsap.set(qa(".js-notif"), { y: 30, opacity: 0, scale: 0.9 });
    gsap.set(q(".js-scroll-down"), { y: 20, opacity: 0 });
    gsap.set(qa(".js-pagination, .js-accordion"), { y: 20, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
    tl.to(qa(".js-header-item"), { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 })
      .to(qa(".js-title-line"), { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power4.out" }, "-=.3")
      .to(q(".js-organic-path"), { strokeDashoffset: 0, duration: 1, ease: "power2.out" }, "-=.7")
      .to(q(".js-arrow-path"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=.6")
      .to(q(".js-stamp"), { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2)" }, "-=.3")
      .to(qa(".js-stamp-path"), { strokeDashoffset: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, "-=.3")
      .to(q(".js-price"), { y: 0, opacity: 1, duration: 0.5 }, "-=.5")
      .to(q(".js-desc"), { y: 0, opacity: 1, duration: 0.5 }, "-=.3")
      .to(q(".js-cta-row"), { y: 0, opacity: 1, duration: 0.6 }, "-=.3")
      .to(qa(".js-arch-ring"), { scale: 1, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }, "-=1.8")
      .to(q(".js-arch"), { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.4)" }, "-=1.6")
      .to(q(".js-bottle"), { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, "-=.6")
      .to(q(".js-ribbon-path"), { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" }, "-=.8")
      .to(qa(".js-sphere"), { scale: 1, opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(2)" }, "-=1.0")
      .to(qa(".js-notif"), { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.18, ease: "back.out(1.7)" }, "-=.6")
      .to(q(".js-scroll-down"), { y: 0, opacity: 1, duration: 0.5 }, "-=.4")
      .to(qa(".js-pagination, .js-accordion"), { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=.4");

    // ambient floats
    const floats = [
      [".js-sphere-1", "+=12", 3.5],
      [".js-sphere-2", "-=10", 4.0],
      [".js-sphere-3", "+=14", 3.8],
      [".js-sphere-4", "-=12", 4.2],
      [".js-sphere-5", "+=8", 3.2],
    ]
      .map(([sel, y, duration]) => {
        const el = q(sel);
        return el ? gsap.to(el, { y, duration, repeat: -1, yoyo: true, ease: "sine.inOut" }) : null;
      })
      .filter(Boolean);

    floats.push(gsap.to(q(".js-bottle"), { y: "+=8", duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" }));
    floats.push(gsap.to(q(".js-notif-like"), { y: "+=4", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" }));
    floats.push(gsap.to(q(".js-notif-buy"), { y: "-=4", duration: 4.5, repeat: -1, yoyo: true, ease: "sine.inOut" }));

    // mouse parallax over the stage
    const isCoarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    let onMove, onLeave;
    if (stage && !isCoarse) {
      onMove = (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(q(".js-bottle"), {
          x: x * 14,
          rotateY: x * 7,
          rotateX: -y * 4,
          duration: 0.8,
          ease: "power3.out",
          transformPerspective: 1000,
        });
        gsap.to(q(".js-sphere-1"), { x: x * 22, y: y * 18, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-sphere-2"), { x: x * -16, y: y * 22, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-sphere-3"), { x: x * 28, y: y * -20, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-sphere-4"), { x: x * -22, y: y * -18, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-sphere-5"), { x: x * 18, y: y * 14, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-ribbon"), { x: x * 10, y: y * 8, duration: 0.8, ease: "power3.out" });
        gsap.to(q(".js-notif-like"), { x: x * -12, y: y * -8, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        gsap.to(q(".js-notif-buy"), { x: x * 12, y: y * 10, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      };
      onLeave = () => {
        gsap.to(qa(".js-bottle, .js-sphere, .js-ribbon, .js-notif-like, .js-notif-buy"), {
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 1,
          ease: "elastic.out(1, .5)",
        });
      };
      stage.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
    }

    // scroll-tied parallax on the hero
    const heroTrigger = { trigger: q(".js-hero"), start: "top top", end: "bottom top", scrub: 1.2 };
    const scrollTweens = [
      gsap.to(q(".js-bottle"), { scrollTrigger: heroTrigger, y: -80, scale: 0.92 }),
      gsap.to(q(".js-arch"), { scrollTrigger: heroTrigger, y: -40, scale: 1.06 }),
      gsap.to(q(".js-title"), { scrollTrigger: heroTrigger, y: -30, opacity: 0.6 }),
      gsap.to(q(".js-sphere-3"), { scrollTrigger: { ...heroTrigger, scrub: 1.5 }, y: -100, x: 30 }),
      gsap.to(q(".js-sphere-4"), { scrollTrigger: { ...heroTrigger, scrub: 1.5 }, y: 80, x: -20 }),
    ];

    // reveal-on-scroll for the related section
    const revealTweens = qa(".js-reveal").map((el, i) =>
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      )
    );

    // product card tilt
    const tiltHandlers = [];
    if (!isCoarse) {
      qa(".js-product-card").forEach((card) => {
        const img = card.querySelector(".js-product-img");
        const move = (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
          if (img) gsap.to(img, { x: x * 16, y: y * -12, duration: 0.5, ease: "power2.out" });
        };
        const leave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, .6)" });
          if (img) gsap.to(img, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, .5)" });
        };
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        tiltHandlers.push({ card, move, leave });
      });
    }

    return () => {
      tl.kill();
      floats.forEach((f) => f.kill());
      scrollTweens.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
      revealTweens.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
      if (stage && onMove) {
        stage.removeEventListener("mousemove", onMove);
        stage.removeEventListener("mouseleave", onLeave);
      }
      tiltHandlers.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ─────────────────────────────────────────────────────────
  // Interaction handlers
  // ─────────────────────────────────────────────────────────
  function pulseLike(el, isLiking) {
    gsap
      .timeline()
      .to(el, { scale: 1.3, duration: 0.18, ease: "power2.out" })
      .to(el, { scale: 1, duration: 0.55, ease: "elastic.out(1, .4)" });
    if (!isLiking) return;
    const heart = document.createElement("span");
    heart.textContent = "♥";
    Object.assign(heart.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      color: "#e23744",
      fontSize: "20px",
      pointerEvents: "none",
      zIndex: "99",
    });
    el.appendChild(heart);
    gsap.fromTo(
      heart,
      { y: 0, opacity: 1, scale: 0.6 },
      { y: -40, opacity: 0, scale: 1.4, duration: 0.9, ease: "power2.out", onComplete: () => heart.remove() }
    );
  }

  function handleWishlistClick(e) {
    const next = !wishlisted;
    setWishlisted(next);
    pulseLike(e.currentTarget, next);
  }

  function handleProductLikeClick(e, id) {
    e.stopPropagation();
    const next = !likedProducts[id];
    setLikedProducts((prev) => ({ ...prev, [id]: next }));
    pulseLike(e.currentTarget, next);
  }

  function handleAddToCart() {
    const btn = cartBtnRef.current;
    const bell = bellBtnRef.current;
    if (!btn) return;

    gsap
      .timeline()
      .to(btn, { scale: 0.94, duration: 0.1, ease: "power2.out" })
      .to(btn, { scale: 1, duration: 0.5, ease: "elastic.out(1, .4)" });

    const startRect = btn.getBoundingClientRect();
    const fly = document.createElement("span");
    fly.textContent = "+1";
    Object.assign(fly.style, {
      position: "fixed",
      left: startRect.left + "px",
      top: startRect.top + "px",
      fontWeight: "700",
      fontSize: "14px",
      color: "#e23744",
      pointerEvents: "none",
      zIndex: "999",
    });
    fly.style.fontFamily = "Plus Jakarta Sans, sans-serif";
    document.body.appendChild(fly);

    if (!bell) {
      fly.remove();
      return;
    }
    const target = bell.getBoundingClientRect();
    gsap.to(fly, {
      left: target.left + 12 + "px",
      top: target.top + 6 + "px",
      scale: 0.6,
      opacity: 0,
      duration: 0.9,
      ease: "power2.in",
      onComplete: () => {
        fly.remove();
        setCartCount((c) => c + 1);
        const badge = bell.querySelector(".js-badge");
        if (badge) gsap.fromTo(badge, { scale: 1 }, { scale: 1.4, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" });
      },
    });
  }

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-hidden text-[#0a0a0c] antialiased"
      style={{
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        background:
          "radial-gradient(ellipse 60% 50% at 90% 10%, #fde6c4 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 5% 90%, #fff0d8 0%, transparent 50%), linear-gradient(180deg, #faf5ec 0%, #f7eedb 100%)",
      }}
    >
      {/* decorative oversized ring, top-center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-40%] z-0 h-[80vw] max-h-[1100px] w-[80vw] max-w-[1100px] -translate-x-1/2 rounded-full border border-black/5"
      />

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="relative z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-7 sm:px-10 md:px-14">
        <nav aria-label="Primary" className="js-header-item hidden items-center gap-7 sm:flex md:gap-9">
          <a href="#" className="text-sm font-medium transition-opacity hover:opacity-55">
            Category
          </a>
          <a href="#" className="text-sm font-medium transition-opacity hover:opacity-55">
            Category 2
          </a>
          <a href="#" className="text-sm font-medium transition-opacity hover:opacity-55">
            Category 3
          </a>
        </nav>

        <button
          onClick={() => setBrandOn((v) => !v)}
          aria-label="Toggle mode"
          className="js-header-item relative h-7 w-[60px] justify-self-center rounded-full bg-gradient-to-br from-[#cfc5b2] to-[#b8ad97] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.12),inset_0_2px_3px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.06)]"
        >
          <span
            className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-[radial-gradient(circle_at_30%_25%,#2e2e30_0%,#08080a_70%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_3px_rgba(0,0,0,0.4),0_2px_5px_rgba(0,0,0,0.3)] transition-[left] duration-[400ms]"
            style={{ left: brandOn ? 35 : 3, transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
          />
        </button>

        <div className="js-header-item flex items-center justify-self-end gap-1.5">
          <button
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className="grid h-10 w-10 place-items-center rounded-full transition-all hover:-translate-y-px hover:bg-black/5"
          >
            <Heart className="h-[22px] w-[22px]" strokeWidth={1.8} fill={wishlisted ? "currentColor" : "none"} color={wishlisted ? "#e23744" : "currentColor"} />
          </button>

          <button ref={bellBtnRef} aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full transition-all hover:-translate-y-px hover:bg-black/5">
            <Bell className="h-[22px] w-[22px]" strokeWidth={1.8} />
            <span className="js-badge absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-[#faf5ec] bg-gradient-to-br from-[#e23744] to-[#c41e2e] text-[10px] font-bold text-white shadow-[0_2px_4px_rgba(226,55,68,0.4)]">
              {cartCount}
            </span>
          </button>

          <button
            aria-label="Account"
            className="ml-1 h-10 w-10 rounded-full bg-[radial-gradient(circle_at_30%_25%,#8a9eff_0%,#5a6eff_50%,#4a52d4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-3px_6px_rgba(0,0,0,0.2),0_4px_12px_rgba(90,110,255,0.35)] transition-transform hover:scale-[1.08]"
          />
        </div>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <main className="js-hero relative z-[5] mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-5 pb-[clamp(60px,8vw,100px)] pt-[clamp(20px,3vw,40px)] sm:px-10 md:px-14 lg:grid-cols-[1fr_1.3fr_1fr] lg:gap-12">
        {/* ─── LEFT: INFO ─── */}
        <section className="pt-0 lg:pt-[clamp(20px,4vw,60px)]">
          <h1 className="js-title relative z-10 mb-7 font-[Plus_Jakarta_Sans,sans-serif] text-[clamp(44px,6.4vw,88px)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            <span className="js-title-line block whitespace-nowrap">
              <span className="relative inline-block px-3.5 pb-1.5 pt-1">
                <svg
                  className="pointer-events-none absolute -left-1 top-[-3%] h-[110%] w-[calc(100%+10px)] overflow-visible"
                  viewBox="0 0 320 110"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className="js-organic-path"
                    d="M 14 62 C 22 28, 70 12, 165 14 C 235 16, 295 25, 305 55 C 312 80, 285 100, 200 102 C 110 104, 35 96, 12 78 C 8 70, 9 67, 14 62 Z"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="relative inline-block">Collagen</span>
              </span>
            </span>

            <span className="js-title-line mt-1 block whitespace-nowrap">
              <span className="relative inline-block">Serum</span>
              <span className="ml-2 inline-block align-[0.12em] leading-none sm:ml-4">
                <svg className="block h-[clamp(18px,1.8vw,28px)] w-auto" viewBox="0 0 100 24" preserveAspectRatio="xMinYMid meet">
                  <path
                    className="js-arrow-path"
                    d="M 4 12 L 88 12 M 76 4 L 92 12 L 76 20"
                    fill="none"
                    stroke="#0a0a0c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>

            <span className="js-title-line mt-1 block whitespace-nowrap">
              <span className="relative inline-block">***</span>
              <span
                className="js-stamp relative ml-2 inline-block h-[clamp(28px,3.6vw,42px)] w-[clamp(28px,3.6vw,42px)] rounded-[7px] align-[0.05em] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-3px_5px_rgba(0,0,0,0.25),0_6px_14px_rgba(226,55,68,0.35),0_12px_24px_rgba(226,55,68,0.18)] sm:ml-4"
                style={{ background: "linear-gradient(140deg, #f04453 0%, #d8243a 60%, #b51e30 100%)" }}
              >
                <span className="absolute inset-[18%] grid place-items-center">
                  <svg viewBox="0 0 20 20" className="h-full w-full">
                    <path className="js-stamp-path" d="M 4 6 L 16 6" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path className="js-stamp-path" d="M 10 4 L 10 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path className="js-stamp-path" d="M 6 11 L 14 11" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path className="js-stamp-path" d="M 7 16 L 13 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>

          <div className="js-price mb-6 font-[Plus_Jakarta_Sans,sans-serif] text-[clamp(28px,3vw,38px)] font-semibold leading-none tracking-[-0.025em]">
            £39.00
          </div>

          <p className="js-desc mb-10 max-w-[260px] text-sm leading-[1.6] text-[#4a4a52]">
            Fresh, tangy and zesty lime with refreshing minty notes.
          </p>

          <div className="js-cta-row inline-flex items-center gap-3.5">
            <button
              ref={cartBtnRef}
              onClick={handleAddToCart}
              className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#0a0a0c] py-2 pl-2 pr-[22px] text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-3px_5px_rgba(0,0,0,0.3),0_10px_24px_rgba(0,0,0,0.22),0_22px_40px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-3px_5px_rgba(0,0,0,0.3),0_14px_30px_rgba(0,0,0,0.28),0_30px_50px_rgba(0,0,0,0.14)]"
            >
              <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white text-[#0a0a0c] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.08)]">
                <Check className="h-3 w-3" strokeWidth={2.6} />
              </span>
              Add to cart
            </button>

            <button
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
              className={`grid h-11 w-11 place-items-center rounded-full border-[1.5px] transition-all hover:-translate-y-0.5 ${
                wishlisted ? "border-[#e23744] bg-[#e23744] text-white" : "border-black/[0.12] text-[#0a0a0c] hover:bg-black/[0.04]"
              }`}
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </section>

        {/* ─── CENTER: BOTTLE STAGE ─── */}
        <section ref={stageRef} className="js-stage relative min-h-[clamp(420px,80vw,540px)] lg:min-h-[clamp(440px,56vw,660px)]">
          <span className="js-arch-ring absolute bottom-[2%] left-1/2 z-0 h-[94%] w-[94%] -translate-x-1/2 rounded-[50%_50%_12px_12px/38%_38%_4%_4%] border border-black/[0.04] opacity-60" />
          <span className="js-arch-ring absolute bottom-[4%] left-1/2 z-0 h-[86%] w-[86%] -translate-x-1/2 rounded-[50%_50%_12px_12px/38%_38%_4%_4%] border border-black/[0.04]" />
          <div className="js-arch absolute bottom-[6%] left-1/2 z-[1] h-[78%] w-[78%] -translate-x-1/2 rounded-[50%_50%_12px_12px/38%_38%_4%_4%] bg-gradient-to-b from-[#c4ead7] to-[#a8dcc1] shadow-[inset_0_-12px_24px_rgba(0,0,0,0.05),inset_0_10px_20px_rgba(255,255,255,0.35)]" />

          <svg
            className="js-ribbon pointer-events-none absolute inset-[8%_4%_4%_4%] z-[3] h-[92%] w-[92%]"
            viewBox="0 0 600 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="js-ribbon-path"
              d="M 100 180 C 200 90, 360 110, 430 220 C 480 290, 410 360, 340 330 C 280 300, 290 380, 360 410 C 430 440, 400 530, 320 510 C 240 490, 240 590, 320 620 C 380 640, 360 720, 280 700 C 200 680, 180 750, 220 770"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className={`js-sphere js-sphere-1 ${SPHERE_BASE} left-[12%] top-[30%] h-[26px] w-[26px] sm:scale-100 scale-[0.7]`} />
          <span className={`js-sphere js-sphere-2 ${SPHERE_BASE} left-[18%] top-[60%] h-[18px] w-[18px] sm:scale-100 scale-[0.7]`} />
          <span className={`js-sphere js-sphere-3 ${SPHERE_BASE} right-[14%] top-[38%] h-[34px] w-[34px] sm:scale-100 scale-[0.7]`} />
          <span className={`js-sphere js-sphere-4 ${SPHERE_BASE} bottom-[32%] right-[28%] h-[22px] w-[22px] sm:scale-100 scale-[0.7]`} />
          <span className={`js-sphere js-sphere-5 ${SPHERE_BASE} left-[28%] top-[16%] h-[14px] w-[14px] sm:scale-100 scale-[0.7]`} />

          <div className="absolute inset-x-0 top-[4%] bottom-0 z-[5] grid place-items-center">
            <img
              className="js-bottle w-[150%] max-w-[1000px] origin-bottom"
              style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.2)) drop-shadow(0 36px 50px rgba(0,0,0,0.12))" }}
              src={BOTTLE_IMG}
              alt="DermExcel Serum"
            />
          </div>

          {/* liked notification */}
          <div className="js-notif js-notif-like absolute right-[4%] lg:right-[-10%] top-[25%] z-[7] flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-4 text-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.08),0_22px_40px_rgba(0,0,0,0.06)] sm:text-[12.5px]">
            <span className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] sm:h-8 sm:w-8">
              <svg viewBox="0 0 32 32" className="h-full w-full">
                <defs>
                  <clipPath id="clipA">
                    <circle cx="16" cy="16" r="16" />
                  </clipPath>
                </defs>
                <g clipPath="url(#clipA)">
                  <rect width="32" height="32" fill="#f3d2b0" />
                  <circle cx="16" cy="13" r="7" fill="#d9a07a" />
                  <path d="M0 34 Q16 18 32 34 Z" fill="#2a2a2e" />
                  <path d="M10 11 Q12 4 16 4 Q20 4 22 11 Q19 7 16 7 Q13 7 10 11 Z" fill="#1a1a1c" />
                </g>
              </svg>
            </span>
            <div className="leading-[1.3]">
              <strong className="font-semibold">Kohaku</strong> has liked
              <div className="text-[11.5px] text-[#8a8a93]">this item</div>
            </div>
            <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f04453] to-[#d8243a] text-white shadow-[inset_0_-2px_3px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.2)]">
              <Heart className="h-3 w-3" fill="currentColor" />
            </span>
          </div>

          {/* purchase notification */}
          <div className="js-notif js-notif-buy absolute bottom-[28%] left-[4%] lg:left-[6%] z-[7] flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-4 text-[11px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.08),0_22px_40px_rgba(0,0,0,0.06)] sm:text-[12.5px]">
            <span className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] sm:h-8 sm:w-8">
              <svg viewBox="0 0 32 32" className="h-full w-full">
                <defs>
                  <clipPath id="clipB">
                    <circle cx="16" cy="16" r="16" />
                  </clipPath>
                </defs>
                <g clipPath="url(#clipB)">
                  <rect width="32" height="32" fill="#a8c4e8" />
                  <circle cx="16" cy="13" r="7" fill="#8a5e3c" />
                  <path d="M0 34 Q16 18 32 34 Z" fill="#3a5a8c" />
                  <path d="M9 10 Q12 4 16 4 Q20 4 23 10 Q19 7 16 7 Q13 7 9 10 Z" fill="#1a1a1c" />
                </g>
              </svg>
            </span>
            <div className="leading-[1.3]">
              <strong className="font-semibold">Mayo Shire</strong> has
              <div className="text-[11.5px] text-[#8a8a93]">just purchased</div>
            </div>
            <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2ecc71] to-[#16a34a] text-white shadow-[inset_0_-2px_3px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.2)]">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>

          <button
            onClick={() => document.querySelector(".js-related")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll for more"
            className="js-scroll-down absolute bottom-[8%] left-1/2 z-[8] grid h-[50px] w-[50px] -translate-x-1/2 place-items-center rounded-full border-[1.5px] border-white/70 text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            style={{ animation: "scrollBounce 2.2s infinite ease-in-out" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M6 10 L12 16 L18 10" />
            </svg>
          </button>
        </section>

        {/* ─── RIGHT: SIDE COLUMN ─── */}
        <aside className="pt-0 lg:pt-[clamp(20px,3vw,40px)]">
          <div className="js-pagination mb-10 inline-flex gap-3">
            <button aria-label="Previous" className="grid h-[38px] w-[38px] place-items-center rounded-full text-[#4a4a52] transition-all hover:-translate-y-px hover:bg-black/5 hover:text-[#0a0a0c]">
              <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </button>
            <button aria-label="Next" className="grid h-[38px] w-[38px] place-items-center rounded-full text-[#4a4a52] transition-all hover:-translate-y-px hover:bg-black/5 hover:text-[#0a0a0c]">
              <ChevronRight className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </button>
          </div>

          <div className="js-accordion mt-[60px]">
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = openAccordion === item.key;
              return (
                <div key={item.key} className="border-b border-black/[0.12]">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : item.key)}
                    className="flex w-full items-center justify-between py-[18px] text-left text-[15px] font-semibold transition-colors hover:text-[#4a4a52]"
                  >
                    {item.label}
                    <span className="grid h-[22px] w-[22px] place-items-center rounded-full text-[#4a4a52]">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3">
                        <path d="M2 6 L10 6" />
                        <path d="M6 2 L6 10" style={{ opacity: isOpen ? 0 : 1, transition: "opacity .25s" }} />
                      </svg>
                    </span>
                  </button>
                  <div className="overflow-hidden transition-[max-height] duration-500 ease-in-out" style={{ maxHeight: isOpen ? 200 : 0 }}>
                    <div className="max-w-[260px] pb-[18px] text-[13px] leading-[1.6] text-[#4a4a52]">{item.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </main>

      {/* ═══════════════════ RELATED PRODUCTS ═══════════════════ */}
      <section
        className="js-related relative z-[5] px-4 py-[clamp(60px,8vw,100px)] sm:px-10 md:px-14"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 30%)" }}
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="js-reveal mb-[clamp(32px,5vw,56px)] flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#8a8a93]">
                <span className="h-px w-3.5 bg-current" />
                More from the collection
              </div>
              <h2 className="max-w-[16ch] font-[Plus_Jakarta_Sans,sans-serif] text-[clamp(28px,3.4vw,46px)] font-bold leading-[1.05] tracking-[-0.03em]">
                Same maker. Different mood.
              </h2>
            </div>
            <a
              href="#"
              className="js-reveal inline-flex flex-shrink-0 items-center gap-2 rounded-full border-[1.5px] border-black/[0.12] bg-white px-[22px] py-3 text-[13px] font-medium transition-all hover:-translate-y-0.5 hover:border-[#0a0a0c] hover:bg-[#0a0a0c] hover:text-white"
            >
              See all
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {RELATED_PRODUCTS.map((p) => (
              <article
                key={p.id}
                className={`js-reveal js-product-card relative flex min-h-[380px] cursor-pointer flex-col justify-end overflow-hidden rounded-[28px] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_rgba(0,0,0,0.06),0_30px_60px_rgba(0,0,0,0.1)] ${THEME_BG[p.theme]}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="absolute left-[18px] top-[18px] rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">{p.tag}</span>

                <button
                  onClick={(e) => handleProductLikeClick(e, p.id)}
                  aria-label="Wishlist"
                  className={`absolute right-3.5 top-3.5 grid h-[34px] w-[34px] place-items-center rounded-full backdrop-blur-sm transition-all hover:scale-[1.08] ${
                    likedProducts[p.id] ? "bg-[#e23744] text-white" : "bg-white/70 text-[#0a0a0c] hover:bg-[#0a0a0c] hover:text-white"
                  }`}
                >
                  <Heart className="h-3.5 w-3.5" strokeWidth={1.8} fill={likedProducts[p.id] ? "currentColor" : "none"} />
                </button>

                <div className="pointer-events-none absolute inset-x-0 top-0 grid h-[76%] place-items-center">
                  <img
                    src={BOTTLE_IMG}
                    alt=""
                    loading="lazy"
                    className="js-product-img h-[78%] w-auto object-contain transition-transform duration-500"
                    style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.18)) drop-shadow(0 24px 36px rgba(0,0,0,0.1))" }}
                  />
                </div>

                <div className="relative flex items-end justify-between gap-3">
                  <div>
                    <div className="font-[Plus_Jakarta_Sans,sans-serif] text-lg font-bold leading-[1.1] tracking-[-0.015em]">{p.name}</div>
                    <div className="mt-1 text-xs text-[#4a4a52]">{p.sub}</div>
                  </div>
                  <div className="font-[Plus_Jakarta_Sans,sans-serif] text-lg font-bold tracking-[-0.02em]">{p.price}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 6px); }
        }
      `}</style>
    </div>
  );
}