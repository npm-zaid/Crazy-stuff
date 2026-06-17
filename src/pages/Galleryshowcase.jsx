// GalleryShowcase.jsx
//
// Dependencies (install in your project):
//   npm install gsap
//   Tailwind CSS must already be configured (no extra config needed —
//   this file only uses Tailwind's built-in arbitrary-value syntax).
//
// If you're using Next.js App Router, add `"use client"` as the very
// first line of this file, since this component touches the DOM/window
// and uses GSAP's ScrollTrigger.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = [
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/xtra-group6.jpg?v=1764351424",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/dp-pack2.jpg?v=1764343183",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cc-dp.jpg?v=1764280792",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cc-serum.jpg?v=1764279474",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cc-col-square.webp?v=1762416360",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/dp-bag-square-01-01.webp?v=1757416671",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/dermd-products.png?v=1753033534",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/candle-square-05-01.webp?v=1750833640",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/cps-square-01-01.webp?v=1748419375",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/exf-square-02.jpg?v=1750856965",
  "https://cdn.shopify.com/s/files/1/0185/5999/1872/files/fes-square-02.webp?v=1748941779",
];

const GALLERY_ITEMS = [...IMAGES, ...IMAGES, ...IMAGES].slice(0, 24);

const TEXT_CONTENT = [
  {
    title: "Running Through Reflection",
    desc:
      "One photo was taken on a rainy day at a running track. It is a tape of water covered the surface, and as the runner sped by, their silhouette reflected in the water. The image reflects an abstract, artistic quality, enhancing the sense of movement in the memory.",
  },
  {
    title: "Elegance in Boldness",
    desc:
      "This photo was captured in a controlled studio environment, emphasizing strong features and deep contrast.",
  },
  {
    title: "Dynamic Moments",
    desc:
      "Capturing the pure essence of speed and raw emotion in a split-second frame.",
  },
  {
    title: "Abstract Movement",
    desc:
      "The flow of time expressed visually through long exposures and deliberate camera movement.",
  },
];

const SCATTER_POSITIONS = [
  { top: "10%", left: "15%" },
  { top: "20%", left: "80%" },
  { top: "60%", left: "10%" },
  { top: "75%", left: "85%" },
  { top: "85%", left: "30%" },
  { top: "15%", left: "50%" },
];

function NavBar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-[rgba(10,10,11,0.9)] to-transparent backdrop-blur-[10px]">
      <div className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.05em]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="6" cy="6" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
        DermExcel
      </div>

      <div className="hidden md:flex items-center gap-8 bg-[#18181b] pl-8 pr-4 py-2 rounded-full border border-white/[0.02] shadow-[4px_4px_10px_rgba(0,0,0,0.9),inset_1px_1px_2px_rgba(255,255,255,0.08),inset_-1px_-1px_2px_rgba(0,0,0,0.6)]">
        <a href="#" className="text-sm text-[#f4f4f5] hover:text-[#a1a1aa] transition-colors">
          Manifesto
        </a>
        <a href="#" className="text-sm text-[#f4f4f5] hover:text-[#a1a1aa] transition-colors">
          Careers
        </a>
        <a href="#" className="text-sm text-[#f4f4f5] hover:text-[#a1a1aa] transition-colors">
          Log in
        </a>
        <a
          href="#"
          className="px-5 py-2.5 rounded-full font-medium text-sm bg-[#f4f4f5] text-[#0a0a0b] shadow-[0px_4px_0px_rgba(161,161,170,0.4),0px_6px_10px_rgba(0,0,0,0.4),inset_0px_-2px_5px_rgba(0,0,0,0.1),inset_0px_2px_5px_rgba(255,255,255,0.8)] transition-transform duration-200 active:translate-y-1 active:shadow-[0px_0px_0px_rgba(161,161,170,0.4),0px_2px_5px_rgba(0,0,0,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.1)]"
        >
          Sign up
        </a>
      </div>

      <button className="flex items-center gap-2 bg-[#18181b] text-[#f4f4f5] px-5 py-2.5 rounded-full border border-white/5 shadow-[0px_4px_0px_#09090a,0px_6px_10px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.08)] transition-transform duration-200 active:translate-y-1">
        Menu <span>≡</span>
      </button>
    </nav>
  );
}

function Hero() {
  return (
    <header className="pt-48 pb-16 px-6 md:px-8 text-center flex flex-col items-center gap-6">
      <div className="inline-block bg-[#18181b] px-4 py-2 rounded-full text-sm text-[#a1a1aa] border border-white/5 shadow-[4px_4px_8px_rgba(0,0,0,0.9),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.6)]">
        ✦ The Best Style
      </div>
      <h1 className="text-[2.5rem] md:text-[clamp(2.5rem,5vw,4.5rem)] max-w-[800px] font-medium tracking-[-0.03em]">
        Capturing Moments, Crafting Stories
      </h1>
      <p className="text-[#a1a1aa] max-w-[500px]">
        Discover the art of photography through unique perspectives and timeless imagery.
      </p>
    </header>
  );
}

export default function GalleryShowcase() {
  const galleryContainerRef = useRef(null);
  const sphereRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardRefs = useRef([]);
  const journeySectionRef = useRef(null);
  const constellationRef = useRef(null);

  const [cardTransforms, setCardTransforms] = useState([]);
  const [activeTitle, setActiveTitle] = useState(TEXT_CONTENT[0].title);
  const [activeDesc, setActiveDesc] = useState(TEXT_CONTENT[0].desc);

  // Stable random rotation for the scatter cards (computed once)
  const scatterRotations = useRef(
    SCATTER_POSITIONS.map(() => (Math.random() - 0.5) * 40)
  ).current;

  useEffect(() => {
    // --- 1. Fibonacci sphere layout -----------------------------------
    const radius = window.innerWidth < 768 ? 200 : 380;

    const transforms = GALLERY_ITEMS.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / GALLERY_ITEMS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const rotY = Math.atan2(x, z) * (180 / Math.PI);
      const rotX = Math.asin(-y / radius) * (180 / Math.PI);

      return { x, y, z, rotX, rotY };
    });
    setCardTransforms(transforms);

    // --- 2. Rotate the sphere on scroll --------------------------------
    const sphereTween = gsap.to(sphereRef.current, {
      rotateY: 360 * 2,
      rotateX: 45,
      ease: "none",
      scrollTrigger: {
        trigger: galleryContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => updateActiveCard(self.progress),
      },
    });

    // --- 3. Highlight the front-facing card + swap the side text ------
    function updateActiveCard(progress) {
      const textIndex = Math.floor(progress * TEXT_CONTENT.length) % TEXT_CONTENT.length;
      const nextTitle = TEXT_CONTENT[textIndex].title;

      if (titleRef.current?.dataset.current !== nextTitle) {
        titleRef.current.dataset.current = nextTitle;
        gsap.to([titleRef.current, descRef.current], {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            setActiveTitle(TEXT_CONTENT[textIndex].title);
            setActiveDesc(TEXT_CONTENT[textIndex].desc);
            gsap.to([titleRef.current, descRef.current], { opacity: 1, duration: 0.2 });
          },
        });
      }

      const focusIndex = Math.floor(progress * GALLERY_ITEMS.length);
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const img = card.querySelector("img");
        const isActive = Math.abs(idx - focusIndex) < 2;
        card.style.filter = isActive ? "drop-shadow(0 0 20px rgba(255,255,255,0.1))" : "none";
        if (img) {
          img.style.filter = isActive ? "grayscale(0%) brightness(1)" : "grayscale(80%) brightness(0.6)";
        }
      });
    }

    // --- 4. Parallax for the scattered "constellation" cards ----------
    const scatterCards = constellationRef.current?.querySelectorAll(".constellation-card");
    const parallaxTween = gsap.to(scatterCards, {
      y: -100,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: {
        trigger: journeySectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      sphereTween.scrollTrigger?.kill();
      sphereTween.kill();
      parallaxTween.scrollTrigger?.kill();
      parallaxTween.kill();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-[#f4f4f5] font-sans overflow-x-hidden">
      {/* Grid overlay */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <NavBar />
      <Hero />

      {/* 3D Gallery */}
      <section ref={galleryContainerRef} className="relative h-[300vh] w-full">
        <div className="hidden md:block sticky top-1/2 -translate-y-1/2 w-[300px] z-10 ml-[10%]">
          <h2
            ref={titleRef}
            className="text-2xl mb-4 [text-shadow:0_4px_10px_rgba(0,0,0,0.8)]"
          >
            {activeTitle}
          </h2>
          <p ref={descRef} className="text-[#a1a1aa] text-sm">
            {activeDesc}
          </p>
        </div>

        <div className="sticky top-0 h-screen w-full flex justify-center items-center [perspective:1200px] overflow-hidden">
          <div
            ref={sphereRef}
            className="relative w-0 h-0 [transform-style:preserve-3d]"
          >
            {GALLERY_ITEMS.map((src, i) => {
              const t = cardTransforms[i];
              const transform = t
                ? `translate3d(${t.x}px, ${t.y}px, ${t.z}px) rotateY(${t.rotY}deg) rotateX(${t.rotX}deg)`
                : "translate3d(0px, 0px, 0px)";
              return (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  style={{ transform }}
                  className="absolute w-[120px] h-[160px] md:w-40 md:h-[220px] -left-[60px] md:-left-20 -top-[80px] md:-top-[110px] bg-[#18181b] rounded-2xl p-2 [transform-style:preserve-3d] [backface-visibility:visible] border border-white/[0.03] shadow-[8px_8px_16px_rgba(0,0,0,0.9),-4px_-4px_10px_rgba(255,255,255,0.02),inset_3px_3px_6px_rgba(255,255,255,0.08),inset_-3px_-3px_6px_rgba(0,0,0,0.6)] transition-[filter] duration-300"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover rounded-[10px] transition-all duration-300 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.8)]"
                    style={{ filter: "grayscale(80%) brightness(0.6)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.2"
            fill="none"
          />
          <path
            d="M20,0 L80,100"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.2"
            fill="none"
          />
        </svg>
      </section>

      {/* Journey / CTA */}
      <section
        ref={journeySectionRef}
        className="relative min-h-screen flex justify-center items-center overflow-hidden [background:radial-gradient(circle_at_center,#111113_0%,#0a0a0b_70%)]"
      >
        <div ref={constellationRef} className="absolute inset-0 w-full h-full pointer-events-none">
          {SCATTER_POSITIONS.map((pos, i) => (
            <div
              key={i}
              className="constellation-card absolute w-[100px] h-[140px] opacity-50 bg-[#18181b] rounded-2xl p-2 border border-white/[0.03] shadow-[8px_8px_16px_rgba(0,0,0,0.9),-4px_-4px_10px_rgba(255,255,255,0.02),inset_3px_3px_6px_rgba(255,255,255,0.08),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${scatterRotations[i]}deg) scale(0.8)`,
              }}
            >
              <img
                src={IMAGES[i % IMAGES.length]}
                alt=""
                className="w-full h-full object-cover rounded-[10px]"
                style={{ filter: "grayscale(80%) brightness(0.6)" }}
              />
            </div>
          ))}
        </div>

        <div className="text-center z-[2] bg-[rgba(10,10,11,0.6)] p-12 rounded-3xl backdrop-blur-[12px] border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-5xl mb-2 font-medium tracking-[-0.03em]">Start Your Journey</h2>
          <p className="text-[#a1a1aa] mb-8">We would like to start a project with you</p>
          <a
            href="#"
            className="inline-block text-lg px-10 py-4 rounded-full font-medium bg-[#f4f4f5] text-[#0a0a0b] shadow-[0px_4px_0px_rgba(161,161,170,0.4),0px_6px_10px_rgba(0,0,0,0.4),inset_0px_-2px_5px_rgba(0,0,0,0.1),inset_0px_2px_5px_rgba(255,255,255,0.8)] transition-transform duration-200 active:translate-y-1 active:shadow-[0px_0px_0px_rgba(161,161,170,0.4),0px_2px_5px_rgba(0,0,0,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.1)]"
          >
            Sign up
          </a>
        </div>
      </section>
    </div>
  );
}