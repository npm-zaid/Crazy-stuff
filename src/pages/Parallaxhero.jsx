import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Snap from "lenis/snap";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const BASE = "https://joebentaylor1995.github.io/infinite-scroll-with-parallax/assets/";

const slides = [
  { src: `${BASE}01.jpg`, alt: "Hero Image 1" },
  { src: `${BASE}02.jpg`, alt: "Hero Image 2" },
  { src: `${BASE}03.jpg`, alt: "Hero Image 3" },
  // Duplicate first slide for seamless infinite loop
  { src: `${BASE}01.jpg`, alt: "Hero Image 1 Duplicate", ariaHidden: true },
];

// ---------------------------------------------------------------------------
// RadialTextMarquee — pure-JS SVG marquee, ported 1-to-1 from original
// ---------------------------------------------------------------------------
function initRadialTextMarquee() {
  const wraps = document.querySelectorAll("[data-radial-text-marquee-init]");
  if (!wraps.length) return;

  const ns = "http://www.w3.org/2000/svg";
  const xns = "http://www.w3.org/1999/xlink";
  const prm =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startTime = performance.now();
  const isSafari = (() => {
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua);
  })();

  const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || 0));
  const speedMul = () => {
    const w = window.innerWidth || 2000;
    const t = clamp((w - 250) / (2000 - 250), 0, 1);
    return 0.5 + t * 0.5;
  };
  const lsToPx = (ls, fs) => {
    if (!ls || ls === "normal") return 0;
    if (ls.endsWith("px")) return parseFloat(ls) || 0;
    if (ls.endsWith("em")) return (parseFloat(ls) || 0) * fs;
    if (ls.endsWith("rem")) {
      const root =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return (parseFloat(ls) || 0) * root;
    }
    const n = parseFloat(ls);
    return Number.isFinite(n) ? n : 0;
  };
  const syncType = (fromEl, svgText, svgTextPath) => {
    const s = getComputedStyle(fromEl);
    const fsPx = parseFloat(s.fontSize) || 16;
    const lsPx = lsToPx(s.letterSpacing, fsPx);
    svgText.setAttribute("font-family", s.fontFamily);
    svgText.setAttribute("font-size", s.fontSize);
    svgText.setAttribute("font-weight", s.fontWeight);
    svgText.setAttribute("dominant-baseline", "alphabetic");
    svgText.setAttribute("text-rendering", "geometricPrecision");
    svgText.setAttribute("fill", s.color);
    svgText.setAttribute("letter-spacing", `${lsPx}px`);
    svgText.setAttribute("font-kerning", "none");
    svgText.setAttribute("font-feature-settings", '"kern" 0, "liga" 0, "clig" 0');
    if (svgTextPath) svgTextPath.setAttribute("letter-spacing", `${lsPx}px`);
    return { fsPx, lsPx, ff: s.fontFamily, fw: s.fontWeight, fz: s.fontSize, tt: s.textTransform };
  };
  const matchSourceCasing = (value, textTransform) => {
    if (typeof value !== "string") return value;
    if (textTransform === "uppercase") return value.toUpperCase();
    return value;
  };
  const tspan = (tp, v, fill, lsPx) => {
    const t = document.createElementNS(ns, "tspan");
    t.textContent = v;
    if (fill) t.setAttribute("fill", fill);
    if (lsPx != null) t.setAttribute("letter-spacing", `${lsPx}px`);
    tp.appendChild(t);
  };
  const buildRun = (tp, text, spacer, spacerColor, pad, reps, lsPx, tt) => {
    tp.textContent = "";
    const dt = matchSourceCasing(text, tt);
    const ds = matchSourceCasing(spacer, tt);
    for (let i = 0; i < reps; i++) {
      tspan(tp, dt, null, lsPx);
      tspan(tp, pad, null, lsPx);
      tspan(tp, ds, spacerColor, lsPx);
      tspan(tp, pad, null, lsPx);
    }
  };
  const circleR = (half, level01) => {
    if (level01 <= 0) return half * 200;
    const inv = 1 - level01;
    return half * (1.01 + inv * inv * 16.99);
  };
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const measureLS = (str, fontCss, lsPx, tt) => {
    if (!ctx) return 0;
    const txt = matchSourceCasing(str || "", tt).replace(/\u00A0/g, " ");
    ctx.font = fontCss;
    const w = ctx.measureText(txt).width || 0;
    const glyphs = Array.from(txt).length;
    return w + Math.max(glyphs - 1, 0) * (lsPx || 0);
  };
  const makeSvg = (wrap) => {
    const svg = document.createElementNS(ns, "svg");
    const defs = document.createElementNS(ns, "defs");
    const g = document.createElementNS(ns, "g");
    const path = document.createElementNS(ns, "path");
    const text = document.createElementNS(ns, "text");
    const tp = document.createElementNS(ns, "textPath");
    const id = `rtm-${Math.random().toString(16).slice(2)}`;
    svg.setAttribute("xmlns", ns);
    svg.setAttribute("xmlns:xlink", xns);
    Object.assign(svg.style, {
      position: "absolute", top: 0, left: 0,
      overflow: "visible", pointerEvents: "none", display: "block",
    });
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    path.setAttribute("id", id);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "none");
    tp.setAttributeNS(xns, "xlink:href", `#${id}`);
    tp.setAttribute("text-anchor", "start");
    tp.setAttribute("startOffset", "0px");
    text.appendChild(tp);
    defs.appendChild(path);
    svg.appendChild(defs);
    g.appendChild(path);
    g.appendChild(text);
    svg.appendChild(g);
    wrap.appendChild(svg);
    const textEl = wrap.querySelector("[data-radial-text-marquee-text]");
    if (textEl) textEl.style.opacity = "0";
    return { svg, g, path, text, tp };
  };

  wraps.forEach((wrap) => {
    const textEl = wrap.querySelector("[data-radial-text-marquee-text]");
    if (!textEl) return;
    const st = { ...makeSvg(wrap), tw: null, px: { x: 0 }, raf: 0, qs: null };

    const rebuild = () => {
      const baseText = (textEl.textContent || "").trim();
      if (!baseText) return;
      const speed = clamp(wrap.getAttribute("data-radial-text-marquee-speed") || 4, 0.1, 200);
      const speedPx = Math.max(speed * 100 * speedMul(), 1);
      const radiusLevel = clamp(wrap.getAttribute("data-radial-text-marquee-radius") || 10, 0, 10);
      const level01 = radiusLevel / 10;
      const spacer = wrap.getAttribute("data-radial-text-marquee-spacer") || "•";
      const spacerColor = wrap.getAttribute("data-radial-text-marquee-spacer-color") || null;
      const padCount = clamp(wrap.getAttribute("data-radial-text-marquee-spacer-padding") || 1, 0, 20);
      const pad = "\u00A0".repeat(padCount);
      const typo = syncType(textEl, st.text, st.tp);
      const wrapW = Math.max(wrap.clientWidth || 1, 1);
      const parentH = wrap.parentElement ? wrap.parentElement.clientHeight : 0;
      const wrapH = Math.max(wrap.clientHeight || parentH || textEl.offsetHeight || 1, 1);
      const bleed = typo.fsPx * 2;
      const w = wrapW + bleed * 2;
      const h = wrapH;
      Object.assign(st.svg.style, { width: `${w}px`, height: `${h}px`, left: `${-bleed}px` });
      st.svg.setAttribute("width", w);
      st.svg.setAttribute("height", h);
      st.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const half = w / 2;
      const r = level01 <= 0.0001 ? half * 200 : Math.max(circleR(half, level01), half + 0.001);
      const under = Math.max(r * r - half * half, 0);
      const arcHeight = Math.max(r - Math.sqrt(under), 0);
      const baseline = h / 2 + typo.fsPx * 0.35;
      const y = Math.max(baseline - arcHeight / 2, 0);
      st.path.setAttribute("d",
        level01 <= 0.0001
          ? `M 0 ${y} L ${w} ${y}`
          : `M 0 ${y} A ${r} ${r} 0 0 0 ${w} ${y}`
      );
      st.text.setAttribute("x", "0");
      st.text.setAttribute("y", `${y}`);
      st.g.setAttribute("transform", "translate(0 0)");
      textEl.style.opacity = "0";
      cancelAnimationFrame(st.raf);
      st.raf = requestAnimationFrame(() => {
        const fontCss = `${typo.fw} ${typo.fz} ${typo.ff}`;
        let loopLen =
          measureLS(baseText, fontCss, typo.lsPx, typo.tt) +
          measureLS(pad, fontCss, typo.lsPx, typo.tt) +
          measureLS(spacer, fontCss, typo.lsPx, typo.tt) +
          measureLS(pad, fontCss, typo.lsPx, typo.tt);
        loopLen = Math.max(loopLen || 0, 1);
        const pathLen = st.path.getTotalLength ? st.path.getTotalLength() : wrapW;
        const targetCover = Math.max(pathLen * 4, wrapW * 8);
        const reps = clamp(Math.ceil(targetCover / loopLen) + 6, 6, 600);
        buildRun(st.tp, baseText, spacer, spacerColor, pad, reps, typo.lsPx, typo.tt);
        const textBox = st.text.getBBox();
        const centerOffset = h / 2 - (textBox.y + textBox.height / 2);
        st.g.setAttribute("transform", `translate(0 ${centerOffset})`);
        if (!isSafari) {
          const fullLen = st.tp.getComputedTextLength();
          if (Number.isFinite(fullLen) && fullLen > 0) {
            const perUnit = fullLen / reps;
            if (Number.isFinite(perUnit) && perUnit > 0) loopLen = perUnit;
          }
        }
        loopLen = Math.max(loopLen, 1);
        if (st.tw) st.tw.kill();
        st.tw = null;
        if (prm) return;
        st.qs = gsap.quickSetter ? gsap.quickSetter(st.tp, "attr") : null;
        const setOffset = (v) => {
          const val = `${v.toFixed(3)}px`;
          if (st.qs) st.qs({ startOffset: val });
          else st.tp.setAttribute("startOffset", val);
        };
        st.px.x = (((performance.now() - startTime) / 1000) * speedPx) % loopLen;
        st.tw = gsap.to(st.px, {
          x: st.px.x + loopLen,
          duration: loopLen / speedPx,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            const x = ((st.px.x % loopLen) + loopLen) % loopLen;
            setOffset(-x);
          },
        });
      });
    };

    const schedule = (() => {
      let raf = 0;
      return () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(rebuild); };
    })();

    rebuild();
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(schedule).catch(() => {});
    else setTimeout(schedule, 150);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(schedule);
      ro.observe(wrap);
      ro.observe(textEl);
    } else {
      window.addEventListener("resize", schedule);
    }
  });
}

// ---------------------------------------------------------------------------
// HeroSection — one slide
// ---------------------------------------------------------------------------
function HeroSection({ src, alt, ariaHidden }) {
  return (
    <section
      className="hero relative z-[1] grid place-items-center w-full h-svh overflow-clip"
      aria-hidden={ariaHidden || undefined}
    >
      <picture className="absolute inset-0 z-[-1] bg-black block">
        <img
          src={src}
          alt={alt}
          className="block w-full h-full object-cover"
          aria-hidden={ariaHidden || undefined}
        />
      </picture>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ParallaxHero — main component
// ---------------------------------------------------------------------------
export default function ParallaxHero() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    // ── Lenis + Snap ──────────────────────────────────────────────────────
    const lenis = new Lenis({
      infinite: true,
      wrapper,
      content,
      syncTouch: true,
    });

    const snap = new Snap(lenis, {
      type: "mandatory",
      debounce: 500,
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        } else {
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: wrapper.clientWidth, height: wrapper.clientHeight };
      },
      pinType: "transform",
    });

    const sections = content.querySelectorAll("section");
    snap.addElements(sections, { align: "start" });
    lenis.on("scroll", ScrollTrigger.update);

    const tickerId = gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ── Parallax + marquee scale ──────────────────────────────────────────
    const heros = content.querySelectorAll(".hero");
    const gsapCtx = gsap.context(() => {
      const ANIM = {
        IMAGE: { before: -50, after: 50 },
        MARQUEE: { before: 1.5, after: 0.5 },
      };

      heros.forEach((hero) => {
        const image = hero.querySelector("picture");
        const marquees = hero.querySelectorAll("svg");

        const shared = {
          ease: "none",
          scrollTrigger: {
            scroller: wrapper,
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            fastScrollEnd: true,
          },
        };

        gsap.set(image, { yPercent: ANIM.IMAGE.before });
        gsap.fromTo(image, { yPercent: ANIM.IMAGE.before }, { yPercent: ANIM.IMAGE.after, ...shared });

        marquees.forEach((marquee) => {
          gsap.set(marquee, { scale: ANIM.MARQUEE.before });
          gsap.fromTo(marquee, { scale: ANIM.MARQUEE.before }, { scale: ANIM.MARQUEE.after, ...shared });
        });
      });
    }, content);

    // ── Radial text marquee ───────────────────────────────────────────────
    initRadialTextMarquee();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      gsapCtx.revert();
      gsap.ticker.remove(tickerId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    /*
     * .wrapper  →  relative, h-svh, overflow-hidden
     * .content  →  relative (Lenis needs this as scroll container)
     */
    <div
      ref={wrapperRef}
      className="relative h-svh overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div ref={contentRef} className="relative">
        {slides.map((slide, i) => (
          <HeroSection key={i} {...slide} />
        ))}
      </div>
    </div>
  );
}