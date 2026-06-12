// TeamSlider.jsx
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

 const teamMembers = [
  { name: "Em", image: "https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" },
  { name: "Alex", image: "https://kota-content.b-cdn.net/app/uploads/2023/11/approach-768x802.jpg" },
  { name: "Chris", image: "https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" },
  { name: "Sam", image: "https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" },
  { name: "Taylor", image: "https://kota-content.b-cdn.net/app/uploads/2023/11/mission-500x451.jpg" },
];

const ArrowIcon = ({ direction = "right", className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "right" ? (
      <>
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </>
    ) : (
      <>
        <path d="M19 12H5" />
        <path d="M11 5l-7 7 7 7" />
      </>
    )}
  </svg>
);

const TeamSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageRef = useRef(null);
  const nameRef = useRef(null);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  // Animate on slide change
  useEffect(() => {
    const imgEl = imageRef.current;
    const nameEl = nameRef.current;

    // Reset starting state
    gsap.set([imgEl, nameEl], { clearProps: "all" });

    const tl = gsap.timeline();
    tl.fromTo(
      imgEl,
      { autoAlpha: 0, x: 80 },
      { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      nameEl,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, [activeIndex]);

  const current = teamMembers[activeIndex];

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-black text-white">
      <div className="relative w-full max-w-5xl px-6">
        {/* Main rounded image card */}
        <div className="relative h-[380px] overflow-hidden bg-neutral-700 md:h-[460px] rounded-l-[260px]">
          <img
            ref={imageRef}
            src={current.image}
            alt={current.name}
            className="h-full w-full object-cover"
          />

          {/* Name */}
          <div
            ref={nameRef}
            className="pointer-events-none absolute bottom-6 left-8 text-4xl font-semibold md:text-5xl"
          >
            {current.name}
          </div>
        </div>

        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/40 backdrop-blur-sm hover:bg-black/70 transition"
        >
          <ArrowIcon direction="left" className="h-7 w-7" />
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/40 backdrop-blur-sm hover:bg-black/70 transition"
        >
          <ArrowIcon direction="right" className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
};

export default TeamSlider;
