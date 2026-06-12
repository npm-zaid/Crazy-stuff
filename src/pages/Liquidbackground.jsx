import { useEffect, useRef } from "react";

// LiquidBackground loads via CDN script tag — we dynamically inject it once
const LIQUID_CDN = "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js";
const LIQUID_IMAGE = "https://plus.unsplash.com/premium_photo-1725170497304-db3d4a48727a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function useLiquidBackground(canvasRef) {
  useEffect(() => {
    if (!canvasRef.current) return;

    // If already loaded, init immediately
    if (window.__LiquidBackground) {
      init(canvasRef.current);
      return;
    }

    // Otherwise inject the script once
    const existing = document.querySelector(`script[src="${LIQUID_CDN}"]`);
    if (existing) {
      existing.addEventListener("load", () => init(canvasRef.current));
      return;
    }

    const script = document.createElement("script");
    script.src = LIQUID_CDN;
    script.type = "module";
    script.onload = () => init(canvasRef.current);
    document.head.appendChild(script);

    return () => {
      // Nothing to clean up — Three.js renderer lives as long as the canvas does
    };
  }, [canvasRef]);
}

function init(canvas) {
  // The CDN module uses a default export; some bundlers expose it differently
  const LiquidBg =
    window.LiquidBackground ||
    window.__LiquidBackground ||
    window["default"];

  if (!LiquidBg) {
    // Retry once after a short delay in case the module is still resolving
    setTimeout(() => init(canvas), 200);
    return;
  }

  const app = LiquidBg(canvas);
  app.loadImage(LIQUID_IMAGE);
  app.liquidPlane.material.metalness = 0.75;
  app.liquidPlane.material.roughness = 0.25;
  app.liquidPlane.uniforms.displacementScale.value = 5;
  app.setRain(false);
}

export default function LiquidBackgroundScene() {
  const canvasRef = useRef(null);
  useLiquidBackground(canvasRef);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ touchAction: "none", fontFamily: "'Montserrat', serif" }}
    >
      {/* Liquid canvas — fixed, fills viewport */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* Attribution link */}
      <a
        href="https://www.framer.com/@kevin-levron/"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white no-underline text-sm z-10"
        style={{ textShadow: "1px 1px 2px black" }}
      >
        Framer Component
      </a>
    </div>
  );
}