import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  "Vinny Blaze",
  "Lola Vance",
  "Rex Delgado",
  "Ruby Knox",
  "Mickey Torque",
  "Joey Marlowe",
  "Scarlet Dune",
  "Bobby Vega",
  "Cass Nova",
  "Lance Fury",
  "Frankie Valence",
  "Nina Rocco",
];

function CylinderSection() {
  const wrapperRef = useRef(null);
  const textWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const itemRefs = useRef([]);

  const calculatePositions = () => {
    const items = itemRefs.current;
    if (!items.length) return;

    const offset = 0.4;
    const radius =
      Math.min(window.innerWidth, window.innerHeight) * offset;
    const spacing = 180 / items.length;

    items.forEach((item, index) => {
      if (!item) return;
      const angle = (index * spacing * Math.PI) / 180;
      const rotationAngle = index * -spacing;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      item.style.transform = `translate3d(-50%, -50%, 0) translate3d(0px, ${y}px, ${z}px) rotateX(${rotationAngle}deg)`;
    });
  };

  useEffect(() => {
    calculatePositions();

    const trigger = ScrollTrigger.create({
      trigger: titleRef.current,
      start: "center center",
      end: "+=2000svh",
      pin: wrapperRef.current,
      scrub: 2,
      animation: gsap.fromTo(
        textWrapperRef.current,
        { rotateX: -80 },
        { rotateX: 270, ease: "none" }
      ),
    });

    const handleResize = () => calculatePositions();
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    /* cylinder__wrapper */
    <section
      ref={wrapperRef}
      className="relative w-full h-svh overflow-hidden flex flex-col justify-center items-center gap-40"
      style={{ perspective: "1000px" }}
    >
      {/* cylinder__title — hidden but used as ScrollTrigger anchor */}
      <p
        ref={titleRef}
        className="hidden text-blue-500"
      >
        Keep scrolling to see the animation
      </p>

      {/* cylinder__text__wrapper */}
      <ul
        ref={textWrapperRef}
        className="absolute w-full h-full text-center"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
        {ITEMS.map((name, i) => (
          /* cylinder__text__item */
          <li
            key={name}
            ref={(el) => (itemRefs.current[i] = el)}
            className="
              absolute top-1/2 left-1/2 w-full
              text-[clamp(3rem,9vw,7rem)]
              font-black uppercase tracking-tight
              text-white
              list-none
            "
            style={{ backfaceVisibility: "hidden" }}
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Intro section */}
      <section className="h-svh flex flex-col justify-center items-center text-center gap-6">
        <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-none tracking-tight">
          Cylinder Text
          <br />
          Scroll Animation
        </h1>
        <p className="text-gray-400 text-lg tracking-widest uppercase">
          Scroll down
        </p>
      </section>

      {/* 3D Cylinder */}
      <CylinderSection />

      {/* Outro section */}
      <section className="h-svh flex justify-center items-center">
        <a href="./index2.html">
          <h1 className="text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-none tracking-tight hover:opacity-60 transition-opacity">
            Next Effect: Double Circular
          </h1>
        </a>
      </section>
    </div>
  );
}