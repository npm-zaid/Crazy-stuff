import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WorkList = () => {
  const containerRef = useRef(null);
  const list = [{}, {}, {}, {}, {}, {}, {}, {},{}, {}, {}, {}, {}, {}, {}, {}];

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".work-card");

      cards.forEach((card, index) => {
        const isLeft = index % 2 === 0; // even index → left animation

        gsap.from(card, {
          x: isLeft ? -150 : 150,
          filter: "blur(20px)",
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 40%",
            scrub: 2,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="min-h-screen mt-10" ref={containerRef}>
      <div className="w-[90vw] m-auto grid grid-cols-2 gap-4">
        {list.map((i, index) => (
          <div
            key={index}
            className="work-card border border-zinc-900 rounded-2xl"
          >
            <div className="flex justify-between p-4">
              <p>name {index + 1}</p>
              <p>2025</p>
            </div>

            <div className="h-[50vh] bg-sky-300/60 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkList;
