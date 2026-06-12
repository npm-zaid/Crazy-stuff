import React, { useEffect, useRef } from 'react';

const texts = [
  "Why",
  "is",
  "this",
  "so",
  "satisfying",
  "to",
  "watch?"
];

const MORPH_TIME = 1;
const COOLDOWN_TIME = 0.25;

export default function MorphingText() {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = COOLDOWN_TIME;

    const elts = {
      text1: text1Ref.current,
      text2: text2Ref.current
    };

    if (!elts.text1 || !elts.text2) return;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(fraction) {
      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inverseFraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / inverseFraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(inverseFraction, 0.4) * 100}%`;

      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / MORPH_TIME;

      if (fraction > 1) {
        cooldown = COOLDOWN_TIME;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function doCooldown() {
      morph = 0;
      elts.text2.style.filter = "";
      elts.text2.style.opacity = "100%";

      elts.text1.style.filter = "";
      elts.text1.style.opacity = "0%";
    }

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      let newTime = new Date();
      let shouldIncrementIndex = cooldown > 0;
      let dt = (newTime - time) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Raleway:900&display=swap');
        .font-raleway { font-family: 'Raleway', sans-serif; }
      `}</style>

      {/* Text Container */}
      <div 
        className="absolute inset-x-0 m-auto w-full h-[80pt] select-none pointer-events-none"
        style={{ filter: "url(#threshold) blur(0.6px)" }}
      >
        <span
          ref={text1Ref}
          className="absolute inline-block w-full text-center font-raleway text-[80pt] font-black"
        />
        <span
          ref={text2Ref}
          className="absolute inline-block w-full text-center font-raleway text-[80pt] font-black"
        />
      </div>

      {/* SVG Threshold Filter */}
      <svg id="filters" className="hidden">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140" 
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}