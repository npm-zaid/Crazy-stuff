/**
 * ScrollingGallery.jsx
 *
 * Dependencies (install these):
 *   npm install gsap lenis
 *
 * Usage:
 *   import ScrollingGallery from "./ScrollingGallery";
 *   <ScrollingGallery />
 *
 * Note: GSAP Flip and ScrollTrigger are included with gsap package.
 *       Add `import "lenis/dist/lenis.css"` in your global CSS / main entry
 *       if you want Lenis' default scroll styles (optional).
 */

import { useEffect } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(Flip, ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────────────────────
const GALLERY_ROW_ITEMS = [
  { size: "s", url: "https://picsum.photos/600/600?random=1" },
  { size: "m", url: "https://picsum.photos/600/600?random=2" },
  { size: "l", url: "https://picsum.photos/600/600?random=3" },
  { size: "xl center", url: "https://picsum.photos/1400/800?random=4" },
  { size: "l", url: "https://picsum.photos/600/600?random=5" },
  { size: "m", url: "https://picsum.photos/600/600?random=6" },
  { size: "s", url: "https://picsum.photos/600/600?random=7" },
];

const GALLERY_GRID_ITEMS = Array.from({ length: 9 }, (_, i) => ({
  url: `https://picsum.photos/1000/1000?random=${8 + i}`,
}));

const GALLERY_GRID10_ITEMS = Array.from({ length: 16 }, (_, i) => ({
  url: `https://picsum.photos/1000/1000?random=${17 + i}`,
  pos: i + 1,
}));

const makeStack = (start, count) =>
  Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/1000/1000?random=${start + i}`,
  }));

const GALLERY_STACK4 = makeStack(33, 6);
const GALLERY_STACK5 = makeStack(39, 6);
const GALLERY_STACK6 = makeStack(45, 6);

const GALLERY_GRIDTINY = [
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${51 + i}`),
  ...Array.from({ length: 9 }, (_, i) => `https://picsum.photos/1000/1000?random=${91 + i}`),
  ...Array.from({ length: 11 }, (_, i) => `https://picsum.photos/1000/1000?random=${80 + i}`),
];

const GALLERY_BENTO = [
  { url: "https://picsum.photos/1000/1000?random=64" },
  { url: "https://picsum.photos/1000/1000?random=63" },
  { url: "https://picsum.photos/2000/2000?random=62" },
  { url: "https://picsum.photos/1000/1000?random=69" },
  { url: "https://picsum.photos/1000/1000?random=65" },
  { url: "https://picsum.photos/1000/1000?random=67" },
  { url: "https://picsum.photos/1000/1000?random=68" },
  { url: "https://picsum.photos/1000/1000?random=66" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const preloadImages = (selector) =>
  new Promise((resolve) => {
    const els = document.querySelectorAll(selector);
    let loaded = 0;
    const total = els.length;
    if (total === 0) return resolve();
    els.forEach((el) => {
      const src =
        el.style.backgroundImage?.replace(/url\(["']?(.*?)["']?\)/, "$1") ||
        el.src;
      if (!src) { loaded++; if (loaded === total) resolve(); return; }
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; if (loaded === total) resolve(); };
      img.src = src;
    });
  });

const triggerFlipOnScroll = (galleryEl, options = {}) => {
  const settings = {
    stagger: 0,
    ...options,
    flip: { absoluteOnLeave: false, absolute: false, scale: true, simple: true, ...(options.flip || {}) },
    scrollTrigger: { start: "center center", end: "+=300%", ...(options.scrollTrigger || {}) },
  };

  const galleryCaption = galleryEl.querySelector(".caption");
  const galleryItems = galleryEl.querySelectorAll(".gallery__item");
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  galleryEl.classList.add("gallery--switch");
  const flipstate = Flip.getState([galleryItems, galleryCaption], {
    props: "filter, opacity",
  });
  galleryEl.classList.remove("gallery--switch");

  const tl = Flip.to(flipstate, {
    ease: "none",
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  if (galleryItemsInner.length) {
    tl.fromTo(
      galleryItemsInner,
      { scale: 2 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: galleryEl,
          start: settings.scrollTrigger.start,
          end: settings.scrollTrigger.end,
          scrub: true,
        },
      },
      0
    );
  }
};

// ── Sub-components ────────────────────────────────────────────────────────────
const GalleryItem = ({ url, className = "", style = {} }) => (
  <div
    className={`gallery__item ${className}`}
    style={{ backgroundImage: `url(${url})`, ...style }}
  />
);

const GalleryItemCut = ({ url }) => (
  <div className="gallery__item gallery__item-cut">
    <div className="gallery__item-inner" style={{ backgroundImage: `url(${url})` }} />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function ScrollingGallery() {
  useEffect(() => {
    const galleries = [
      { id: "#gallery-1", options: { flip: { absoluteOnLeave: true, scale: false } } },
      { id: "#gallery-2", options: {} },
      {
        id: "#gallery-3",
        options: {
          flip: { absolute: true, scale: false },
          scrollTrigger: { start: "center center", end: "+=900%" },
          stagger: 0.05,
        },
      },
      { id: "#gallery-4", options: {} },
      { id: "#gallery-5", options: {} },
      { id: "#gallery-6", options: {} },
      { id: "#gallery-7", options: {} },
      { id: "#gallery-8", options: { flip: { scale: false } } },
      { id: "#gallery-9", options: {} },
    ];

    preloadImages(".gallery__item").then(() => {
      // Lenis smooth scroll
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", () => ScrollTrigger.update());
      const scrollFn = (time) => { lenis.raf(time); requestAnimationFrame(scrollFn); };
      requestAnimationFrame(scrollFn);

      // Flip animations
      galleries.forEach(({ id, options }) => {
        const el = document.querySelector(id);
        if (el) triggerFlipOnScroll(el, options);
      });

      document.body.classList.remove("loading");

      return () => { lenis.destroy(); ScrollTrigger.getAll().forEach((t) => t.kill()); };
    });
  }, []);

  return (
    <>
      {/* ── Global styles injected via <style> tag ── */}
      <style>{`
        *, *::after, *::before { box-sizing: border-box; }
        :root {
          font-size: 18px;
          --color-text: #fff;
          --color-bg: #131417;
          --color-link: #aaa;
          --color-link-hover: #fff;
          --color-label: #adadad;
          --color-text-alt: #575757;
          --color-caption: #fff;
        }
        body {
          margin: 0;
          color: var(--color-text);
          background-color: var(--color-bg);
          font-family: "tenon", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }
        a { text-decoration: none; color: var(--color-link); outline: none; cursor: pointer; }
        a:hover { color: var(--color-link-hover); }
        main { position: relative; width: 100%; overflow: hidden; }

        /* Frame */
        .frame {
          position: relative; width: 100%; padding: 1rem;
          display: grid; grid-template-columns: 100%;
          grid-template-areas: "title" "prev";
          grid-gap: .5rem; justify-items: start; align-self: start;
          pointer-events: none; align-items: center; font-size: .85rem; opacity: .7;
        }
        .frame a { pointer-events: auto; }
        .frame a:not(.frame__title-back) {
          white-space: nowrap; overflow: hidden; position: relative;
        }
        .frame a:not(.frame__title-back)::before {
          content: ""; height: 1px; width: 100%; background: currentColor;
          position: absolute; top: 90%; transition: transform .3s; transform-origin: 0% 50%;
        }
        .frame a:not(.frame__title-back):hover::before {
          transform: scaleX(0); transform-origin: 100% 50%;
        }
        .frame__title { grid-area: title; display: flex; }
        .frame__title-main { font-size: inherit; margin: 0; font-weight: inherit; }
        .frame__title-back { position: relative; display: flex; align-items: flex-end; }
        .frame__title-back span { display: none; }
        .frame__title-back svg { fill: currentColor; }
        .frame__prev { grid-area: prev; }

        /* Project sections */
        .project {
          padding: 1rem; max-width: 1000px; margin: 20vh auto;
          display: grid; grid-column-gap: 7vw; grid-row-gap: .5rem;
        }
        .project--details { grid-template-areas: "label-default" "paragraph"; grid-template-columns: 1fr; }
        .project--details p { grid-area: paragraph; max-width: 400px; }
        .project__label--default { grid-area: label-default; }
        .project p { line-height: 1.4; margin: 0; color: var(--color-text-alt); }
        .project__label { color: var(--color-label); }

        /* Gallery wrap */
        .gallery-wrap {
          position: relative; width: 100%; height: 100vh;
          display: flex; align-items: center; justify-content: center;
          margin: 40vh auto; overflow: hidden;
        }
        .gallery-wrap--large { height: 110vh; }
        .gallery-wrap--dense { margin: 0; }
        .gallery { position: relative; width: 100%; height: 100%; flex: none; }
        .gallery--breakout { width: min-content; }
        .gallery__item {
          background-position: 50% 50%; background-size: cover;
          flex: none; border-radius: 6px; position: relative; filter: brightness(1);
        }
        .gallery__item-cut { overflow: hidden; display: grid; place-items: center; }
        .gallery__item-inner {
          width: 100%; height: 100%;
          background-position: 50% 50%; background-size: cover; background-repeat: no-repeat;
        }
        .caption { font-size: clamp(1rem, 3vw, 1.75rem); z-index: 101; color: var(--color-caption); font-weight: 400; }

        /* Gallery row */
        .gallery--row {
          display: flex; align-items: center; justify-content: center; gap: 2rem;
          --size-factor: 1.25; --item-height: 20vh;
        }
        .gallery--row .gallery__item { width: auto; aspect-ratio: 2/3; }
        .gallery--row .gallery__item--s  { height: var(--item-height); }
        .gallery--row .gallery__item--m  { height: calc(var(--size-factor) * var(--item-height)); }
        .gallery--row .gallery__item--l  { height: calc(var(--size-factor) * 2 * var(--item-height)); }
        .gallery--row .gallery__item--xl { z-index: 100; height: calc(var(--size-factor) * 3 * var(--item-height)); }
        .gallery--row .caption { position: absolute; width: 100%; height: auto; bottom: -50vh; left: 0; padding: 4.5vw; max-width: 730px; opacity: 0; }
        .gallery--switch.gallery--row .gallery__item--m,
        .gallery--switch.gallery--row .gallery__item--l { height: var(--item-height); }
        .gallery--switch.gallery--row .caption { bottom: 0; opacity: 1; }

        /* Gallery one */
        .gallery--one { display: grid; place-items: center; }
        .gallery--one .gallery__item { width: 400%; height: 400%; filter: brightness(1) hue-rotate(90deg); }
        .gallery--switch.gallery--one .gallery__item { width: 100%; height: 100%; filter: brightness(.7) hue-rotate(0deg); }
        .gallery--one .caption {
          position: absolute; width: 100vw; height: 100vh; top: 50%; left: 50%;
          margin: 100vh 0 0 -50vw; font-size: clamp(2rem, 5vw, 3rem); display: grid; place-items: center;
        }
        .gallery--switch.gallery--one .caption { margin-top: -50vh; }

        /* Gallery grid */
        .gallery--grid {
          height: auto; display: grid;
          grid-template-columns: repeat(3, auto); grid-template-rows: repeat(3, auto);
          row-gap: 2.5vw; column-gap: 3vw;
        }
        .gallery--grid .gallery__item { height: 33vh; width: 33vw; }
        .gallery--switch.gallery--grid { gap: 0; }
        .gallery--switch.gallery--grid .gallery__item { height: 110vh; width: 110vw; filter: brightness(.65); }
        .gallery--grid .caption {
          position: absolute; width: 100vw; height: 100vh; padding: 0;
          top: 50%; left: 50%; margin-top: 50vh; margin-left: -50vw;
          display: grid; place-items: center; max-width: none; opacity: 0;
        }
        .gallery--switch.gallery--grid .caption { margin-top: -40vh; opacity: 1; }
        .gallery--grid .caption p { padding: 50vh 30vw 10vh 10vw; }

        /* Gallery stack */
        .gallery--stack {
          display: grid; grid-template-columns: repeat(6, 1fr);
          align-items: center; justify-content: start; gap: 2rem; padding: 2rem; --offset: 1rem;
        }
        .gallery--stack .gallery__item { border-radius: 1.5vw; width: 25vw; height: 35vw; z-index: 1; }
        .gallery--switch.gallery--stack .gallery__item { grid-area: 1/1/2/2; }
        .gallery--stack .caption { position: absolute; bottom: 0; left: 100vw; width: 100vw; padding: 5vw; color: var(--color-text-alt); opacity: 0; z-index: 0; }
        .gallery--stack .caption p { margin: 0; }
        .gallery--switch.gallery--stack .caption { left: 0; opacity: 1; }
        .gallery--stack-inverse .gallery__item:nth-child(5) { z-index: 2; }
        .gallery--stack-inverse .gallery__item:nth-child(4) { z-index: 3; }
        .gallery--stack-inverse .gallery__item:nth-child(3) { z-index: 4; }
        .gallery--stack-inverse .gallery__item:nth-child(2) { z-index: 5; }
        .gallery--stack-inverse .gallery__item:nth-child(1) { z-index: 6; }
        .gallery--switch.gallery--stack .gallery__item:nth-child(2) { margin-left: var(--offset); }
        .gallery--switch.gallery--stack .gallery__item:nth-child(3) { margin-left: calc(var(--offset)*2); }
        .gallery--switch.gallery--stack .gallery__item:nth-child(4) { margin-left: calc(var(--offset)*3); }
        .gallery--switch.gallery--stack .gallery__item:nth-child(5) { margin-left: calc(var(--offset)*4); }
        .gallery--switch.gallery--stack .gallery__item:nth-child(6) { margin-left: calc(var(--offset)*5); }
        .gallery--switch.gallery--stack-dark .gallery__item:nth-child(2) { filter: brightness(.8); }
        .gallery--switch.gallery--stack-dark .gallery__item:nth-child(3) { filter: brightness(.7); }
        .gallery--switch.gallery--stack-dark .gallery__item:nth-child(4) { filter: brightness(.6); }
        .gallery--switch.gallery--stack-dark .gallery__item:nth-child(5) { filter: brightness(.5); }
        .gallery--switch.gallery--stack-dark .gallery__item:nth-child(6) { filter: brightness(.4); }
        .gallery--switch.gallery--stack-glass .gallery__item { opacity: .7; }
        .gallery--switch.gallery--stack-scale .gallery__item:nth-child(2) { transform: scale(.98); }
        .gallery--switch.gallery--stack-scale .gallery__item:nth-child(3) { transform: scale(.96); }
        .gallery--switch.gallery--stack-scale .gallery__item:nth-child(4) { transform: scale(.94); }
        .gallery--switch.gallery--stack-scale .gallery__item:nth-child(5) { transform: scale(.92); }
        .gallery--switch.gallery--stack-scale .gallery__item:nth-child(6) { transform: scale(.9); }

        /* Gallery gridtiny */
        .gallery--gridtiny {
          display: grid; grid-template-columns: repeat(10, 1fr);
          width: 300%; padding: 0 2vh; height: min-content; gap: 1vh;
        }
        .gallery--switch.gallery--gridtiny { width: 100%; gap: 2vh; }
        .gallery--gridtiny .gallery__item { aspect-ratio: 1; width: 100%; height: auto; filter: contrast(.8) saturate(0) brightness(.6); }
        .gallery--switch.gallery--gridtiny .gallery__item { filter: contrast(1) saturate(1) brightness(.8) opacity(.8); }
        .gallery--gridtiny .caption {
          position: absolute; width: 100vw; height: 100vh; left: 50%; top: 50%;
          margin: -50vh 0 0 -50vw; display: grid; place-items: center;
          font-size: clamp(2rem, 8vw, 4rem); opacity: 0;
        }
        .gallery--switch.gallery--gridtiny .caption { opacity: 1; }
        .gallery--switch .gallery__item--center { height: 100vh; width: 100vw; aspect-ratio: auto; filter: brightness(.5); }

        /* Gallery bento */
        .gallery--bento {
          display: grid; gap: 1vh;
          grid-template-columns: repeat(3, 32.5vw); grid-template-rows: repeat(4, 23vh);
          justify-content: center; align-content: center;
        }
        .gallery--switch.gallery--bento {
          grid-template-columns: repeat(3, 100vw); grid-template-rows: repeat(4, 49.5vh); gap: 15vh;
        }
        .gallery--bento .gallery__item:nth-child(1) { grid-area: 1/1/3/2; }
        .gallery--bento .gallery__item:nth-child(2) { grid-area: 1/2/2/3; }
        .gallery--bento .gallery__item:nth-child(3) { grid-area: 2/2/4/3; }
        .gallery--bento .gallery__item:nth-child(4) { grid-area: 1/3/3/3; }
        .gallery--bento .gallery__item:nth-child(5) { grid-area: 3/1/3/2; }
        .gallery--bento .gallery__item:nth-child(6) { grid-area: 3/3/5/4; }
        .gallery--bento .gallery__item:nth-child(7) { grid-area: 4/1/5/2; }
        .gallery--bento .gallery__item:nth-child(8) { grid-area: 4/2/5/3; }
        .gallery--bento .caption {
          position: absolute; width: 100vw; height: 100vh; top: 50%; left: 50%;
          margin: 100vh 0 0 -50vw; font-size: clamp(2rem, 10vw, 5rem); display: grid; place-items: center;
        }
        .gallery--switch.gallery--bento .caption { margin-top: -50vh; }

        /* Gallery grid10 */
        .gallery--grid10 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2vw; }
        .gallery--switch.gallery--grid10 {
          grid-template-columns: 1fr 300px 1fr; grid-template-rows: 1fr 60vh 1fr; grid-gap: 0;
        }
        .gallery--switch.gallery--grid10 .gallery__item { grid-area: 2/2/3/3; }
        .gallery--grid10 .caption {
          position: absolute; width: 100vw; height: 100vh; top: 50%; left: 50%;
          margin: 100vh 0 0 -50vw; display: grid; place-items: center; font-size: clamp(2rem, 8vw, 6rem);
        }
        .gallery--switch.gallery--grid10 .caption { opacity: 1; margin-top: -50vh; }

        /* Responsive */
        @media screen and (min-width: 53em) {
          .frame {
            grid-template-columns: auto auto auto 1fr;
            grid-template-areas: "title prev ... sponsor";
            align-content: space-between; justify-items: start; grid-gap: 2rem;
          }
          .project--details {
            grid-template-areas: "label-default paragraph";
            grid-template-columns: auto auto;
          }
          .project__label { text-align: right; }
          .gallery--grid10 {
            grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(4, 1fr);
          }
          .gallery--grid10:not(.gallery--switch) .pos-1  { grid-area: 1/1; }
          .gallery--grid10:not(.gallery--switch) .pos-2  { grid-area: 1/2; }
          .gallery--grid10:not(.gallery--switch) .pos-3  { grid-area: 1/4; }
          .gallery--grid10:not(.gallery--switch) .pos-4  { grid-area: 1/5; }
          .gallery--grid10:not(.gallery--switch) .pos-5  { grid-area: 3/6; }
          .gallery--grid10:not(.gallery--switch) .pos-6  { grid-area: 1/7; }
          .gallery--grid10:not(.gallery--switch) .pos-7  { grid-area: 1/9; }
          .gallery--grid10:not(.gallery--switch) .pos-8  { grid-area: 3/10; }
          .gallery--grid10:not(.gallery--switch) .pos-9  { grid-area: 2/8; }
          .gallery--grid10:not(.gallery--switch) .pos-10 { grid-area: 4/9; }
          .gallery--grid10:not(.gallery--switch) .pos-11 { grid-area: 3/8; }
          .gallery--grid10:not(.gallery--switch) .pos-12 { grid-area: 2/2; }
          .gallery--grid10:not(.gallery--switch) .pos-13 { grid-area: 3/1; }
          .gallery--grid10:not(.gallery--switch) .pos-14 { grid-area: 3/4; }
          .gallery--grid10:not(.gallery--switch) .pos-15 { grid-area: 4/3; }
          .gallery--grid10:not(.gallery--switch) .pos-16 { grid-area: 4/7; }
          .gallery--stack .caption { bottom: 40%; width: 60vw; max-width: 800px; }
          .gallery--switch.gallery--stack .caption { left: 40vw; }
        }
      `}</style>

      <main>
        {/* ── Header frame ── */}
        <div className="frame">
          <div className="frame__title">
            <h1 className="frame__title-main">Scrolling layout</h1>
            <a className="frame__title-back" href="https://dennysdionigi.com" target="_blank" rel="noreferrer" aria-label="Back to the article">
              <span className="oh__inner">Back to the article</span>
              <svg width="18px" height="18px" viewBox="0 0 24 24">
                <path vectorEffect="non-scaling-stroke" d="M18.25 15.5a.75.75 0 00.75-.75v-9a.75.75 0 00-.75-.75h-9a.75.75 0 000 1.5h7.19L6.22 16.72a.75.75 0 101.06 1.06L17.5 7.56v7.19c0 .414.336.75.75.75z" />
              </svg>
            </a>
          </div>
          <a className="frame__prev" href="https://codepen.io/DedaloD/">Other demos</a>
        </div>

        {/* ── Gallery 1 — Row ── */}
        <div className="gallery-wrap">
          <div className="gallery gallery--row" id="gallery-1">
            {GALLERY_ROW_ITEMS.map((item, i) => (
              <GalleryItem
                key={i}
                url={item.url}
                className={item.size.split(" ").map((s) => `gallery__item--${s}`).join(" ")}
              />
            ))}
            <div className="caption">
              Within this meticulously arranged AI-generated ensemble lies a tantalizing facade, captivating our gaze. Yet, as we search for the soul of human expression, we question whether algorithms can truly embody the essence of authentic art.
            </div>
          </div>
        </div>

        {/* ── Section 1 ── */}
        <section className="project project--details project--left">
          <span className="project__label project__label--default">Ethical Considerations</span>
          <p>The emergence of AI-generated art raises ethical questions and concerns. One of the key challenges is navigating the boundaries of authorship and ownership. Determining the role of AI algorithms and their creators in the artistic process, as well as addressing issues of attribution and intellectual property, requires careful deliberation. Additionally, ensuring that AI-generated art does not perpetuate bias, discrimination, or harmful content is crucial for fostering a responsible and inclusive artistic landscape.</p>
        </section>

        {/* ── Gallery 2 — Grid Breakout ── */}
        <div className="gallery-wrap gallery-wrap--large">
          <div className="gallery gallery--grid gallery--breakout" id="gallery-2">
            {GALLERY_GRID_ITEMS.map((item, i) => (
              <GalleryItemCut key={i} url={item.url} />
            ))}
            <div className="caption">
              <p>Devoid of inherent knowledge, the language model relies solely on probabilities to craft a peculiar vision. As a result, the earrings hang in curious defiance of physics, inviting us to ponder the implications of relinquishing human understanding in the pursuit of artificial creativity.</p>
            </div>
          </div>
        </div>

        {/* ── Section 2 ── */}
        <section className="project project--details project--right">
          <span className="project__label project__label--default">Preserving Artistic Identity</span>
          <p>While AI offers new avenues for artistic exploration, there is a concern that it may overshadow or replace human creativity. Balancing the integration of AI tools and techniques with preserving the unique perspectives, emotional depth, and artistic identity of human artists is a significant challenge. Striking the right balance between AI-generated art and the irreplaceable human touch requires thoughtful consideration and an ongoing dialogue between artists, technologists, and the wider art community.</p>
        </section>

        {/* ── Gallery 3 — Grid10 ── */}
        <div className="gallery-wrap">
          <div className="gallery gallery--grid10" id="gallery-3">
            {GALLERY_GRID10_ITEMS.map((item) => (
              <GalleryItem key={item.pos} url={item.url} className={`pos-${item.pos}`} />
            ))}
            <div className="caption">The Art of Perfection?</div>
          </div>
        </div>

        {/* ── Section 3 ── */}
        <section className="project project--details">
          <span className="project__label project__label--default">Societal Impact</span>
          <p>As AI-generated art becomes more prevalent, its long-term impact on the art market, art institutions, and the broader societal perception of art needs to be carefully examined. Understanding the implications of AI-generated art for art sales, copyright laws, and the dynamics of the art market is crucial for shaping future policies and practices. Additionally, exploring the ways in which AI-generated art can democratize artistic expression and challenge traditional hierarchies is an ongoing challenge that requires proactive engagement and collaboration.</p>
        </section>

        {/* ── Gallery 4 — Stack dark ── */}
        <div className="gallery-wrap gallery-wrap--dense">
          <div className="gallery gallery--stack gallery--stack-inverse gallery--stack-dark" id="gallery-4">
            {GALLERY_STACK4.map((item, i) => <GalleryItem key={i} url={item.url} />)}
            <div className="caption">
              <p>AI-generated art captivates with varied creations, sometimes senseless, yet impressively enigmatic.</p>
            </div>
          </div>
        </div>

        {/* ── Gallery 5 — Stack glass ── */}
        <div className="gallery-wrap gallery-wrap--dense">
          <div className="gallery gallery--stack gallery--stack-glass" id="gallery-5">
            {GALLERY_STACK5.map((item, i) => <GalleryItem key={i} url={item.url} />)}
            <div className="caption">
              <p>In the realm of unpredictable algorithms, some variations may appear random or without purpose, challenging traditional notions of beauty and meaning.</p>
            </div>
          </div>
        </div>

        {/* ── Gallery 6 — Stack scale dark ── */}
        <div className="gallery-wrap gallery-wrap--dense">
          <div className="gallery gallery--stack gallery--stack-inverse gallery--stack-scale gallery--stack-dark" id="gallery-6">
            {GALLERY_STACK6.map((item, i) => <GalleryItem key={i} url={item.url} />)}
            <div className="caption">
              <p>This uncharted territory challenges artists and art enthusiasts alike, igniting debates about the role of intention and chance in the artistic process.</p>
            </div>
          </div>
        </div>

        {/* ── Section 4 ── */}
        <section className="project project--details project--right">
          <span className="project__label project__label--default">Unmasking the Void of Authenticity</span>
          <p>While AI-generated art showcases impressive technical prowess, it leaves behind an unsettling void in the quest for authenticity. As humans, we seek the genuine touch of human hands and the depth of emotional connection embedded within traditional art forms. The lack of human essence in AI-generated creations may leave us yearning for the profound human expression that sparks true resonance, evoking a sense of emptiness in the face of machine-driven artistry.</p>
        </section>

        {/* ── Gallery 7 — Gridtiny ── */}
        <div className="gallery-wrap">
          <div className="gallery gallery--gridtiny" id="gallery-7">
            {GALLERY_GRIDTINY.map((url, i) => <GalleryItem key={i} url={url} />)}
            <div className="caption">What is creativity?</div>
          </div>
        </div>

        {/* ── Section 5 ── */}
        <section className="project project--details project--left">
          <span className="project__label project__label--default">Photographic Flaws in Perfect Harmony</span>
          <p>In the realm of AI-generated photography, the quest for flawlessness inadvertently unveils a striking paradox - the absence of authentic imperfections. Even in the most human-like subjects, wrinkles and blemishes appear too immaculate, leaving us yearning for the raw, unfiltered beauty that only true imperfection can evoke.</p>
        </section>

        {/* ── Gallery 8 — Bento ── */}
        <div className="gallery-wrap">
          <div className="gallery gallery--bento" id="gallery-8">
            {GALLERY_BENTO.map((item, i) => <GalleryItem key={i} url={item.url} />)}
            <div className="caption">Perfect Imperfections</div>
          </div>
        </div>

        {/* ── Section 6 ── */}
        <section className="project project--details project--right">
          <span className="project__label project__label--default">Moving forward</span>
          <p>As we conclude this transformative project, we are left with profound questions that continue to shape our understanding of AI-generated art and its place in the artistic landscape. How do we reconcile the precision of algorithms with the intangible spark of human creativity? Can machines truly grasp the depth of emotion and meaning that art evokes within us? And as AI continues to advance, how do we preserve the authenticity and soul that define artistic expression?</p>
        </section>

        {/* ── Section 7 ── */}
        <section className="project project--details project--left">
          <span className="project__label project__label--default">Trick and how to</span>
          <p>Made using an awesome mix between GSAP, Flip, Scrolltrigger and Lenis. Lenis itself is a new discover on my stack.</p>
        </section>

        {/* ── Gallery 9 — One ── */}
        <div className="gallery-wrap">
          <div className="gallery gallery--one" id="gallery-9">
            <GalleryItem url="https://picsum.photos/4000/4000?random=100" />
            <div className="caption">Made by Dennys Dionigi</div>
          </div>
        </div>

        {/* ── Section 8 ── */}
        <section className="project project--details project--left">
          <p>Discover more Ui and Ux elements <a href="https://dennysdionigi.com" target="_blank" rel="noreferrer">here</a>.</p>
        </section>
      </main>
    </>
  );
}