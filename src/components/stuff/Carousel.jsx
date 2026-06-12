import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";

const ASSETS = [
  { src: "https://images.unsplash.com/photo-1774565784366-72db806a40f9?q=80&w=987&auto=format&fit=crop", title: "cable car station" },
  { src: "https://images.unsplash.com/photo-1776031312164-f22c0edbdfb9?q=80&w=600&auto=format&fit=crop", title: "light-colored house" },
  { src: "https://images.unsplash.com/photo-1777763517503-05d74f2e0008?q=80&w=600&auto=format&fit=crop", title: "cherry blossoms" },
  { src: "https://images.unsplash.com/photo-1774651458632-17df84bad45e?q=80&w=600&auto=format&fit=crop", title: "bottles of drinks" },
  { src: "https://images.unsplash.com/photo-1778360508753-dcb2afbeadc2?q=80&w=600&auto=format&fit=crop", title: "tree-lined road" },
  { src: "https://images.unsplash.com/photo-1777221895589-2f81579e0dca?q=80&w=600&auto=format&fit=crop", title: "train window view" },
  { src: "https://images.unsplash.com/photo-1777763517666-b9fd2c9b6a0c?q=80&w=600&auto=format&fit=crop", title: "sunlight streams" },
  { src: "https://images.unsplash.com/photo-1777221895551-844a3c1243b3?q=80&w=600&auto=format&fit=crop", title: "seagulls" },
  { src: "https://images.unsplash.com/photo-1777221895297-9878eb5e53f5?q=80&w=600&auto=format&fit=crop", title: "pink flowers" },
  { src: "https://images.unsplash.com/photo-1777908724790-2ec0d06d8ff7?q=80&w=600&auto=format&fit=crop", title: "paddleboarding" },
];

export default function Carousel() {
  const [active, setActive] = useState(3);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const titleRefs = useRef([]);

  const goTo = useCallback((index) => {
    if (index < 0 || index >= ASSETS.length) return;
    setActive(index);
  }, []);

  // Run GSAP animations whenever active changes
  useEffect(() => {
    const track = trackRef.current;
    const slides = slideRefs.current;
    const titles = titleRefs.current;
    if (!track || !slides.length) return;

    const sw = slides[0]?.offsetWidth ?? 0;

    gsap.to(track, {
      x: -(active * sw),
      ease: "elastic.out(1, 0.85)",
      duration: 0.9,
    });

    slides.forEach((el, i) => {
      if (!el) return;
      const diff = i - active;
      gsap.to(el, {
        rotate: diff * 30,
        scale: diff === 0 ? 1 : 0.6,
        y: `${diff * 50}%`,
        ease: "elastic.out(1, 0.85)",
        duration: 0.9,
      });
    });

    titles.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === active ? 1 : 0,
        duration: 0.3,
      });
    });
  }, [active]);

  // Set initial positions without animation
  useEffect(() => {
    const track = trackRef.current;
    const slides = slideRefs.current;
    const titles = titleRefs.current;
    if (!track || !slides.length) return;

    const sw = slides[0]?.offsetWidth ?? 0;

    gsap.set(track, { x: -(active * sw) });

    slides.forEach((el, i) => {
      if (!el) return;
      const diff = i - active;
      gsap.set(el, {
        rotate: diff * 30,
        scale: diff === 0 ? 1 : 0.6,
        y: `${diff * 50}%`,
      });
    });

    titles.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: i === active ? 1 : 0 });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") goTo(Math.max(0, active - 1));
      if (e.key === "ArrowRight") goTo(Math.min(ASSETS.length - 1, active + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, goTo]);

  return (
    <div
      className="select-none min-h-screen grid place-content-center overflow-hidden pb-20"
      style={{ background: "#ececec", fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');`}</style>

      {/* Carousel wrapper */}
      <div className="relative overflow-visible" style={{ width: "clamp(120px, 80vmin, 300px)" }}>
        {/* Track */}
        <div ref={trackRef} className="flex w-fit">
          {ASSETS.map((item, i) => (
            <div
              key={i}
              ref={(el) => (slideRefs.current[i] = el)}
              className="flex flex-col items-center gap-2 flex-shrink-0 will-change-transform"
              style={{ width: "clamp(120px, 80vmin, 300px)", aspectRatio: "1/1" }}
            >
              <span
                ref={(el) => (titleRefs.current[i] = el)}
                className="whitespace-nowrap text-[#333]"
                style={{ fontSize: "clamp(11px, 1.4vmin, 14px)", opacity: 0 }}
              >
                {item.title}
              </span>
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                onClick={() => goTo(i)}
                className="w-full h-full object-cover rounded-2xl cursor-pointer block"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-0 right-0 w-fit mx-auto flex items-center gap-3 justify-center px-3 py-1 rounded-full border border-neutral-200/80 shadow-sm text-neutral-700" style={{ background: "rgba(220,220,220,0.6)", backdropFilter: "blur(6px)" }}>
        {/* Prev */}
        <button
          onClick={() => goTo(Math.max(0, active - 1))}
          className="p-2 cursor-pointer rounded-full hover:bg-black/5 transition-colors border-0 bg-transparent text-inherit"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Dots */}
        <div className="flex justify-center items-center gap-1.5" style={{ width: 180 }}>
          {ASSETS.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-full cursor-pointer transition-all duration-300 bg-current"
              style={{
                width: i === active ? 28 : 8,
                opacity: i === active ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => goTo(Math.min(ASSETS.length - 1, active + 1))}
          className="p-2 cursor-pointer rounded-full hover:bg-black/5 transition-colors border-0 bg-transparent text-inherit"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}