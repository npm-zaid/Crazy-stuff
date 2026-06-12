import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const items = [
  { caption: "Zorith - L91" },
  { caption: "Mykar - L27" },
  { caption: "Thalon - V75" },
  { caption: "Vexra - N22" },
  { caption: "Drosin - X29" },
  { caption: "Ryndel - Y52" },
  { caption: "Korin - T18" },
  { caption: "Nymera - L50" },
  { caption: "Lektar - X43" },
  { caption: "Fexil - R50" },
  { caption: "Jaleth - N49" },
  { caption: "Torvik - Y15" },
  { caption: "Lumora - X82" },
  { caption: "Zekron - X99" },
  { caption: "Brynd - Q89" },
  { caption: "Solmir - Q91" },
  { caption: "Dareon - N38" },
  { caption: "Noxil - T76" },
  { caption: "Kairon - R28" },
  { caption: "Voric - T97" }
];

export default function ElasticGrid() {
  const gridRef = useRef(null);
  const smootherRef = useRef(null);
  const originalItemsRef = useRef([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Capture original items once
    originalItemsRef.current = Array.from(grid.querySelectorAll(".grid__item"));

    // Create ScrollSmoother
    smootherRef.current = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });

    let currentColumnCount = null;
    const baseLag = 0.2;
    const lagScale = 0.3;

    const getColumnCount = () => {
      const styles = getComputedStyle(grid);
      return styles
        .getPropertyValue("grid-template-columns")
        .split(" ")
        .filter(Boolean).length;
    };

    const clearGrid = () => {
      grid.querySelectorAll(".grid__column").forEach((col) => col.remove());
      originalItemsRef.current.forEach((item) => grid.appendChild(item));
    };

    const groupItemsByColumn = () => {
      const numColumns = getColumnCount();
      const columns = Array.from({ length: numColumns }, () => []);
      originalItemsRef.current.forEach((item, index) => {
        columns[index % numColumns].push(item);
      });
      return { columns, numColumns };
    };

    const buildGrid = (columns) => {
      const frag = document.createDocumentFragment();
      const columnContainers = [];

      columns.forEach((column, i) => {
        const lag = baseLag + (i + 1) * lagScale;
        const col = document.createElement("div");
        col.className = "grid__column";

        column.forEach((item) => col.appendChild(item));
        frag.appendChild(col);

        columnContainers.push({ element: col, lag });
      });

      grid.appendChild(frag);
      return columnContainers;
    };

    const applyLag = (containers) => {
      containers.forEach(({ element, lag }) => {
        smootherRef.current.effects(element, { speed: 1, lag });
      });
    };

    const init = () => {
      clearGrid();
      const { columns, numColumns } = groupItemsByColumn();
      currentColumnCount = numColumns;
      const containers = buildGrid(columns);
      applyLag(containers);
    };

    init();

    const handleResize = () => {
      const newCount = getColumnCount();
      if (newCount !== currentColumnCount) init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (smootherRef.current) smootherRef.current.kill();
    };
  }, []);

  return (
    <main id="smooth-content">
      <div className="h-[50vh]"></div>
      <div className="grid" ref={gridRef}>
        {items.map((item, index) => (
          <figure className="grid__item" key={index}>
            <div
              className="grid__item-img"
              style={{
                background: "linear-gradient(135deg, #1a1a1a, #4b4b4b)",
              }}
            ></div>
            <figcaption className="grid__item-caption">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
