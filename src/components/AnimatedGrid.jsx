import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedGrid() {
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const items = gsap.utils.toArray(".grid__item");
    const columns = {};

    // Group by column
    items.forEach((item) => {
      const col = item.offsetLeft;
      if (!columns[col]) columns[col] = [];
      columns[col].push(item);
    });

    const colArray = Object.values(columns);

    // Create column-based lag
    colArray.forEach((col, index) => {
      const lagAmount = (index + 1) * 20; // 20px → scale if needed

      gsap.fromTo(
        col,
        { y: -lagAmount },
        {
          y: lagAmount,
          ease: "none",
          scrollTrigger: {
            trigger: grid,
            start: "top bottom",
            end: "bottom top",
            scrub: true, // buttery smooth with Lenis
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  const cards = [
    { title: "Card One", bg: "linear-gradient(135deg, #ff9a9e, #fad0c4)" },
    { title: "Card Two", bg: "linear-gradient(135deg, #a18cd1, #fbc2eb)" },
    { title: "Card Three", bg: "linear-gradient(135deg, #fbc2eb, #a6c1ee)" },
    { title: "Card Four", bg: "linear-gradient(135deg, #84fab0, #8fd3f4)" },
    { title: "Card Five", bg: "linear-gradient(135deg, #ffecd2, #fcb69f)" },
    { title: "Card Six", bg: "linear-gradient(135deg, #ff6a88, #ff99ac)" },
    { title: "Card Seven", bg: "linear-gradient(135deg, #96fbc4, #f9f586)" },
    { title: "Card Eight", bg: "linear-gradient(135deg, #c3cfe2, #c3cfe2)" },
  ];

  return (
    <div className="bg-sky-200 py-20">
      <div
        ref={gridRef}
        className="grid grid-cols-4 gap-6 px-10"
      >
        {cards.map((item, i) => (
          <figure className="grid__item" key={i}>
            <div
              className="grid__item-img h-48 rounded-xl"
              style={{ background: item.bg }}
            />
            <figcaption className="grid__item-caption mt-3 text-lg font-semibold">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
