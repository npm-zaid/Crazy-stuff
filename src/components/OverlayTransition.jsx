import React, { useRef, useState } from "react";
import gsap from "gsap";

export default function OverlayTransition() {
  const frameRef = useRef(null);
  const view2Ref = useRef(null);
  const overlayPathRef = useRef(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [page, setPage] = useState(1);

  const paths = {
    step1: {
      unfilled: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
      inBetween: {
        curve1: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
        curve2: "M 0 100 V 50 Q 50 100 100 50 V 100 z",
      },
      filled: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
    },
    step2: {
      filled: "M 0 0 V 100 Q 50 100 100 100 V 0 z",
      inBetween: {
        curve1: "M 0 0 V 50 Q 50 0 100 50 V 0 z",
        curve2: "M 0 0 V 50 Q 50 100 100 50 V 0 z",
      },
      unfilled: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
    },
  };

  const switchPages = (newPage) => {
    if (newPage === 2) {
      frameRef.current.classList.add("frame--view-open");
      view2Ref.current.classList.add("view--open");
    } else {
      frameRef.current.classList.remove("frame--view-open");
      view2Ref.current.classList.remove("view--open");
    }
  };

  const reveal = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPage(2);

    const overlayPath = overlayPathRef.current;

    gsap
      .timeline({
        onComplete: () => setIsAnimating(false),
      })
      .set(overlayPath, { attr: { d: paths.step1.unfilled } })
      .to(
        overlayPath,
        {
          duration: 0.8,
          ease: "power4.in",
          attr: { d: paths.step1.inBetween.curve1 },
        },
        0
      )
      .to(overlayPath, {
        duration: 0.2,
        ease: "power1",
        attr: { d: paths.step1.filled },
        onComplete: () => switchPages(2),
      })
      .set(overlayPath, {
        attr: { d: paths.step2.filled },
      })
      .to(overlayPath, {
        duration: 0.2,
        ease: "sine.in",
        attr: { d: paths.step2.inBetween.curve1 },
      })
      .to(overlayPath, {
        duration: 1,
        ease: "power4",
        attr: { d: paths.step2.unfilled },
      });
  };

  const unreveal = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPage(1);

    const overlayPath = overlayPathRef.current;

    gsap
      .timeline({
        onComplete: () => setIsAnimating(false),
      })
      .set(overlayPath, {
        attr: { d: paths.step2.unfilled },
      })
      .to(
        overlayPath,
        {
          duration: 0.8,
          ease: "power4.in",
          attr: { d: paths.step2.inBetween.curve2 },
        },
        0
      )
      .to(overlayPath, {
        duration: 0.2,
        ease: "power1",
        attr: { d: paths.step2.filled },
        onComplete: () => switchPages(1),
      })
      .set(overlayPath, {
        attr: { d: paths.step1.filled },
      })
      .to(overlayPath, {
        duration: 0.2,
        ease: "sine.in",
        attr: { d: paths.step1.inBetween.curve2 },
      })
      .to(overlayPath, {
        duration: 1,
        ease: "power4",
        attr: { d: paths.step1.unfilled },
      });
  };

  return (
    <div
      ref={frameRef}
      className="
        frame
        relative w-full h-screen overflow-hidden 
        bg-gray-900 text-white 
      "
    >
      {/* VIEW 1 */}
      <div
        className="
          view view--1 
          absolute inset-0 
          flex items-center justify-center
        "
      >
        <button
          onClick={reveal}
          className="
            unbutton button button--open
            px-6 py-3 text-lg font-semibold
            bg-white text-black rounded-lg
            shadow-lg
            hover:bg-gray-200 transition
          "
        >
          Open
        </button>
      </div>

      {/* VIEW 2 */}
      <div
        ref={view2Ref}
        className="
          view view--2 
          absolute inset-0 
          flex items-center justify-center
          opacity-0 pointer-events-none
          transition-opacity duration-300
        "
      >
        <button
          onClick={unreveal}
          className="
            unbutton button button--close
            px-6 py-3 text-lg font-semibold
            bg-white text-black rounded-lg
            shadow-lg
            hover:bg-gray-200 transition
          "
        >
          Back
        </button>
      </div>

      {/* SVG OVERLAY */}
      <svg
        className="overlay absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={overlayPathRef}
          className="overlay__path fill-gray-100"
          vectorEffect="non-scaling-stroke"
          d={paths.step1.unfilled}
        />
      </svg>
    </div>
  );
}
