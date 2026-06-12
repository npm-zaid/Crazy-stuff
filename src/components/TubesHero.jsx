
import React, { useEffect, useRef } from "react";
import TubesCursor from "threejs-components/build/cursors/tubes1.min.js";

export default function TubesHero() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  // Helper function to generate random hex colors
  const randomColors = (count) => {
    return new Array(count)
      .fill(0)
      .map(
        () =>
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
      );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize TubesCursor with options
    const app = TubesCursor(canvas, {
      tubes: {
        colors: ["#f967fb", "#53bc28", "#6958d5"],
        lights: {
          intensity: 200,
          colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
        },
      },
    });

    appRef.current = app;

    // Click handler to randomize colors
    const handleClick = () => {
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      console.log(colors, lightsColors);
      if (app?.tubes) {
        app.tubes.setColors(colors);
        app.tubes.setLightsColors(lightsColors);
      }
    };

    document.body.addEventListener("click", handleClick);

    // Resize handler (optional)
    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      document.body.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      try {
        if (app && typeof app.destroy === "function") app.destroy();
      } catch (e) {
        console.warn("Error cleaning up TubesCursor:", e);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen font-[Montserrat]">
      {/* Fullscreen canvas */}
      <canvas
        ref={canvasRef}
        id="canvas"
        className="fixed inset-0 w-full h-full block"
      />

      {/* Hero Content */}
      <div className="relative flex flex-col items-center justify-center h-full gap-2 text-white text-center pointer-events-none">
        <h1 className="text-[80px] md:text-[100px] font-bold uppercase drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-none">
          Tubes
        </h1>
        <h2 className="text-[60px] md:text-[72px] font-medium uppercase drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-none">
          Cursor
        </h2>
        <p className="text-lg drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
          WebGPU / WebGL
        </p>
      </div>
    </div>
  );
}
