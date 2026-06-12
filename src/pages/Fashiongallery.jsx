import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(Draggable, InertiaPlugin, Flip, CustomEase);

// ─── Constants ────────────────────────────────────────────────────────────────

const FASHION_IMAGES = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `https://assets.codepen.io/7558/orange-portrait_${n}.jpg`;
});

const IMAGE_DATA = [
  { number: "01", title: "Begin Before You're Ready", description: "The work starts when you notice the quiet pull. Breathe once, clear the room inside you, and move one pixel forward." },
  { number: "02", title: "Negative Space, Positive Signal", description: "Leave room around the idea. In the silence, the design answers back and shows you what to remove." },
  { number: "03", title: "Friction Is a Teacher", description: "When the line resists, listen. Constraints are coordinates—plot them, then chart a cleaner route." },
  { number: "04", title: "Golden Minute", description: "Catch the light while it's honest. One honest frame beats a hundred almosts." },
  { number: "05", title: "Shadow Carries Form", description: "The dark reveals the edge. Let contrast articulate what you mean but can't yet say." },
  { number: "06", title: "City Breath", description: "Steel, glass, heartbeat. Edit until the street's rhythm fits inside a single grid." },
  { number: "07", title: "Soft Focus, Sharp Intent", description: "Blur the noise, not the purpose. What matters remains in crisp relief." },
  { number: "08", title: "Time-Tested, Future-Ready", description: "Classics survive because they serve. Keep the spine, tune the surface, respect the lineage." },
  { number: "09", title: "Grace Under Revision", description: "Drafts don't apologize. They evolve. Let elegance emerge through cuts, not flourishes." },
  { number: "10", title: "Style That Outlasts Seasons", description: "Trends talk. Principles walk. Build on principles and let trends accessorize." },
  { number: "11", title: "Edges and Experiments", description: "Push just past comfort. Leave a fingerprint the algorithm can't fake." },
  { number: "12", title: "Portrait of Attention", description: "Form is what you see. Presence is what you feel. Aim for presence." },
  { number: "13", title: "Light Speaks First", description: "Expose for truth. Shadows are sentences, highlights the punctuation." },
  { number: "14", title: "Contemporary Is a Moving Target", description: "Design for now by listening deeper than now. The signal is older than the feed." },
  { number: "15", title: "Vision, Then Precision", description: "Dream wide, ship tight. Let imagination roam and execution walk in single-point focus." },
  { number: "16", title: "Geometry of Poise", description: "Angles carry attitude. Align posture, light, and line until the frame breathes." },
  { number: "17", title: "Natural Light, Natural Truth", description: "Open the window and remove the mask. Authenticity needs less wattage, more honesty." },
  { number: "18", title: "Studio: The Controlled Wild", description: "Dial every knob, then listen for the unscripted moment. Keep the lens ready." },
  { number: "19", title: "Invent the Angle", description: "Rotate the problem ninety degrees. Fresh perspective isn't luck—it's a habit." },
  { number: "20", title: "Editorial Nerve", description: "Carry yourself like you belong, then earn it with craft. The camera can tell." },
  { number: "21", title: "Profession Is Practice", description: "Repeat the fundamentals until they disappear. Mastery is subtle on purpose." },
  { number: "22", title: "Final Frame, Open Door", description: "Endings are launchpads. Archive the take, thank the light, and start again at one." },
];

const CONFIG = { itemSize: 320, rows: 8, cols: 12, currentZoom: 0.6 };

// ─── Preloader ─────────────────────────────────────────────────────────────────

function Preloader({ onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = 150, cy = 150;
    let lastTime = 0, time = 0;
    const rings = [
      { radius: 20, count: 8 }, { radius: 35, count: 12 },
      { radius: 50, count: 16 }, { radius: 65, count: 20 }, { radius: 80, count: 24 },
    ];
    const hexRgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const primary = hexRgb("#2C1B14"), accent = hexRgb("#A64B23");

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const delta = ts - (lastTime || ts); lastTime = ts;
      time += delta * 0.001;
      ctx.clearRect(0, 0, 300, 300);
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${primary},0.9)`; ctx.fill();
      rings.forEach((ring, ri) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;
          const pulse = Math.sin(time*2 - ri*0.4) * 3;
          const x = cx + Math.cos(angle) * (ring.radius + pulse);
          const y = cy + Math.sin(angle) * (ring.radius + pulse);
          const wave = 0.4 + Math.sin(time*2 - ri*0.4 + i*0.2) * 0.6;
          const isActive = Math.sin(time*2 - ri*0.4 + i*0.2) > 0.6;
          const rgb = isActive ? accent : primary;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(${rgb},${wave * (isActive ? 0.7 : 0.5)})`; ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${rgb},${wave})`; ctx.fill();
        }
      });
      if (ts - startRef.current < 2000) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100000]">
      <canvas ref={canvasRef} width={300} height={300} />
    </div>
  );
}

// ─── Sound Wave Canvas ─────────────────────────────────────────────────────────

function SoundWave({ enabled }) {
  const canvasRef = useRef(null);
  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 32, H = 16, cy = Math.floor(H / 2);
    const start = Date.now();
    let amp = 0, raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const hexRgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const mixColor = (c1, c2, f) => {
      const [r1,g1,b1] = hexRgb(c1), [r2,g2,b2] = hexRgb(c2);
      return `rgb(${Math.round(r1+f*(r2-r1))},${Math.round(g1+f*(g2-g1))},${Math.round(b1+f*(b2-b1))})`;
    };
    const draw = () => {
      amp = lerp(amp, enabledRef.current ? 1 : 0, 0.08);
      ctx.clearRect(0,0,W,H);
      const t = (Date.now() - start) / 1000;
      const mute = 1 - amp;
      if (!enabledRef.current && amp < 0.01) {
        ctx.fillStyle = "#D9C4AA"; ctx.fillRect(0, cy, W, 2);
      } else {
        ctx.fillStyle = mixColor("#2C1B14", "#D9C4AA", mute);
        for (let i = 0; i < W; i++) {
          const x = i - W/2, e = Math.exp(-x*x/50);
          const y = cy + Math.cos(x*0.4 - t*8) * e * H * 0.35 * amp;
          ctx.fillRect(i, Math.round(y), 1, 2);
        }
        ctx.fillStyle = mixColor("#A64B23", "#D9C4AA", mute);
        for (let i = 0; i < W; i++) {
          const x = i - W/2, e = Math.exp(-x*x/80);
          const y = cy + Math.cos(x*0.3 - t*5) * e * H * 0.25 * amp;
          ctx.fillRect(i, Math.round(y), 1, 2);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={32} height={16} className="w-8 h-4 border-0 bg-transparent outline-none" />;
}

// ─── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="mb-6 block w-12 h-6 relative cursor-pointer group">
      <div className="relative w-full h-full">
        <div className="absolute rounded-full w-[1.4rem] h-[1.4rem] bg-white top-1/2 left-0 -translate-y-1/2 transition-transform duration-300 group-hover:-translate-x-2" />
        <div className="absolute rounded-full w-[1.4rem] h-[1.4rem] bg-white top-1/2 left-[0.8rem] -translate-y-1/2 [mix-blend-mode:exclusion] transition-transform duration-300 group-hover:translate-x-2" />
      </div>
    </div>
  );
}

// ─── Main Gallery ──────────────────────────────────────────────────────────────

export default function FashionGallery() {
  const [loaded, setLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [zoom, setZoomState] = useState(0.6);
  const [percentage, setPercentage] = useState(60);
  const [activeZoomBtn, setActiveZoomBtn] = useState("NORMAL");

  // DOM refs
  const viewportRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const gridContainerRef = useRef(null);
  const splitScreenRef = useRef(null);
  const imageTitleOverlayRef = useRef(null);
  const closeButtonRef = useRef(null);
  const controlsRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  // Mutable state refs (avoid re-renders)
  const stateRef = useRef({
    config: { ...CONFIG, currentGap: 32 },
    gridItems: [],
    gridDimensions: {},
    lastValidPosition: { x: 0, y: 0 },
    draggable: null,
    viewportObserver: null,
    zoomState: { isActive: false, selectedItem: null, flipAnimation: null, scalingOverlay: null },
    descriptionLines: [],
    customEase: null,
    centerEase: null,
    sounds: {},
    soundEnabled: false,
  });

  const playSound = useCallback((name) => {
    const s = stateRef.current;
    if (!s.soundEnabled || !s.sounds[name]) return;
    try { const a = s.sounds[name]; a.currentTime = 0; a.play().catch(()=>{}); } catch(e) {}
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const calcGapForZoom = (z) => z >= 1.0 ? 16 : z >= 0.6 ? 32 : 64;

  const calcGridDimensions = useCallback((gap) => {
    const s = stateRef.current;
    const { cols, rows, itemSize, currentZoom } = s.config;
    const w = cols * (itemSize + gap) - gap;
    const h = rows * (itemSize + gap) - gap;
    s.gridDimensions = { width: w, height: h, scaledWidth: w * currentZoom, scaledHeight: h * currentZoom, gap };
    return s.gridDimensions;
  }, []);

  const calcBounds = useCallback(() => {
    const s = stateRef.current;
    const vw = window.innerWidth, vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = s.gridDimensions;
    const mx = s.config.currentGap * s.config.currentZoom;
    const my = s.config.currentGap * s.config.currentZoom;
    return {
      minX: scaledWidth <= vw ? (vw - scaledWidth) / 2 : vw - scaledWidth - mx,
      maxX: scaledWidth <= vw ? (vw - scaledWidth) / 2 : mx,
      minY: scaledHeight <= vh ? (vh - scaledHeight) / 2 : vh - scaledHeight - my,
      maxY: scaledHeight <= vh ? (vh - scaledHeight) / 2 : my,
    };
  }, []);

  const initDraggable = useCallback(() => {
    const s = stateRef.current;
    if (s.draggable) { s.draggable.kill(); s.draggable = null; }
    calcGridDimensions(s.config.currentGap);
    const bounds = calcBounds();
    s.draggable = Draggable.create(canvasWrapperRef.current, {
      type: "x,y", bounds, edgeResistance: 0.8, inertia: true,
      onDragStart() {
        document.body.style.cursor = "grabbing";
        playSound("drag-start");
        s.lastValidPosition.x = this.x; s.lastValidPosition.y = this.y;
      },
      onDrag() { s.lastValidPosition.x = this.x; s.lastValidPosition.y = this.y; },
      onDragEnd() { document.body.style.cursor = "grab"; playSound("drag-end"); },
    })[0];
  }, [calcBounds, calcGridDimensions, playSound]);

  // ── Split text helper ────────────────────────────────────────────────────────

  const splitTextIntoLines = (el, text) => {
    el.innerHTML = "";
    const words = text.split(" ");
    const lines = []; let cur = "";
    const tmp = document.createElement("div");
    Object.assign(tmp.style, { position:"absolute", visibility:"hidden", width:`${el.offsetWidth}px`, fontFamily:"PPNeueMontreal,sans-serif", fontSize:"16px", fontWeight:"300" });
    document.body.appendChild(tmp);
    words.forEach(w => {
      const test = cur ? `${cur} ${w}` : w;
      tmp.textContent = test;
      if (tmp.offsetWidth > el.offsetWidth && cur) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    document.body.removeChild(tmp);
    lines.forEach(lt => {
      const span = document.createElement("span");
      span.className = "description-line";
      Object.assign(span.style, { display:"block", color:"rgba(255,255,255,0.8)", fontFamily:"PPNeueMontreal,sans-serif", fontSize:"16px", fontWeight:"300", lineHeight:"1.4", transform:"translateY(0)", position:"relative", overflow:"hidden" });
      span.textContent = lt;
      el.appendChild(span);
    });
    return el.querySelectorAll(".description-line");
  };

  // ── Zoom mode ────────────────────────────────────────────────────────────────

  const exitZoomMode = useCallback(() => {
    const s = stateRef.current;
    if (!s.zoomState.isActive || !s.zoomState.selectedItem || !s.zoomState.scalingOverlay) return;
    playSound("close");
    document.removeEventListener("keydown", s._handleZoomKeys);
    const overlay = imageTitleOverlayRef.current;
    gsap.to(overlay, { opacity:0, duration:0.3 });
    gsap.to("#imageSlideNumber span", { y:-20, opacity:0, duration:0.4 });
    gsap.to("#imageSlideTitle h1", { y:-60, opacity:0, duration:0.4 });
    if (s.descriptionLines.length) {
      gsap.to(s.descriptionLines, { y:-80, opacity:0, duration:0.4, stagger:-0.05,
        onComplete: () => { overlay.classList.remove("active"); gsap.set(s.descriptionLines, { y:80, opacity:0 }); }
      });
    }
    gsap.to(closeButtonRef.current, { x:40, opacity:0, duration:0.3 });
    splitScreenRef.current?.classList.remove("active");
    controlsRef.current?.classList.remove("split-mode");
    gsap.to(splitScreenRef.current, { opacity:0, duration:0.8 });
    if (s.zoomState.flipAnimation) { s.zoomState.flipAnimation.kill(); s.zoomState.flipAnimation = null; }
    const sel = s.zoomState.selectedItem;
    Flip.fit(s.zoomState.scalingOverlay, sel.element, {
      duration:1.2, ease: s.customEase, absolute:true,
      onComplete: () => {
        gsap.set(sel.img, { opacity:1 });
        if (s.zoomState.scalingOverlay) { document.body.removeChild(s.zoomState.scalingOverlay); s.zoomState.scalingOverlay = null; }
        splitScreenRef.current?.classList.remove("active");
        document.body.style.cursor = "grab";
        closeButtonRef.current?.classList.remove("active");
        if (s.draggable) s.draggable.enable();
        s.zoomState.isActive = false; s.zoomState.selectedItem = null;
      }
    });
    if (s.zoomState.scalingOverlay) gsap.to(s.zoomState.scalingOverlay, { opacity:0.4, duration:0.8 });
  }, [playSound]);

  const enterZoomMode = useCallback((itemData) => {
    const s = stateRef.current;
    if (s.zoomState.isActive) return;
    s.zoomState.isActive = true; s.zoomState.selectedItem = itemData;
    playSound("open");
    if (s.draggable) s.draggable.disable();
    document.body.style.cursor = "default";
    const split = splitScreenRef.current;
    split.classList.add("active");
    gsap.to(split, { opacity:1, duration:1.2, ease: s.customEase });
    // Create scaling overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;z-index:3;pointer-events:none;will-change:transform;";
    const img = document.createElement("img");
    img.src = itemData.img.src; img.alt = itemData.img.alt;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
    overlay.appendChild(img); document.body.appendChild(overlay);
    const rect = itemData.img.getBoundingClientRect();
    gsap.set(overlay, { left:rect.left, top:rect.top, width:rect.width, height:rect.height });
    gsap.set(itemData.img, { opacity:0 });
    s.zoomState.scalingOverlay = overlay;
    const zoomTarget = document.getElementById("zoomTarget");
    s.zoomState.flipAnimation = Flip.fit(overlay, zoomTarget, {
      duration:1.2, ease: s.customEase, absolute:true,
      onComplete: () => {
        // Update title overlay
        const data = IMAGE_DATA[itemData.index % IMAGE_DATA.length];
        document.querySelector("#imageSlideNumber span").textContent = data.number;
        document.querySelector("#imageSlideTitle h1").textContent = data.title;
        const descEl = document.getElementById("imageSlideDescription");
        s.descriptionLines = Array.from(splitTextIntoLines(descEl, data.description));
        const titleOverlay = imageTitleOverlayRef.current;
        gsap.set("#imageSlideNumber span", { y:20, opacity:0 });
        gsap.set("#imageSlideTitle h1", { y:60, opacity:0 });
        gsap.set(s.descriptionLines, { y:80, opacity:0 });
        titleOverlay.classList.add("active");
        gsap.to(titleOverlay, { opacity:1, duration:0.3 });
        gsap.to("#imageSlideNumber span", { y:0, opacity:1, duration:0.8, ease: s.customEase, delay:0.1 });
        gsap.to("#imageSlideTitle h1", { y:0, opacity:1, duration:0.8, ease: s.customEase, delay:0.15 });
        gsap.to(s.descriptionLines, { y:0, opacity:1, duration:0.8, ease: s.customEase, delay:0.2, stagger:0.15 });
      }
    });
    controlsRef.current?.classList.add("split-mode");
    gsap.fromTo(closeButtonRef.current, { x:40, opacity:0 }, { x:0, opacity:1, duration:0.6, ease:"power2.out", delay:0.9 });
    closeButtonRef.current?.classList.add("active");
    const handleZoomKeys = (e) => { if (e.key === "Escape") exitZoomMode(); };
    s._handleZoomKeys = handleZoomKeys;
    document.addEventListener("keydown", handleZoomKeys);
  }, [exitZoomMode, playSound]);

  // ── Generate grid ────────────────────────────────────────────────────────────

  const generateGridItems = useCallback(() => {
    const s = stateRef.current;
    const { cols, rows, itemSize, currentZoom } = s.config;
    s.config.currentGap = calcGapForZoom(currentZoom);
    calcGridDimensions(s.config.currentGap);
    const cw = canvasWrapperRef.current, gc = gridContainerRef.current;
    if (!cw || !gc) return;
    cw.style.width = s.gridDimensions.width + "px";
    cw.style.height = s.gridDimensions.height + "px";
    gc.innerHTML = ""; s.gridItems = [];
    let imgIdx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const el = document.createElement("div");
        const x = col * (itemSize + s.config.currentGap);
        const y = row * (itemSize + s.config.currentGap);
        Object.assign(el.style, { position:"absolute", width:"320px", height:"320px", background:"#000", cursor:"pointer", left:`${x}px`, top:`${y}px`, opacity:"0", zIndex:"1", transition:"opacity 0.6s ease" });
        const img = document.createElement("img");
        const imageUrl = FASHION_IMAGES[imgIdx % FASHION_IMAGES.length]; imgIdx++;
        img.src = imageUrl; img.alt = `Fashion Portrait ${imgIdx}`;
        Object.assign(img.style, { width:"100%", height:"100%", objectFit:"cover", display:"block", userSelect:"none", pointerEvents:"none" });
        el.appendChild(img);
        const itemData = { element: el, img, row, col, baseX: x, baseY: y, imageUrl, index: s.gridItems.length };
        el.addEventListener("click", () => { if (!s.zoomState.isActive) { playSound("click"); enterZoomMode(itemData); } });
        gc.appendChild(el);
        s.gridItems.push(itemData);
      }
    }
  }, [calcGridDimensions, enterZoomMode, playSound]);

  // ── Intro animation ───────────────────────────────────────────────────────────

  const playIntroAnimation = useCallback(() => {
    const s = stateRef.current;
    const vw = window.innerWidth, vh = window.innerHeight;
    const cw = canvasWrapperRef.current;
    const style = getComputedStyle(cw);
    const mat = new DOMMatrix(style.transform);
    const cx = (vw/2 - mat.m41) / mat.a - s.config.itemSize/2;
    const cy = (vh/2 - mat.m42) / mat.a - s.config.itemSize/2;
    s.gridItems.forEach((d, i) => {
      gsap.set(d.element, { left:cx, top:cy, scale:0.8, zIndex: s.gridItems.length - i, opacity:0 });
    });
    gsap.to(s.gridItems.map(d => d.element), {
      duration:0.2, left: i => s.gridItems[i].baseX, top: i => s.gridItems[i].baseY,
      scale:1, opacity:1, ease:"power2.out",
      stagger: { amount:1.5, from:"start", grid:[s.config.rows, s.config.cols] },
      onComplete: () => {
        s.gridItems.forEach(d => gsap.set(d.element, { zIndex:1 }));
        const ctrl = controlsRef.current;
        if (!ctrl) return;
        const pi = ctrl.querySelector(".percentage-indicator");
        const sw = ctrl.querySelector(".switch");
        const st = ctrl.querySelector(".sound-toggle");
        gsap.set(ctrl, { opacity:0 });
        gsap.set(pi, { x:"-3em" }); gsap.set(sw, { y:"2em" }); gsap.set(st, { x:"3em" });
        const tl = gsap.timeline();
        tl.to(ctrl, { opacity:1, duration:0.5 }, 0)
          .to(pi, { x:0, duration:0.2 }, 0.25)
          .to(sw, { y:0, duration:0.2 }, 0.3)
          .to(st, { x:0, duration:0.2 }, 0.35);
        ctrl.classList.add("visible");
      }
    });
  }, []);

  // ── Set zoom ─────────────────────────────────────────────────────────────────

  const applyZoom = useCallback((zoomLevel, label) => {
    const s = stateRef.current;
    if (s.zoomState.isActive) { exitZoomMode(); return; }
    const newGap = calcGapForZoom(zoomLevel);
    const oldZoom = s.config.currentZoom;
    s.config.currentZoom = zoomLevel;
    playSound(zoomLevel < oldZoom ? "zoom-out" : "zoom-in");
    calcGridDimensions(s.config.currentGap);
    const vw = window.innerWidth, vh = window.innerHeight;
    const { width: gw, height: gh } = s.gridDimensions;
    const curSW = gw * oldZoom, curSH = gh * oldZoom;
    const step1X = (vw - curSW) / 2, step1Y = (vh - curSH) / 2;
    gsap.to(canvasWrapperRef.current, {
      duration:0.6, x:step1X, y:step1Y, ease: s.centerEase,
      onComplete: () => {
        if (newGap !== s.config.currentGap) {
          s.gridItems.forEach(d => {
            const nx = d.col * (s.config.itemSize + newGap);
            const ny = d.row * (s.config.itemSize + newGap);
            d.baseX = nx; d.baseY = ny;
            gsap.to(d.element, { duration:1.2, left:nx, top:ny, ease: s.customEase });
          });
          const nw = s.config.cols * (s.config.itemSize + newGap) - newGap;
          const nh = s.config.rows * (s.config.itemSize + newGap) - newGap;
          gsap.to(canvasWrapperRef.current, { duration:1.2, width:nw, height:nh, ease: s.customEase });
          s.config.currentGap = newGap;
        }
        calcGridDimensions(newGap);
        const { width: fw, height: fh } = s.gridDimensions;
        const fsw = fw * zoomLevel, fsh = fh * zoomLevel;
        const fcx = (vw - fsw) / 2, fcy = (vh - fsh) / 2;
        gsap.to(canvasWrapperRef.current, {
          duration:1.2, scale:zoomLevel, x:fcx, y:fcy, ease: s.customEase,
          onComplete: () => { s.lastValidPosition = {x:fcx, y:fcy}; initDraggable(); }
        });
      }
    });
    setPercentage(Math.round(zoomLevel * 100));
    setActiveZoomBtn(label);
    setZoomState(zoomLevel);
  }, [calcGridDimensions, exitZoomMode, initDraggable, playSound]);

  const autoFitZoom = useCallback(() => {
    const vw = window.innerWidth, vh = window.innerHeight - 80;
    const gap = calcGapForZoom(1.0);
    const s = stateRef.current;
    const gw = s.config.cols * (s.config.itemSize + gap) - gap;
    const gh = s.config.rows * (s.config.itemSize + gap) - gap;
    const fit = Math.max(0.1, Math.min(2.0, Math.min((vw-80)/gw, (vh-80)/gh)));
    applyZoom(fit, "FIT");
  }, [applyZoom]);

  const resetPosition = useCallback(() => {
    const s = stateRef.current;
    if (s.zoomState.isActive) { exitZoomMode(); return; }
    calcGridDimensions(s.config.currentGap);
    const vw = window.innerWidth, vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = s.gridDimensions;
    const cx = (vw - scaledWidth) / 2, cy = (vh - scaledHeight) / 2;
    gsap.to(canvasWrapperRef.current, { duration:1.0, x:cx, y:cy, ease: s.centerEase,
      onComplete: () => { s.lastValidPosition = {x:cx, y:cy}; initDraggable(); }
    });
  }, [calcGridDimensions, exitZoomMode, initDraggable]);

  // ── Init ──────────────────────────────────────────────────────────────────────

  const initGallery = useCallback(() => {
    const s = stateRef.current;
    s.customEase = CustomEase.create("smooth", ".87,0,.13,1");
    s.centerEase = CustomEase.create("center", ".25,.46,.45,.94");
    // Init sounds
    const soundDefs = {
      click: "https://assets.codepen.io/7558/glitch-fx-001.mp3",
      open: "https://assets.codepen.io/7558/click-glitch-001.mp3",
      close: "https://assets.codepen.io/7558/click-glitch-001.mp3",
      "zoom-in": "https://assets.codepen.io/7558/whoosh-fx-001.mp3",
      "zoom-out": "https://assets.codepen.io/7558/whoosh-fx-001.mp3",
      "drag-start": "https://assets.codepen.io/7558/preloader-2s-001.mp3",
      "drag-end": "https://assets.codepen.io/7558/preloader-2s-001.mp3",
    };
    Object.entries(soundDefs).forEach(([k,v]) => {
      const a = new Audio(v); a.preload = "auto"; a.volume = 0.3; s.sounds[k] = a;
    });
    s.config.currentGap = calcGapForZoom(s.config.currentZoom);
    generateGridItems();
    gsap.set(viewportRef.current, { opacity:0 });
    gsap.set(canvasWrapperRef.current, { scale: s.config.currentZoom });
    calcGridDimensions(s.config.currentGap);
    const vw = window.innerWidth, vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = s.gridDimensions;
    const cx = (vw - scaledWidth) / 2, cy = (vh - scaledHeight) / 2;
    gsap.set(canvasWrapperRef.current, { x:cx, y:cy });
    s.lastValidPosition = {x:cx, y:cy};
    gsap.to(viewportRef.current, { duration:0.6, opacity:1, ease:"power2.inOut",
      onComplete: () => {
        playIntroAnimation();
        gsap.to(headerRef.current, { duration:1.2, opacity:1, ease:"power2.out", delay:0.8 });
        gsap.to(footerRef.current, { duration:1.4, opacity:1, ease:"power2.out", delay:1.0 });
        setTimeout(() => { initDraggable(); }, 1500);
      }
    });
    // Keyboard shortcuts
    const onKey = (e) => {
      if (s.zoomState.isActive) return;
      if (e.key === "1") applyZoom(0.3, "ZOOM OUT");
      else if (e.key === "2") applyZoom(0.6, "NORMAL");
      else if (e.key === "3") applyZoom(1.0, "ZOOM IN");
      else if (e.key === "f" || e.key === "F") autoFitZoom();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", () => setTimeout(() => { resetPosition(); initDraggable(); }, 100));
    return () => document.removeEventListener("keydown", onKey);
  }, [applyZoom, autoFitZoom, calcGridDimensions, generateGridItems, initDraggable, playIntroAnimation, resetPosition]);

  useEffect(() => {
    if (loaded) {
      const cleanup = initGallery();
      return cleanup;
    }
  }, [loaded, initGallery]);

  const handlePreloaderDone = useCallback(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const toggleSound = () => {
    const s = stateRef.current;
    s.soundEnabled = !s.soundEnabled;
    setSoundEnabled(s.soundEnabled);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-black h-screen overflow-hidden" style={{ cursor:"grab", fontFamily:"PPNeueMontreal,sans-serif" }}>
      <style>{`
        @import url("https://fonts.cdnfonts.com/css/thegoodmonolith");
        @font-face { font-family:"PPNeueMontreal"; src:url("https://assets.codepen.io/7558/PPNeueMontreal-Variable.woff2") format("woff2"); font-weight:100 900; }
        * { user-select:none; box-sizing:border-box; }
        .nav-link { position:relative; color:#fff; text-decoration:none; font-size:14px; font-weight:700; display:inline-block; transition:color .3s ease; }
        .nav-link::after { content:""; position:absolute; top:0; left:0; width:0; height:100%; background:#fff; z-index:-1; transition:width .3s cubic-bezier(.34,1.56,.64,1); }
        .nav-link:hover::after { width:100%; }
        .nav-link:hover { color:#000; mix-blend-mode:difference; }
        .switch-mode { left:50% !important; }
        .controls-split { left:75% !important; }
        .close-btn-active { pointer-events:all !important; }
        .split-active { opacity:1 !important; pointer-events:all !important; }
        .title-active { opacity:1 !important; }
      `}</style>

      {/* Preloader */}
      {!loaded && <Preloader onComplete={handlePreloaderDone} />}

      {/* Header */}
      <div ref={headerRef} className="fixed top-0 left-0 w-screen px-6 py-6 z-[10000] grid grid-cols-12 gap-4 opacity-0 pointer-events-none">
        <div className="[grid-column:1/span_3] pointer-events-auto">
          <Logo />
        </div>
        <div className="[grid-column:5/span_2] pointer-events-auto">
          <h3 className="text-sm font-semibold text-white mb-4">+Menu</h3>
          <ul className="space-y-1 list-none">
            {["Work","About","Services","Contact"].map(l => <li key={l}><a href="#" className="nav-link">{l}</a></li>)}
          </ul>
        </div>
        <div className="[grid-column:7/span_2] pointer-events-auto">
          <h3 className="text-sm font-semibold text-white mb-4">+Studio</h3>
          <p className="text-sm font-semibold text-white">Los Angeles</p>
          <p className="text-sm font-semibold text-white">California</p>
        </div>
        <div className="[grid-column:9/span_2] pointer-events-auto">
          <h3 className="text-sm font-semibold text-white mb-4">+Connect</h3>
          <a href="mailto:hi@filip.fyi" className="nav-link">hi@filip.fyi</a>
        </div>
        <div className="[grid-column:11/span_2] text-right pointer-events-auto">
          <h3 className="text-sm font-semibold text-white mb-4">+Follow</h3>
          <ul className="space-y-1 list-none">
            {[["Instagram","https://instagram.com/filipz__"],["Twitter","https://x.com/filipz"],["LinkedIn","https://linkedin.com/in/filipzrnzevic"]].map(([l,h]) => <li key={l}><a href={h} className="nav-link">{l}</a></li>)}
          </ul>
        </div>
      </div>

      {/* Main Viewport */}
      <div ref={viewportRef} id="viewport" className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-[1] opacity-0">
        <div ref={canvasWrapperRef} id="canvasWrapper" className="absolute top-0 left-0" style={{ transformOrigin:"0 0", willChange:"transform", isolation:"isolate" }}>
          <div ref={gridContainerRef} id="gridContainer" className="relative w-full h-full" />
        </div>
      </div>

      {/* Split Screen */}
      <div ref={splitScreenRef} id="splitScreenContainer" className="fixed top-0 left-0 w-screen h-screen flex z-[2] opacity-0 pointer-events-none">
        <div id="splitLeft" className="relative w-1/2 h-full flex justify-center items-center cursor-pointer z-[1]" style={{ background:"rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) exitZoomMode(); }}>
          <div id="zoomTarget" className="w-full h-full relative flex items-center justify-center z-[1]" />
        </div>
        <div id="splitRight" className="relative w-1/2 h-full flex justify-center items-center cursor-pointer z-[1]" style={{ background:"rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) exitZoomMode(); }} />
      </div>

      {/* Image Title Overlay */}
      <div ref={imageTitleOverlayRef} id="imageTitleOverlay" className="fixed bottom-10 left-10 text-white z-[4] opacity-0 pointer-events-none">
        <div id="imageSlideNumber" className="relative w-[400px] h-5 mb-2 overflow-hidden" style={{ clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)" }}>
          <span className="absolute top-0 left-0 text-white text-xs uppercase tracking-[0.1em]" style={{ fontFamily:"TheGoodMonolith,monospace" }}>01</span>
        </div>
        <div id="imageSlideTitle" className="relative w-[400px] h-[60px] mb-4 overflow-hidden" style={{ clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)" }}>
          <h1 className="absolute top-0 left-0 text-white text-[48px] font-medium leading-tight m-0 p-0" style={{ letterSpacing:"-0.02em" }}>Fashion Portrait</h1>
        </div>
        <div id="imageSlideDescription" className="relative w-[400px] min-h-[80px] overflow-hidden" style={{ clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)" }} />
      </div>

      {/* Close Button */}
      <button ref={closeButtonRef} id="closeButton" onClick={exitZoomMode}
        className="fixed top-1/2 right-5 w-16 h-16 bg-transparent border-0 cursor-pointer flex items-center justify-center z-[5] opacity-0 pointer-events-none hover:opacity-70 transition-opacity"
        style={{ transform:"translate(40px,-50%)" }}>
        <svg width="64" height="64" viewBox="0 0 16 16" fill="none">
          <path d="M7.89873 16L6.35949 14.48L11.8278 9.08H0V6.92H11.8278L6.35949 1.52L7.89873 0L16 8L7.89873 16Z" fill="white" />
        </svg>
      </button>

      {/* Controls */}
      <div ref={controlsRef} id="controlsContainer"
        className="fixed bottom-5 flex z-[6] opacity-0 transition-[left] duration-[1200ms]"
        style={{ left:"50%", transform:"translateX(-50%)" }}>
        <div className="percentage-indicator flex items-center justify-center px-5 py-2.5 rounded text-xs uppercase font-normal text-[#333] min-w-[5em] whitespace-nowrap"
          style={{ fontFamily:"TheGoodMonolith,monospace", background:"#f0f0f0", backgroundImage:"radial-gradient(rgba(0,0,0,0.015) 1px,transparent 0)", backgroundSize:"0.44em 0.44em" }}>
          {percentage}%
        </div>
        <div className="switch flex gap-5 px-5 py-2.5 rounded"
          style={{ background:"#222", backgroundImage:"radial-gradient(rgba(255,255,255,0.015) 1px,transparent 0)", backgroundSize:"0.44em 0.44em" }}>
          {[["ZOOM OUT", 0.3], ["NORMAL", 0.6], ["ZOOM IN", 1.0]].map(([label, z]) => (
            <button key={label} onClick={() => applyZoom(z, label)}
              className="relative bg-transparent border-0 text-[#666] cursor-pointer text-xs uppercase px-2.5 py-1 transition-colors duration-300"
              style={{ fontFamily:"TheGoodMonolith,monospace", color: activeZoomBtn === label ? "#f0f0f0" : "#666" }}>
              <span className="absolute w-[5px] h-[5px] bg-[#f0f0f0] rounded-full left-[-8px] top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
              {label}
            </button>
          ))}
          <button onClick={autoFitZoom}
            className="relative bg-transparent border-0 cursor-pointer text-xs uppercase px-2.5 py-1 transition-colors duration-300"
            style={{ fontFamily:"TheGoodMonolith,monospace", color: activeZoomBtn === "FIT" ? "#f0f0f0" : "#666" }}>
            <span className="absolute w-[5px] h-[5px] bg-[#f0f0f0] rounded-full left-[-8px] top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
            FIT
          </button>
        </div>
        <button onClick={toggleSound}
          className={`sound-toggle flex items-center justify-center px-3 py-2 rounded cursor-pointer transition-all duration-300 min-w-[3.75em] ${soundEnabled ? "active" : ""}`}
          style={{ background:"#f0f0f0", backgroundImage:"radial-gradient(rgba(0,0,0,0.015) 1px,transparent 0)", backgroundSize:"0.44em 0.44em", border:"none" }}>
          <SoundWave enabled={soundEnabled} />
        </button>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="fixed bottom-0 left-0 w-screen px-6 py-6 z-[10000] grid grid-cols-12 gap-4 opacity-0 pointer-events-none">
        <div className="[grid-column:9/span_4] text-right pointer-events-auto">
          <p className="text-sm font-semibold text-white" style={{ fontFamily:"TheGoodMonolith,monospace" }}>Est. 2025 • Summer Days</p>
          <p className="text-sm font-semibold text-white" style={{ fontFamily:"TheGoodMonolith,monospace" }}>34.0522° N, 118.2437° W</p>
        </div>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        <div className="absolute inset-0" style={{ mixBlendMode:"overlay", background:"linear-gradient(to bottom,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.5) 20%,transparent 40%)" }} />
      </div>
    </div>
  );
}