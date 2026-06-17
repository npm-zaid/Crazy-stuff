"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FLAT_PATH =
  "M100,10 100,30 0,30 0,10 C0,10 19,10 50,10 C81,10 100,10 100,10z";

export default function ElasticSectionDivider() {
  const containerRef = useRef(null);
  const edgeRefs = useRef([]);
  const arrowUpRef = useRef(null);
  const arrowDownRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const edges = edgeRefs.current.filter(Boolean);

      // Elastic "splash" on the wave divider, driven by scroll velocity
      ScrollTrigger.create({
        trigger: "#s1",
        onUpdate: (self) => {
          let velocity = gsap.utils.clamp(-2000, 2000, self.getVelocity());
          const v = gsap.utils.mapRange(-2000, 2000, 0, 20, velocity);
          velocity = Math.abs(velocity);
          if (velocity < 200) return; // ignore velocity below this amount

          gsap.killTweensOf(edges);
          gsap
            .timeline()
            .to(edges, {
              duration: 0.1,
              ease: "none",
              attr: {
                d: `M100,10 100,30 0,30 0,10 C0,10 19,${v} 50,${v} C81,${v} 100,10 100,10`,
              },
            })
            .to(edges, {
              duration: 0.5 + velocity / 4000, // velocity impacts duration
              ease: `elastic.out(${velocity / 1500})`, // and amount of elastic ease
              attr: { d: FLAT_PATH },
            });
        },
      });

      // Up/down scroll-hint arrows
      gsap.to(arrowDownRef.current, {
        duration: 0.3,
        opacity: 0,
        yPercent: -50,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: "#s1",
          start: "0 -3%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      });

      gsap.from(arrowUpRef.current, {
        duration: 0.3,
        opacity: 0,
        yPercent: 50,
        ease: "back.out(3)",
        scrollTrigger: {
          trigger: "#s2",
          start: "0 2%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      });
    }, containerRef);

    return () => ctx.revert(); // kills tweens + ScrollTriggers on unmount
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-white">
      <section
        id="s1"
        className="relative h-screen overflow-visible bg-[#1d1e22]"
      >
        {/* put section 1 content here */}

        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          fill="#fff"
          className="absolute -bottom-px h-[150px] w-full overflow-visible"
        >
          <path ref={(el) => (edgeRefs.current[0] = el)} d={FLAT_PATH} />
        </svg>
      </section>

      <section id="s2" className="relative h-screen overflow-visible bg-white">
        {/* put section 2 content here */}

        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          fill="#1d1e22"
          className="absolute -bottom-px h-[150px] w-full overflow-visible"
        >
          <path ref={(el) => (edgeRefs.current[1] = el)} d={FLAT_PATH} />
        </svg>
      </section>

      <svg
        viewBox="0 0 10 30"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fixed bottom-6 left-1/2 z-50 h-10 w-10 -translate-x-1/2"
      >
        <path ref={arrowUpRef} stroke="#fff" d="M5,17 v6 M3,19 5,17 7,19" />
        <path
          ref={arrowDownRef}
          stroke="#1d1e22"
          d="M5,18 v6 M3,22 5,24 7,22"
        />
      </svg>
    </div>
  );
}