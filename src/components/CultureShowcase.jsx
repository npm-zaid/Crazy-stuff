import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const dataList = [
  {
    title: "Zero ego hiring policy.",
    desc: "We only hire open minded people that will be easy going and of course, talented."
  },
  {
    title: "We encourage creativity.",
    desc: "Every idea matters. If you can imagine it, we will help you create it."
  },
  {
    title: "Flexible work environment.",
    desc: "Work from anywhere. We trust our team to deliver their best."
  }
];

const CultureShowcase = () => {
  const [index, setIndex] = useState(0);
  const rodRef = useRef(null);

  // Animate the gradient rod height on index change
  useEffect(() => {
    gsap.fromTo(
      rodRef.current,
      { height: "0px" },
      {
        height: "120px",
        duration: 1.3,
        ease: "elastic.out(1, 0.4)"
      }
    );
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % dataList.length);
  };

  return (
    <div className="w-full bg-black text-white py-32 px-10 md:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        {/* LEFT TEXT */}
        <h1 className="text-[7vw] md:text-[4.5vw] font-light leading-tight">
          Sorry, no table <br /> football, but...
        </h1>

        {/* RIGHT SECTION */}
        <div>
          {/* Content Row */}
          <div className="flex items-start gap-8">

            {/* Gradient Rod */}
            <div
              ref={rodRef}
              className="w-[4px] rounded-full bg-gradient-to-b from-purple-400 via-pink-400 to-teal-300"
            ></div>

            {/* Text */}
            <div>
              <h2 className="text-[5vw] md:text-[2.8vw] font-light leading-tight">
                {dataList[index].title}
              </h2>

              <p className="text-lg text-zinc-300 mt-4 max-w-[450px] leading-relaxed">
                {dataList[index].desc}
              </p>

              {/* BUTTON */}
              <button
                onClick={handleNext}
                className="flex items-center gap-3 mt-10 group"
              >
                {/* Circular Arrow */}
                <div className="w-12 h-12 border border-white rounded-full flex items-center justify-center group-hover:rotate-180 transition-all duration-500">
                  <span className="text-2xl">↻</span>
                </div>

                <span className="text-white tracking-wider text-sm">
                  SHOW ANOTHER
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

    
    </div>
  );
};

export default CultureShowcase;
