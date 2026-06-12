import { useEffect, useRef } from "react";

const DEFAULT_CONFIG = {
  text: "BUZZAR",
  fontSize: 120,
  fontFamily: 'sans-serif',
  particleSize: 1.5,
  particleDensity: 6,
  dispersionStrength: 15,
  returnSpeed: 0.08,
  color: "#ffffff",
  interactionRadius: 120,
};

class Particle {
  constructor(x, y, color, dispersion, returnSpd) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.ox = x;
    this.oy = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX, mouseY, interactionRadius) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const f = (interactionRadius - dist) / interactionRadius;
      this.vx -= (dx / dist) * f * this.dispersion;
      this.vy -= (dy / dist) * f * this.dispersion;
    }

    this.vx += (this.ox - this.x) * this.returnSpd;
    this.vy += (this.oy - this.y) * this.returnSpd;
    this.vx *= 0.85;
    this.vy *= 0.85;

    const d2o = Math.sqrt((this.x - this.ox) ** 2 + (this.y - this.oy) ** 2);
    if (d2o < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx, size) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorParticleTypography({
  text = DEFAULT_CONFIG.text,
  fontSize = DEFAULT_CONFIG.fontSize,
  fontFamily = DEFAULT_CONFIG.fontFamily,
  particleSize = DEFAULT_CONFIG.particleSize,
  particleDensity = DEFAULT_CONFIG.particleDensity,
  dispersionStrength = DEFAULT_CONFIG.dispersionStrength,
  returnSpeed = DEFAULT_CONFIG.returnSpeed,
  color = DEFAULT_CONFIG.color,
  interactionRadius = DEFAULT_CONFIG.interactionRadius,
  style = {},
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let W = 0, H = 0;
    let rafId;

    function resolveColor() {
      if (color) return color;
      return getComputedStyle(canvas).color || "#ffffff";
    }

    function init() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      const resolvedColor = resolveColor();
      ctx.clearRect(0, 0, W, H);

      const effectiveFontSize = Math.min(fontSize, W * 0.18);
      ctx.fillStyle = resolvedColor;
      ctx.font = `bold ${effectiveFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, W / 2, H / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];

      const step = Math.max(1, Math.floor(particleDensity * dpr));
      for (let y = 0; y < imageData.height; y += step) {
        for (let x = 0; x < imageData.width; x += step) {
          const idx = (y * imageData.width + x) * 4;
          if (imageData.data[idx + 3] > 128) {
            particles.push(
              new Particle(x / dpr, y / dpr, resolvedColor, dispersionStrength, returnSpeed)
            );
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.update(mouseX, mouseY, interactionRadius);
        p.draw(ctx, particleSize);
      }
      rafId = requestAnimationFrame(animate);
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    const onTouchEnd = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      init();
      animate();
    });
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => init());
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    text, fontSize, fontFamily, particleSize, particleDensity,
    dispersionStrength, returnSpeed, color, interactionRadius,
  ]);

  return (
    <div className='bg-zinc-900'>
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        minHeight: 400,
        cursor: "crosshair",
        touchAction: "none",
        ...style,
      }}
    />
    </div>
  );
}