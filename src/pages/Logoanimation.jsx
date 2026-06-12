import { useEffect, useRef } from "react";
import gsap from "gsap";

const SVG_PATHS = [
  { tag: "polygon", points: "359.9,49.6 359.8,49.7 359.9,49.8" },
  { tag: "polygon", points: "28,0 10.8,0 28,9" },
  { tag: "polygon", points: "28,12.6 0,46 0,51.9 28,48.9" },
  { tag: "polygon", points: "0.8,105 28,105 28,74.7 20.3,69.7" },
  { tag: "polygon", points: "28,9 10.8,0 0,0 0,46 28,12.6" },
  { tag: "polygon", points: "0,51.9 0,57.3 20,69.8 20,69.8 20,69.8 28,74.7 28,48.9" },
  { tag: "polygon", points: "0,57.3 0,105 0.8,105 20.1,69.7" },
  { tag: "polygon", points: "89.7,40.6 61,25.9 38,46 38,47.8 91,41.9" },
  { tag: "polygon", points: "89.7,40.6 68.4,19.4 61,25.9" },
  { tag: "polygon", points: "99,41 126,37.9 126,30.3 99,0 99,0" },
  { tag: "polygon", points: "38,47.8 38,48.9 103.1,63.5 98.9,49.8 91,41.9" },
  { tag: "polygon", points: "68.4,19.3 49.2,0 38,0 38,14.1 61,25.8" },
  { tag: "polygon", points: "38,48.9 38,80.9 66,98.3 66,55.5 115.2,105 115.8,105 103.1,63.4" },
  { tag: "polygon", points: "61,25.9 38,14.1 38,46" },
  { tag: "polygon", points: "38,105 66,105 66,98.3 38,80.9" },
  { tag: "polygon", points: "126,0 99,0 126,30.3" },
  { tag: "polygon", points: "99,49.8 102.9,63.5 126,68.7 126,59.4 99,45.3" },
  { tag: "polygon", points: "99,41 99,45.3 126,59.4 126,37.9" },
  { tag: "polygon", points: "115.8,105 126,105 126,68.7 102.8,63.4" },
  { tag: "path", d: "M225.8,74.2l-12.6,24.5c7.5,4.1,16.1,6.5,25.3,6.5c2.2,0,4.3-0.1,6.4-0.4L237,77.7C233,77.5,229.1,76.2,225.8,74.2z" },
  { tag: "path", d: "M213.8,55.7l-20.8,23c4.8,8.4,11.8,15.4,20.3,20.1l12.6-24.5C219.3,70.3,214.7,63.5,213.8,55.7z" },
  { tag: "path", d: "M238.5,77.8c-0.5,0-1,0-1.4,0l7.8,27.1c8.7-1,16.7-4.2,23.6-8.9l-14.6-23.3C249.5,75.8,244.3,77.8,238.5,77.8z" },
  { tag: "path", d: "M251.5,31.3c6.7,4.1,11.3,11.2,11.9,19.4l27.5,1.5c-0.1-12.4-4.6-23.9-12-32.8L251.5,31.3z" },
  { tag: "path", d: "M263.6,52.7c0,8-3.8,15.2-9.8,19.8l14.6,23.3c13.6-9.4,22.6-25.2,22.6-43c0-0.2,0-0.4,0-0.6l-27.5-1.5C263.5,51.4,263.6,52,263.6,52.7z" },
  { tag: "path", d: "M227.3,30.3L212.7,7.1c-8.5,4.9-15.6,12.1-20.3,20.8L218.3,38C220.6,34.8,223.7,32.1,227.3,30.3z" },
  { tag: "path", d: "M213.6,52.7c0-5.5,1.8-10.6,4.7-14.7l-25.9-10.2c-4,7.5-6.3,16-6.3,25c0,9.4,2.5,18.2,6.8,25.8l20.8-23C213.6,54.7,213.6,53.7,213.6,52.7z" },
  { tag: "path", d: "M238.5,27.7c3.6,0,7,0.8,10.1,2.1l12.5-24.4c-6.8-3.3-14.5-5.1-22.6-5.1c-9.4,0-18.2,2.5-25.8,6.8l14.6,23.3C230.7,28.6,234.5,27.7,238.5,27.7z" },
  { tag: "path", d: "M251.5,31.3L279,19.4c-4.9-5.9-11-10.7-17.9-14.1l-12.5,24.4C249.6,30.2,250.6,30.7,251.5,31.3z" },
  { tag: "polygon", points: "387,105 360,50 360,89.1 376.1,105" },
  { tag: "polygon", points: "387,29.5 360.8,0 360,0 360,49.6 387,30.8" },
  { tag: "polygon", points: "387,0 360.8,0 387,29.5" },
  { tag: "polygon", points: "359.9,49.8 359.8,49.7 336.6,65.6 360,89.1 360,50" },
  { tag: "polygon", points: "336.1,26 335.6,26.1 330.8,59.8 335.6,26.1 308.8,27.1 335.6,26.1 335.6,25.5 310.2,0 299,0 299,8.2 327,61.4 327,55.5 336.8,65.6 359.9,49.7" },
  { tag: "polygon", points: "360,50 360,50 360,50 387,105 387,105 387,30.8 360,49.6 360,49.8" },
  { tag: "polygon", points: "299,105 326.1,105 310.9,78.9 326.1,105 327,105 327,69.5 299,86.5" },
  { tag: "polygon", points: "299,52.7 299,86.5 327,69.5 327,65.1 299,36.4" },
  { tag: "polygon", points: "336.1,26 335.6,25.6 335.6,26.1" },
  { tag: "polygon", points: "299,8.2 299,36.4 327,65.1 327,61.4" },
  { tag: "polygon", points: "425,36 425,27.8 399.8,0 397,0 397,49.5 397,49.5" },
  { tag: "polygon", points: "425,76 397,76 397,105.2 425,80.3" },
  { tag: "polygon", points: "432.5,63 438.1,40 425,40 425,36 397.4,49.5 425,66.1 425,63" },
  { tag: "polygon", points: "425,66.1 397,49.5 397,49.5 397,76 425,76" },
  { tag: "polygon", points: "425,23 444.3,23 437.3,0 399.8,0 425,27.8" },
  { tag: "polygon", points: "397.4,49.5 397.4,49.5 397.4,49.5" },
  { tag: "polygon", points: "432.5,63 456.7,63 449.5,40 438.1,40" },
  { tag: "polygon", points: "463,23 463,0 437.3,0 444.3,23" },
  { tag: "polygon", points: "458,63 458,40 449.5,40 456.7,63" },
  { tag: "polygon", points: "463,83 425,83 425,80.3 397.4,105 462,105 420.9,83.8 462,105 463,105" },
  { tag: "path", d: "M591.6,68.8c8.7-7.1,14.3-17.9,14.3-29.9c0-4.8-0.9-9.3-2.5-13.5l-20.6,13.3L591.6,68.8z" },
  { tag: "path", d: "M582.8,38.6L582.8,38.6C582.7,38.6,582.7,38.6,582.8,38.6L582.8,38.6z" },
  { tag: "path", d: "M567.8,77c0.5,0,1.1,0.4,1.6,0.4L564.8,54h-8.7l-13.9,21l8.8,11.1V77H567.8z" },
  { tag: "path", d: "M556.1,54H551V23h16.6c2.6,0,5.1,0.9,7.3,2.1l12.8-19.2C581.7,2.2,574.7,0,567.2,0h-33.8l27.2,16.7l27-10.7l-27,10.8l0,0l0,0l-37.7,15v17.9L542,75L556.1,54z" },
  { tag: "path", d: "M582.7,38.9c0,8.4-6.7,15.1-15.1,15.1h-2.9l4.6,23.5c8.4-0.4,16.1-3.6,22.2-8.6L582.7,38.9L582.7,38.9z" },
  { tag: "polygon", points: "523,103.4 523,105 551,105 551,86.1 542.2,74.8" },
  { tag: "polygon", points: "523,49.7 523,103.4 542,74.8" },
  { tag: "polygon", points: "533.4,0 523,0 523,31.8 560.7,16.7" },
  { tag: "path", d: "M582.7,38.6L582.7,38.6l20.6-13.2c-3-8-8.6-14.8-15.8-19.2l-12.8,19.2C579.6,27.8,582.7,32.8,582.7,38.6z" },
  { tag: "polygon", points: "609,65.6 609,105 615.3,105 628.8,75.8 615.3,105 637,105 637,96.9 619.9,53.5" },
  { tag: "polygon", points: "620.1,53.5 637,96.9 637,59.8 637,34.4" },
  { tag: "polygon", points: "637,0 617.8,0 637,21.8" },
  { tag: "polygon", points: "637,34.4 637,21.8 617.8,0 609,0 609,25.8 619.9,53.5" },
  { tag: "polygon", points: "609,25.8 609,65.6 619.7,53.5" },
  { tag: "polygon", points: "686.5,83 674,83 674,63 695.6,63 690.1,40 683.5,40 664.3,83.1 677,105 681.6,105" },
  { tag: "polygon", points: "647,53.2 647,105 654.5,105 664.4,83.2" },
  { tag: "polygon", points: "683.5,40 674,40 674,34.9 646.6,53 646.8,53 664.3,83.1" },
  { tag: "polygon", points: "712,23 712,0 701.3,0 691.2,23" },
  { tag: "polygon", points: "654.5,105 677,105 664.3,83.1" },
  { tag: "polygon", points: "674,23 675.1,23 652.4,0 647,0 647,53.2 674,34.9" },
  { tag: "polygon", points: "686.1,23 680.7,0 652.4,0 675.1,23" },
  { tag: "polygon", points: "712,105 712,83 700.1,83 705.4,105" },
  { tag: "polygon", points: "708,63 708,40 690.1,40 695.6,63" },
  { tag: "polygon", points: "681.6,105 705.4,105 700.1,83 686.5,83" },
  { tag: "polygon", points: "691.2,23 701.3,0 680.7,0 686.1,23" },
  { tag: "path", d: "M770.6,77.4c-8,0-14.8-3.3-19.2-8.6l-2.6,31.8c6.4,2.9,13.4,4.6,20.8,4.7l17.5-33.8C783,75.2,777.2,77.4,770.6,77.4z" },
  { tag: "path", d: "M746,53.7l-26.2,12.4c4,15.3,14.8,27.9,29,34.4l2.6-31.8C748.2,64.7,746.2,59.6,746,53.7z" },
  { tag: "path", d: "M787.2,71.4l-17.5,33.8c0.3,0,0.6,0,0.9,0c14.6,0,27.7-6,37.2-15.5l-19.6-19.3C787.9,70.7,787.6,71,787.2,71.4z" },
  { tag: "path", d: "M770.6,28.1c7.1,0,13.3,2.5,17.6,6.9l0,0L777.7,0.7c-2.3-0.3-4.7-0.5-7.1-0.5c-4.8,0-9.4,0.6-13.7,1.8l-2.6,31.8C758.5,30.2,764.2,28.1,770.6,28.1z" },
  { tag: "path", d: "M807.6,15.5c-7.9-7.9-18.3-13.2-29.9-14.8l10.6,34.2L807.6,15.5z" },
  { tag: "path", d: "M746,52.7c0-7.4,2.8-13.8,7.5-18.2l-30.3-4.2c-3.2,6.8-5,14.4-5,22.4c0,4.6,0.6,9.1,1.7,13.4L746,53.7C746,53.3,746,53,746,52.7z" },
  { tag: "path", d: "M754.3,33.8l2.6-31.8c-14.9,4-27.2,14.5-33.7,28.3l30.3,4.2C753.7,34.3,754,34,754.3,33.8z" },
  { tag: "polygon", points: "845,40 845,39 818,39 818,66.2 848.9,40" },
  { tag: "polygon", points: "845,63 859.1,63 850.7,40 848.9,40 818,66.2 818,74.6 845,78.3" },
  { tag: "polygon", points: "845,83 845,78.3 818,74.6 818,105 839.2,105 847.7,83" },
  { tag: "polygon", points: "879,63 879,40 850.7,40 859.1,63" },
  { tag: "polygon", points: "839.2,105 865.9,105 880.8,83 847.7,83" },
  { tag: "polygon", points: "873.2,23 883,23 883,0 860.4,0 860.4,0" },
  { tag: "polygon", points: "883,105 883,83 880.8,83 865.9,105" },
  { tag: "polygon", points: "860.4,0.2 860.4,0.2 860.4,0.2" },
  { tag: "polygon", points: "845,23 873.2,23 860.6,0.2 818,32.2 818,39 845,39" },
  { tag: "polygon", points: "860.4,0 818,0 818,32.2 860.4,0" },
];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export default function LogoAnimation() {
  const svgRef      = useRef(null);
  const wrapperRef  = useRef(null);
  const tlRef       = useRef(null);
  const hintRef     = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const els = Array.from(svg.querySelectorAll("*"));

    // Scatter all shapes off-screen
    els.forEach((el) => {
      gsap.set(el, {
        x:        getRandom(-500, 500),
        y:        getRandom(-500, 500),
        rotation: getRandom(-720, 720),
        scale:    0,
        opacity:  0,
      });
    });

    // Build a paused timeline — we seek it manually on scroll
    const tl = gsap.timeline({ paused: true });
    tl.staggerTo(
      els,
      1,
      { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, ease: "power4.inOut" },
      0.015
    );
    tlRef.current = tl;

    // Drive progress from window scroll
    const SCROLL_RANGE = window.innerHeight * 2; // 200vh of scrolling = full animation
    const onScroll = () => {
      const progress = Math.min(window.scrollY / SCROLL_RANGE, 1);
      tl.progress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hint pulse
    if (hintRef.current) {
      gsap.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.4, yoyo: true, repeat: 3, ease: "power2.inOut" }
      );
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      tl.kill();
    };
  }, []);

  // Hover slow-motion
  const handleMouseEnter = () => {
    if (tlRef.current) tlRef.current.timeScale(0.15);
  };
  const handleMouseLeave = () => {
    if (tlRef.current) tlRef.current.timeScale(1);
  };

  return (
  
    <div ref={wrapperRef} style={{ height: "300vh", background: "#FED75A" }}>
      <div
        className="sticky top-0 w-screen h-screen flex items-center justify-center"
        style={{ background: "#FED75A" }}
      >
        {/* SVG */}
        <figure
          className="flex items-center justify-center w-full h-full m-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <svg
            ref={svgRef}
            x="0px"
            y="0px"
            viewBox="0 0 883 105.2"
            xmlSpace="preserve"
            overflow="visible"
            className="w-[90vw] p-[5vw]"
            style={{ fill: "#1C1C1C", stroke: "#1C1C1C", strokeWidth: "0.85px" }}
          >
            {SVG_PATHS.map((item, i) => {
              if (item.tag === "polygon") {
                return <polygon key={i} points={item.points} />;
              }
              return <path key={i} d={item.d} />;
            })}
          </svg>
        </figure>

        {/* Hover hint */}
        <p
          ref={hintRef}
          className="absolute bottom-[1vh] left-0 right-0 text-center pointer-events-none select-none"
          style={{
            color:         "#1C1C1C",
            fontFamily:    "Tahoma, sans-serif",
            fontSize:      "9px",
            fontWeight:    700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            opacity:       0,
          }}
        >
          Scroll to Animate · Hover to Slow Motion
        </p>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-[#1C1C1C]/50 font-mono text-[10px] uppercase tracking-widest">
            scroll
          </span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
              d="M8 0v16M2 10l6 8 6-8"
              stroke="#1C1C1C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>
    </div>
    )
        }

        
  
        