import { useEffect, useRef } from "react";

const SERVICES = ["DESIGN", "DEVELOP", "DEPLOY"];

const TEXT_ABOUT =
  "A space for work shaped with clarity and intention. Each project follows a simple path from thought to form, from form to function.";

const TEXT_SERVICES =
  "I create websites and digital experiences that value clarity above excess. Through minimal form and precise detail, I aim to build work that lasts and offers a quiet sense of order.";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function ScrollRevealPortfolio() {
  const textRefs = useRef([]);
  const servicesRef = useRef(null);
  const headerRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      textRefs.current.forEach((el) => el && el.style.setProperty("--clip-value", "0%"));
      headerRefs.current.forEach((el) => el && (el.style.transform = "translateX(0%)"));
      return;
    }

    let rafId = null;

    const update = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // --- 1. text reveal (matches the original "top 50% / bottom 50%" scrub) ---
      textRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const progress = clamp((vh * 0.5 - rect.top) / rect.height, 0, 1);
        el.style.setProperty("--clip-value", `${100 - progress * 100}%`);
      });

      // --- 2. services: slide-in, pin, separate, scale ---
      // hero + about are each one viewport tall, so .services naturally
      // starts its pin exactly two viewport-heights down the page.
      const pinStart = vh * 2;
      const pinDuration = vh * 2; // matches the original `+=${innerHeight * 2}`
      const pinEnd = pinStart + pinDuration;

      // Slide-in progress, driven by the position .services would have
      // if it were never pinned (its "natural" top offset).
      const naturalTop = pinStart - scrollY;
      const slideProgress = clamp((vh - naturalTop) / vh, 0, 1);
      const slideX = 100 - slideProgress * 100;

      const isPinned = scrollY >= pinStart && scrollY <= pinEnd;
      const section = servicesRef.current;
      if (section) {
        if (isPinned) {
          section.style.position = "fixed";
          section.style.top = "0px";
          section.style.left = "0px";
          section.style.width = "100%";
        } else {
          section.style.position = "relative";
          section.style.top = "";
          section.style.left = "";
          section.style.width = "";
        }
      }

      const headers = headerRefs.current;

      if (scrollY <= pinStart) {
        if (headers[0]) headers[0].style.transform = `translateX(${slideX}%)`;
        if (headers[1]) headers[1].style.transform = `translateX(${-slideX}%)`;
        if (headers[2]) headers[2].style.transform = `translateX(${slideX}%)`;
      } else {
        const pinProgress = clamp((scrollY - pinStart) / pinDuration, 0, 1);
        if (pinProgress <= 0.5) {
          const yProgress = pinProgress / 0.5;
          if (headers[0]) headers[0].style.transform = `translateY(${yProgress * 100}%)`;
          if (headers[1]) headers[1].style.transform = "translateX(0%)";
          if (headers[2]) headers[2].style.transform = `translateY(${yProgress * -100}%)`;
        } else {
          const scaleProgress = (pinProgress - 0.5) / 0.5;
          const minScale = window.innerWidth <= 1000 ? 0.3 : 0.1;
          const scale = 1 - scaleProgress * (1 - minScale);
          if (headers[0]) headers[0].style.transform = `translateY(100%) scale(${scale})`;
          if (headers[1]) headers[1].style.transform = `scale(${scale})`;
          if (headers[2]) headers[2].style.transform = `translateY(-100%) scale(${scale})`;
        }
      }

      rafId = null;
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
      />

      <div
        style={{ fontFamily: "'Manrope', sans-serif" }}
        className="w-full bg-[#1a1a1a] text-white"
      >
        {/* Hero */}
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden p-8">
          <div className="aspect-[5/7] w-[300px] overflow-hidden">
            <img
              src="https://picsum.photos/seed/atelier-hero/600/840"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* About */}
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden p-8">
          <h1
            ref={(el) => (textRefs.current[0] = el)}
            data-text={TEXT_ABOUT}
            style={{ "--clip-value": "100%" }}
            className="animate-text relative mx-auto w-full text-center text-[2rem] font-black leading-[1.125] tracking-[-0.05rem] text-[#4f4f4f] lg:w-[60%] lg:text-[4rem] lg:tracking-[-0.15rem]"
          >
            {TEXT_ABOUT}
          </h1>
        </section>

        {/* Services — pinned slide / scale section */}
        <section
          ref={servicesRef}
          className="relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden"
        >
          {SERVICES.map((label, i) => (
            <div
              key={label}
              ref={(el) => (headerRefs.current[i] = el)}
              className={`relative w-full bg-[#1a1a1a] px-8 will-change-transform ${
                i === 1 ? "z-[2]" : ""
              }`}
              style={{ transform: i === 1 ? "translateX(-100%)" : "translateX(100%)" }}
            >
              <span className="block w-full select-none text-center text-[10vw] font-extrabold leading-none tracking-tight">
                {label}
              </span>
            </div>
          ))}
        </section>

        {/* Services copy */}
        <section className="relative w-full px-8 pt-8 pb-[25vh] text-center mt-[155vh]">
          <h1
            ref={(el) => (textRefs.current[1] = el)}
            data-text={TEXT_SERVICES}
            style={{ "--clip-value": "100%" }}
            className="animate-text relative mx-auto w-full text-center text-[2rem] font-black leading-[1.125] tracking-[-0.05rem] text-[#4f4f4f] lg:w-[60%] lg:text-[4rem] lg:tracking-[-0.15rem]"
          >
            {TEXT_SERVICES}
          </h1>
        </section>

        {/* Outro */}
        <section className="relative flex h-screen w-full items-center justify-center overflow-hidden p-8">
          <div className="aspect-[5/7] w-[300px] overflow-hidden">
            <img
              src="https://picsum.photos/seed/atelier-outro/600/840"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </div>

      <style>{`
        .animate-text::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          color: #fff;
          clip-path: inset(0 0 var(--clip-value) 0);
          will-change: clip-path;
        }
      `}</style>
    </>
  );
}