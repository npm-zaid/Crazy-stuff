import { useRef, useState, useEffect, useCallback } from "react";
import Sketch from "react-p5";

// ── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = [
  "#eb4e28",
  "#1e4b9d",
  "#f5dec0",
  "#dfa6e0",
  "#8fb6ae",
  "#8d98c6",
  "#19242d",
  "#111617",
];

// ── Default physics settings ──────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  elasticity: 0.8,
  bendingResistance: 0.1,
  repulsionStrength: 2.0,
  repulsionRadius: 60,
  damping: 0.85,
  gravity: 0.0,
  lineWidth: 60,
  restLength: 15,
  autoMode: true,
  initialVelocity: 15,
  autoSpawnThreshold: 75,
  autoSpawnInterval: 100,
};

// ── Slider config ─────────────────────────────────────────────────────────────
const SLIDERS = [
  { key: "elasticity",         label: "Elasticity",       min: 0.01, max: 2.0,   step: 0.01 },
  { key: "bendingResistance",  label: "Bend Resistance",  min: 0.0,  max: 1.0,   step: 0.01 },
  { key: "repulsionStrength",  label: "Repulsion Force",  min: 0.0,  max: 10.0,  step: 0.1  },
  { key: "repulsionRadius",    label: "Repulsion Radius", min: 10,   max: 150,   step: 1    },
  { key: "damping",            label: "Damping",          min: 0.5,  max: 0.99,  step: 0.01 },
  { key: "gravity",            label: "Gravity",          min: -2.0, max: 2.0,   step: 0.05 },
  { key: "lineWidth",          label: "Line Width",       min: 10,   max: 150,   step: 1    },
  { key: "initialVelocity",    label: "Initial Velocity", min: 0,    max: 50,    step: 1    },
  { key: "autoSpawnThreshold", label: "Spawn Clearance",  min: 50,   max: 400,   step: 1    },
  { key: "autoSpawnInterval",  label: "Spawn Interval",   min: 100,  max: 2000,  step: 10   },
];

// ── ElasticStrings component ──────────────────────────────────────────────────
export default function ElasticStrings() {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [guiOpen, setGuiOpen] = useState(false);
  const settingsRef = useRef({ ...DEFAULT_SETTINGS });

  // Keep ref in sync so p5 sketch always reads latest settings
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const setSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── p5 state (held in refs so sketch closure stays stable) ────────────────
  const stringsRef    = useRef([]);
  const draggingRef   = useRef(null);
  const lastSpawnRef  = useRef(0);
  const bgColorRef    = useRef(null);
  const lineColorsRef = useRef([]);
  const resetFlagRef  = useRef(false);

  // ── Helpers used inside sketch ────────────────────────────────────────────
  const buildColors = useCallback((p5) => {
    const p = [...PALETTE];
    const bgIdx = p5.floor(p5.random(p.length));
    bgColorRef.current = p5.color(p[bgIdx]);
    p.splice(bgIdx, 1);
    lineColorsRef.current = p.map((c) => p5.color(c));
  }, []);

  const spawnString = useCallback((p5, x, y) => {
    const s = settingsRef.current;
    const colors = lineColorsRef.current;
    const numPoints = 35;
    const points = [];

    const offsetAngle   = p5.random(p5.TWO_PI);
    const waveAmplitude = 25;
    const waveFrequency = 0.3;
    const tossAngle     = p5.random(p5.TWO_PI);
    const tossSpeed     = p5.random(0, s.initialVelocity);
    const initVx        = p5.cos(tossAngle) * tossSpeed;
    const initVy        = p5.sin(tossAngle) * tossSpeed;

    for (let i = 0; i < numPoints; i++) {
      const localX  = i * s.restLength * 0.1;
      const localY  = p5.sin(i * waveFrequency) * waveAmplitude;
      const globalX = x + localX * p5.cos(offsetAngle) - localY * p5.sin(offsetAngle);
      const globalY = y + localX * p5.sin(offsetAngle) + localY * p5.cos(offsetAngle);
      points.push({
        x: globalX, y: globalY,
        vx: initVx + p5.random(-2, 2),
        vy: initVy + p5.random(-2, 2),
      });
    }

    return {
      points,
      color: colors[p5.floor(p5.random(colors.length))],
    };
  }, []);

  const initStrings = useCallback((p5) => {
    buildColors(p5);
    stringsRef.current = [];
    for (let i = 0; i < 3; i++) {
      const rx = p5.random(100, p5.width  - 100);
      const ry = p5.random(100, p5.height - 100);
      stringsRef.current.push(spawnString(p5, rx, ry));
    }
  }, [buildColors, spawnString]);

  // Expose reset to parent via flag
  const triggerReset = useCallback(() => {
    resetFlagRef.current = true;
  }, []);

  // ── p5 callbacks ──────────────────────────────────────────────────────────
  const setup = useCallback((p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    initStrings(p5);
  }, [initStrings]);

  const draw = useCallback((p5) => {
    // Handle reset flag from UI
    if (resetFlagRef.current) {
      initStrings(p5);
      resetFlagRef.current = false;
    }

    const s = settingsRef.current;
    p5.background(bgColorRef.current);

    // Collect all points
    const allPoints = stringsRef.current.flatMap((str) => str.points);

    // 1. Inter-string repulsion
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        const p1 = allPoints[i];
        const p2 = allPoints[j];
        const dx  = p1.x - p2.x;
        const dy  = p1.y - p2.y;
        const dSq = dx * dx + dy * dy;
        const rSq = s.repulsionRadius * s.repulsionRadius;
        if (dSq > 0 && dSq < rSq) {
          const d     = p5.sqrt(dSq);
          const force = ((s.repulsionRadius - d) / s.repulsionRadius) * s.repulsionStrength;
          const fx    = (dx / d) * force;
          const fy    = (dy / d) * force;
          p1.vx += fx;  p1.vy += fy;
          p2.vx -= fx;  p2.vy -= fy;
        }
      }
    }

    // 2. Per-string update
    for (const str of stringsRef.current) {
      updateString(p5, str, s);
    }

    // 3. Dragging override
    if (p5.mouseIsPressed && draggingRef.current) {
      draggingRef.current.x  = p5.constrain(p5.mouseX, 0, p5.width);
      draggingRef.current.y  = p5.constrain(p5.mouseY, 0, p5.height);
      draggingRef.current.vx = 0;
      draggingRef.current.vy = 0;
    }

    // 4. Auto-spawn
    if (s.autoMode && p5.millis() - lastSpawnRef.current > s.autoSpawnInterval) {
      for (let tries = 0; tries < 10; tries++) {
        const rx = p5.random(100, p5.width  - 100);
        const ry = p5.random(100, p5.height - 100);
        const tooClose = allPoints.some(
          (pt) => p5.dist(rx, ry, pt.x, pt.y) < s.autoSpawnThreshold
        );
        if (!tooClose) {
          stringsRef.current.push(spawnString(p5, rx, ry));
          lastSpawnRef.current = p5.millis();
          break;
        }
      }
    }

    // 5. Draw
    for (const str of stringsRef.current) {
      drawString(p5, str, s);
    }
  }, [initStrings, spawnString]);

  const mousePressed = useCallback((p5) => {
    let closestDist = 40;
    let closestPt   = null;
    for (const str of stringsRef.current) {
      for (const pt of str.points) {
        const d = p5.dist(p5.mouseX, p5.mouseY, pt.x, pt.y);
        if (d < closestDist) { closestDist = d; closestPt = pt; }
      }
    }
    if (closestPt) {
      draggingRef.current = closestPt;
    } else {
      stringsRef.current.push(spawnString(p5, p5.mouseX, p5.mouseY));
    }
  }, [spawnString]);

  const mouseReleased = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const windowResized = useCallback((p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }, []);

  // ── Physics helpers (pure functions, no closure over p5 state) ───────────
  function updatePoint(p5, pt, s) {
    if (pt === draggingRef.current) return;
    pt.vy += s.gravity;
    pt.vx *= s.damping;
    pt.vy *= s.damping;

    const maxSpeed = 50;
    const speedSq  = pt.vx * pt.vx + pt.vy * pt.vy;
    if (speedSq > maxSpeed * maxSpeed) {
      const speed = p5.sqrt(speedSq);
      pt.vx = (pt.vx / speed) * maxSpeed;
      pt.vy = (pt.vy / speed) * maxSpeed;
    }

    pt.x += pt.vx;
    pt.y += pt.vy;

    // Wall repulsion
    const rr = s.repulsionRadius;
    const rs = s.repulsionStrength;

    const dxL = pt.x;
    if (dxL > 0 && dxL < rr)  { pt.vx += ((rr - dxL) / rr) * rs; }
    else if (pt.x < 0)         { pt.x = 0; if (pt.vx < 0) pt.vx *= -0.5; }

    const dxR = p5.width - pt.x;
    if (dxR > 0 && dxR < rr)  { pt.vx -= ((rr - dxR) / rr) * rs; }
    else if (pt.x > p5.width)  { pt.x = p5.width; if (pt.vx > 0) pt.vx *= -0.5; }

    const dyT = pt.y;
    if (dyT > 0 && dyT < rr)   { pt.vy += ((rr - dyT) / rr) * rs; }
    else if (pt.y < 0)          { pt.y = 0; if (pt.vy < 0) pt.vy *= -0.5; }

    const dyB = p5.height - pt.y;
    if (dyB > 0 && dyB < rr)   { pt.vy -= ((rr - dyB) / rr) * rs; }
    else if (pt.y > p5.height)  { pt.y = p5.height; if (pt.vy > 0) pt.vy *= -0.5; }
  }

  function updateString(p5, str, s) {
    const pts = str.points;

    // Structural springs
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i], p2 = pts[i + 1];
      const dx   = p2.x - p1.x, dy = p2.y - p1.y;
      const d    = p5.sqrt(dx * dx + dy * dy);
      if (d > 0) {
        const force = (d - s.restLength) * s.elasticity;
        const fx    = (dx / d) * force, fy = (dy / d) * force;
        p1.vx += fx; p1.vy += fy;
        p2.vx -= fx; p2.vy -= fy;
      }
    }

    // Bending springs
    for (let i = 0; i < pts.length - 2; i++) {
      const p1 = pts[i], p2 = pts[i + 2];
      const dx   = p2.x - p1.x, dy = p2.y - p1.y;
      const d    = p5.sqrt(dx * dx + dy * dy);
      const tgt  = s.restLength * 2;
      if (d > 0) {
        const force = (d - tgt) * s.bendingResistance;
        const fx    = (dx / d) * force, fy = (dy / d) * force;
        p1.vx += fx; p1.vy += fy;
        p2.vx -= fx; p2.vy -= fy;
      }
    }

    for (const pt of pts) updatePoint(p5, pt, s);
  }

  function drawString(p5, str, s) {
    const pts = str.points;
    p5.noFill();
    p5.stroke(str.color);
    p5.strokeWeight(s.lineWidth);
    p5.strokeJoin(p5.ROUND);
    p5.beginShape();
    if (pts.length > 0) p5.curveVertex(pts[0].x, pts[0].y);
    for (const pt of pts) p5.curveVertex(pt.x, pt.y);
    if (pts.length > 0) p5.curveVertex(pts[pts.length - 1].x, pts[pts.length - 1].y);
    p5.endShape();
  }

  // ── Keyboard shortcut for GUI toggle ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === " ") { e.preventDefault(); setGuiOpen((o) => !o); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#555]">
      {/* p5 canvas */}
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        windowResized={windowResized}
      />

      {/* Hint */}
      <p className="absolute top-5 left-5 text-white/60 text-sm pointer-events-none select-none">
        Click to spawn · Drag points · Space to toggle GUI
      </p>

      {/* GUI toggle button */}
      <button
        onClick={() => setGuiOpen((o) => !o)}
        className="absolute top-5 right-5 z-20 bg-black/40 hover:bg-black/60 text-white text-xs font-mono px-3 py-1.5 rounded backdrop-blur-sm border border-white/10 transition-colors"
      >
        {guiOpen ? "HIDE GUI" : "SHOW GUI"}
      </button>

      {/* GUI Panel */}
      <div
        className={`absolute top-14 right-5 z-20 w-64 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
          guiOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Panel header */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <span className="text-white/70 text-xs font-mono tracking-widest uppercase">Physics Settings</span>
        </div>

        <div className="px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Sliders */}
          {SLIDERS.map(({ key, label, min, max, step }) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-white/60 text-[11px] font-mono">{label}</label>
                <span className="text-white/80 text-[11px] font-mono tabular-nums">
                  {Number(settings[key]).toFixed(step < 1 ? 2 : 0)}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={settings[key]}
                onChange={(e) => setSetting(key, parseFloat(e.target.value))}
                className="w-full h-1 rounded-full appearance-none bg-white/20 accent-[#eb4e28] cursor-pointer"
              />
            </div>
          ))}

          {/* Auto Mode toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-white/60 text-[11px] font-mono">Auto Mode</span>
            <button
              onClick={() => setSetting("autoMode", !settings.autoMode)}
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                settings.autoMode ? "bg-[#eb4e28]" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                  settings.autoMode ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={triggerReset}
            className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white/80 text-xs font-mono py-2 rounded transition-colors border border-white/10"
          >
            RESET SCENE
          </button>
        </div>
      </div>
    </div>
  );
}