import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LEFT_ITEMS = [
  "Jean Morel", "Claire Monet", "Lucie Marin", "André Roche",
  "Hélène Vidal", "Pierre Noel", "Marcel Duroc", "Simone Rey",
  "Lucien Arto", "Colette Fay", "Henri Blanc", "Marie Roche",
  "René Duval", "Juliette Roy", "Alain Giroux", "Sylvie Moret",
  "Jacques Lenoir", "Monique Barel", "Claude Verne", "Odette Perrin",
  "Pauline Arcy", "Victor Lamy", "Bernard Faye", "Aimée Duret",
];

const RIGHT_ITEMS = [
  "Émile Ravel", "Camille Dorny", "Sophie Lalot", "Gaston Merle",
  "Estelle Dupre", "Lucien Beart", "Thérèse Loup", "Raymond Vallé",
  "Odile Garnet", "Maurice Leno", "Irène Faure", "Charles Duret",
  "Elise Corbin", "Roland Marec", "Delphine Noé", "François Borel",
  "Nathalie Cour", "Georges Leval", "Solange Bret", "Étienne Dupré",
  "Renée Marchal", "Antoine Lory", "Michèle Arcy", "Pascal Duret",
];

function CircleSection() {
  const wrapperRef = useRef(null);
  const leftWrapperRef = useRef(null);
  const rightWrapperRef = useRef(null);
  const leftItemRefs = useRef([]);
  const rightItemRefs = useRef([]);

  const centerXRef = useRef(0);
  const centerYRef = useRef(0);
  const leftRadiusRef = useRef(0);
  const rightRadiusRef = useRef(0);

  const updateDimensions = useCallback(() => {
    centerXRef.current = window.innerWidth / 2;
    centerYRef.current = window.innerHeight / 2;
    if (leftWrapperRef.current)
      leftRadiusRef.current = leftWrapperRef.current.offsetWidth / 2;
    if (rightWrapperRef.current)
      rightRadiusRef.current = rightWrapperRef.current.offsetWidth / 2;
  }, []);

  const updateItemsPosition = useCallback((items, radius, direction, scrollY) => {
    const totalItems = items.length;
    const spacing = Math.PI / totalItems;
    items.forEach((item, index) => {
      if (!item) return;
      const angle = index * spacing - scrollY * direction * Math.PI * 2;
      const x = centerXRef.current + Math.cos(angle) * radius;
      const y = centerYRef.current + Math.sin(angle) * radius;
      const rotationOffset = direction === -1 ? 180 : 0;
      const rotation = (angle * 180) / Math.PI + rotationOffset;
      gsap.set(item, { x, y, rotation, transformOrigin: "center center" });
    });
  }, []);

  useEffect(() => {
    updateDimensions();

    // Initial positions
    updateItemsPosition(leftItemRefs.current, leftRadiusRef.current, 1, 0);
    updateItemsPosition(rightItemRefs.current, rightRadiusRef.current, -1, 0);

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const scrollY = self.progress * 0.5;
        updateItemsPosition(leftItemRefs.current, leftRadiusRef.current, 1, scrollY);
        updateItemsPosition(rightItemRefs.current, rightRadiusRef.current, -1, scrollY);
      },
    });

    const handleResize = () => {
      updateDimensions();
      updateItemsPosition(leftItemRefs.current, leftRadiusRef.current, 1, 0);
      updateItemsPosition(rightItemRefs.current, rightRadiusRef.current, -1, 0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions, updateItemsPosition]);

  const itemClass =
    "absolute top-0 left-0 uppercase font-normal list-none " +
    "text-[clamp(1.5rem,5vw,6rem)] md:text-[1.2rem] sm:text-[1rem] " +
    "w-[25rem] md:w-[15rem] sm:w-[10rem] " +
    "-translate-x-1/2 -translate-y-1/2 whitespace-nowrap";

  return (
    <section
      ref={wrapperRef}
      className="relative w-full h-svh overflow-hidden"
    >
      {/* Left circle list */}
      <ul
        ref={leftWrapperRef}
        className="absolute h-full p-0 m-0"
        style={{ width: "100vw", left: "30%", transform: "translateX(-100%)" }}
      >
        {LEFT_ITEMS.map((name, i) => (
          <li
            key={name}
            ref={(el) => (leftItemRefs.current[i] = el)}
            className={itemClass}
          >
            {name}
          </li>
        ))}
      </ul>

      {/* Right circle list */}
      <ul
        ref={rightWrapperRef}
        className="absolute h-full p-0 m-0 text-right"
        style={{ width: "100vw", left: "70%" }}
      >
        {RIGHT_ITEMS.map((name, i) => (
          <li
            key={name}
            ref={(el) => (rightItemRefs.current[i] = el)}
            className={itemClass}
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
          Circle Text
          <br />
          Scroll Animation
        </h1>
        <p className="text-gray-400 text-lg tracking-widest uppercase">
          Scroll down
        </p>
      </section>

      {/* 3D Circle */}
      <CircleSection />

      {/* Outro section */}
      <section className="h-svh flex justify-center items-center">
        <a href="./index3.html">
          <h1 className="text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-none tracking-tight hover:opacity-60 transition-opacity">
            Next Effect: Tube Circular
          </h1>
        </a>
      </section>
    </div>
  );
}