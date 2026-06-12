// components/PageTransition.jsx
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const frameRef = useRef(null);
  const overlayPathRef = useRef(null);
  const location = useLocation();

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

  // 🔥 Page Transition Animation
  const animateTransition = () => {
    const overlayPath = overlayPathRef.current;
    const frame = frameRef.current;

    return gsap
      .timeline()
      .set(overlayPath, { attr: { d: paths.step1.unfilled } })
      .to(overlayPath, {
        duration: 0.8,
        ease: "power4.in",
        attr: { d: paths.step1.inBetween.curve1 },
      })
      .to(overlayPath, {
        duration: 0.2,
        ease: "power1",
        attr: { d: paths.step1.filled },
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

  // 🔥 Runs on every route change
  useEffect(() => {
    animateTransition();
  }, [location.pathname]);

  return (
    <div ref={frameRef} className="relative w-full min-h-screen overflow-hidden">
      {/* CONTENT */}
      <div className="relative z-10">{children}</div>

      {/* OVERLAY */}
      <svg
        className="overlay absolute inset-0 z-50 pointer-events-none"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={overlayPathRef}
          className="overlay__path fill-white"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
