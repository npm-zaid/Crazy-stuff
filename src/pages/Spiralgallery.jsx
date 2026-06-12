import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1638959882708-9503b1cd595f?w=800&q=80",
  "https://images.unsplash.com/photo-1644469709847-454ef12d5144?w=800&q=80",
  "https://images.unsplash.com/photo-1731848356615-90cba9fdc862?w=800&q=80",
  "https://images.unsplash.com/photo-1688388040015-c3985c83a12d?w=800&q=80",
  "https://images.unsplash.com/photo-1726591383648-5b5cbe1da1a2?w=800&q=80",
  "https://images.unsplash.com/photo-1651745314014-a9432659af40?w=800&q=80",
  "https://images.unsplash.com/photo-1635585244467-134d68caad51?w=800&q=80",
  "https://images.unsplash.com/photo-1517498327491-f903e1e281cd?w=800&q=80",
  "https://images.unsplash.com/photo-1584969405346-5230ae2bc4fc?w=800&q=80",
  "https://images.unsplash.com/photo-1615212049275-95561aebe1b4?w=800&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
  "https://images.unsplash.com/photo-1516727003284-a96541e51e9c?w=800&q=80",
  "https://images.unsplash.com/photo-1530735038726-a73fd6e6a349?w=800&q=80",
  "https://images.unsplash.com/photo-1548918901-9b31223c5c3a?w=800&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "https://images.unsplash.com/photo-1553544260-f87e671974ee?w=800&q=80",
  "https://images.unsplash.com/photo-1512084747998-038941f49b84?w=800&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80",
  "https://images.unsplash.com/photo-1532170579297-281918c8ae72?w=800&q=80",
  "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=800&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80",
  "https://images.unsplash.com/photo-1593010932917-92bd21088dee?w=800&q=80",
];

const NUM_IMAGES = IMAGE_URLS.length;

const SPIRAL_CFG = {
  imageHeight: 7,
  curvature: -0.03,
  gapSize: 0,
  spiralRadius: 3.5,
  spiralTurns: 2.8 + (NUM_IMAGES - 21) * 0.1,
  spiralHeight: 12 + (NUM_IMAGES - 21) * 0.25,
  centerX: -2,
  centerY: 4.38,
  centerZ: 0,
};

const INERTIA = {
  friction: 0.94,
  strength: 0.8,
  maxSpeed: 0.05,
  directionSmoothing: 0.92,
  scrollSensitivity: 0.0008,
};

export default function SpiralGallery() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [infoVisible, setInfoVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // ── Three.js core ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const tiltGroup = new THREE.Group();
    const baseRot = { x: -0.18, z: 0.12 };
    tiltGroup.rotation.x = baseRot.x;
    tiltGroup.rotation.z = baseRot.z;
    scene.add(tiltGroup);

    // ── Mutable state ──────────────────────────────────────────────────────
    let spiralMesh = null;
    let shaderMaterial = null;
    let imageRatios = [];
    let originalPositions = [];
    let scrollOffset = 0;

    let targetVelocity = 0;
    let currentVelocity = 0;
    let acceleration = 0;

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let dragRot = { x: 0, z: 0 };

    // touch
    let isTouching = false;
    let touchLastY = 0;
    let touchVelocity = 0;
    let lastTouchTs = 0;
    let isDraggingTouch = false;
    let touchDragStart = { x: 0, y: 0 };

    // zoom
    let zoomLevel = 1.0;
    const minZoom = 0.84;
    const maxZoom = 1.0;

    // ── UV helper ──────────────────────────────────────────────────────────
    function updateUVOffset() {
      if (!shaderMaterial) return;
      let o = scrollOffset % 1;
      if (o < 0) o += 1;
      shaderMaterial.uniforms.offset.value = o;
    }

    // ── Geometry rebuild ──────────────────────────────────────────────────
    function rebuildGeometry() {
      if (!spiralMesh) return;
      const totalSlots = imageRatios.length;
      const widths = imageRatios.map((r) => r * SPIRAL_CFG.imageHeight);
      const totalWidth = widths.reduce((a, b) => a + b, 0);
      const segW = 200 + totalSlots * 20;
      const segH = 24;

      const geo = new THREE.PlaneGeometry(totalWidth, SPIRAL_CFG.imageHeight, segW, segH);
      const pos = geo.attributes.position;
      const uvs = geo.attributes.uv;

      const origX = [], origY = [];
      for (let i = 0; i < pos.count; i++) {
        origX.push(pos.getX(i));
        origY.push(pos.getY(i));
      }

      const cum = [0];
      for (let i = 0; i < totalSlots; i++) cum.push(cum[i] + widths[i] / totalWidth);
      const imageRatio = 1 - SPIRAL_CFG.gapSize;

      for (let i = 0; i < uvs.count; i++) {
        let u = Math.max(0, Math.min(0.999999, uvs.getX(i)));
        let found = false;
        for (let j = 0; j < totalSlots; j++) {
          if (u >= cum[j] && u < cum[j + 1]) {
            let localU = (u - cum[j]) / (cum[j + 1] - cum[j]);
            if (localU > imageRatio) {
              uvs.setX(i, cum[j + 1] - 0.001);
            } else {
              let su = Math.max(0.001, Math.min(0.999, localU / imageRatio));
              uvs.setX(i, cum[j] + su * (cum[j + 1] - cum[j]));
            }
            found = true;
            break;
          }
        }
        if (!found) uvs.setX(i, cum[totalSlots] - 0.001);
      }

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        const nx = x / (totalWidth / 2);
        const curve = SPIRAL_CFG.curvature * 0.4 * (nx * nx - 1);
        pos.setXYZ(i, x, y, -curve);
      }

      for (let i = 0; i < pos.count; i++) {
        const x = origX[i], y = origY[i];
        let t = Math.max(0, Math.min(1, (x + totalWidth / 2) / totalWidth));
        const angle = t * Math.PI * 2 * SPIRAL_CFG.spiralTurns;
        const radius = SPIRAL_CFG.spiralRadius * (1 - t * 0.12);
        let px = Math.sin(angle) * radius;
        let pz = Math.cos(angle) * radius;
        let py = (t - 0.5) * SPIRAL_CFG.spiralHeight + y * 0.35;

        if (!originalPositions[i]) {
          originalPositions[i] = {
            ox: (Math.random() - 0.5) * 0.001,
            oy: (Math.random() - 0.5) * 0.001,
            oz: (Math.random() - 0.5) * 0.001,
          };
        }
        pos.setXYZ(
          i,
          px + originalPositions[i].ox,
          py + originalPositions[i].oy,
          pz + originalPositions[i].oz
        );
      }

      geo.computeVertexNormals();
      const old = spiralMesh.geometry;
      spiralMesh.geometry = geo;
      if (old) old.dispose();
      if (shaderMaterial) shaderMaterial.uniforms.gap.value = SPIRAL_CFG.gapSize;
    }

    // ── Master texture ─────────────────────────────────────────────────────
    function createMasterTexture() {
      return new Promise((resolve) => {
        const cvs = document.createElement("canvas");
        const ctx = cvs.getContext("2d");
        const baseH = 500;
        let loaded = 0;
        const images = [];

        IMAGE_URLS.forEach((url, idx) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            imageRatios[idx] = ratio;
            images[idx] = { img, width: baseH * ratio, height: baseH };
            if (++loaded === NUM_IMAGES) finish();
          };
          img.onerror = () => {
            imageRatios[idx] = 0.8;
            images[idx] = { img: null, width: baseH * 0.8, height: baseH };
            if (++loaded === NUM_IMAGES) finish();
          };
          img.src = url;
        });

        function finish() {
          const totalW = images.reduce((s, i) => s + i.width, 0);
          cvs.width = totalW;
          cvs.height = baseH;
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, totalW, baseH);
          let ox = 0;
          images.forEach((d) => {
            if (d.img) ctx.drawImage(d.img, ox, 0, d.width, d.height);
            ox += d.width;
          });
          const tex = new THREE.CanvasTexture(cvs);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          resolve(tex);
        }
      });
    }

    // ── Init ───────────────────────────────────────────────────────────────
    async function init() {
      const texture = await createMasterTexture();

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          gap: { value: SPIRAL_CFG.gapSize },
          offset: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform sampler2D map;
          uniform float gap;
          uniform float offset;
          varying vec2 vUv;
          void main() {
            float u = vUv.x + offset;
            if (u >= 1.0) u -= 1.0;
            if (u < 0.0) u += 1.0;
            gl_FragColor = texture2D(map, vec2(u, vUv.y));
          }`,
        transparent: true,
        side: THREE.DoubleSide,
      });

      spiralMesh = new THREE.Mesh(new THREE.BufferGeometry(), shaderMaterial);
      spiralMesh.position.set(SPIRAL_CFG.centerX, SPIRAL_CFG.centerY, SPIRAL_CFG.centerZ);
      spiralMesh.rotation.x = 0.35;
      tiltGroup.add(spiralMesh);

      rebuildGeometry();
      animate();
    }

    // ── Animation loop ─────────────────────────────────────────────────────
    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);

      // wheel inertia
      targetVelocity *= INERTIA.friction;
      currentVelocity = currentVelocity * 0.85 + targetVelocity * 0.15;
      if (Math.abs(currentVelocity) > 0.0001) {
        scrollOffset += currentVelocity;
        updateUVOffset();
      } else {
        currentVelocity = 0;
        targetVelocity = 0;
        acceleration = 0;
      }

      // touch inertia
      if (!isTouching) {
        touchVelocity *= 0.95;
        if (Math.abs(touchVelocity) > 0.0001) {
          scrollOffset += touchVelocity * 0.5;
          updateUVOffset();
        } else {
          touchVelocity = 0;
        }
      }

      renderer.render(scene, camera);
    }

    // ── Wheel ──────────────────────────────────────────────────────────────
    let lastWheelTs = 0;
    function onWheel(e) {
      e.preventDefault();
      const now = performance.now();
      const dt = Math.max(1, Math.min(32, now - lastWheelTs));
      lastWheelTs = now;
      const raw = e.deltaY * INERTIA.scrollSensitivity * INERTIA.strength;
      const maxAccel = 0.015;
      const da = Math.max(-maxAccel, Math.min(maxAccel, raw - acceleration));
      acceleration = Math.max(-0.03, Math.min(0.03, acceleration + da));
      targetVelocity = Math.max(
        -INERTIA.maxSpeed,
        Math.min(INERTIA.maxSpeed, targetVelocity * INERTIA.directionSmoothing + acceleration * (1 - INERTIA.directionSmoothing))
      );
    }

    // ── Mouse drag ─────────────────────────────────────────────────────────
    function onMouseDown(e) {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
      e.preventDefault();
    }
    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      dragRot.z = Math.max(-0.35, Math.min(0.35, dragRot.z + dx * 0.002));
      dragRot.x = Math.max(-0.35, Math.min(0.35, dragRot.x - dy * 0.002));
      tiltGroup.rotation.x = baseRot.x + dragRot.x;
      tiltGroup.rotation.z = baseRot.z + dragRot.z;
      prevMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseUp() {
      isDragging = false;
      container.style.cursor = "grab";
    }

    // ── Touch ──────────────────────────────────────────────────────────────
    function onTouchStart(e) {
      e.preventDefault();
      if (e.touches.length === 2) {
        isDraggingTouch = true;
        touchDragStart = { x: e.touches[1].clientX, y: e.touches[1].clientY };
        return;
      }
      isTouching = true;
      touchLastY = e.touches[0].clientY;
      touchVelocity = 0;
      lastTouchTs = performance.now();
    }
    function onTouchMove(e) {
      e.preventDefault();
      if (isDraggingTouch && e.touches.length === 2) {
        const dx = e.touches[1].clientX - touchDragStart.x;
        const dy = e.touches[1].clientY - touchDragStart.y;
        dragRot.z = Math.max(-0.35, Math.min(0.35, dragRot.z + dx * 0.003));
        dragRot.x = Math.max(-0.35, Math.min(0.35, dragRot.x - dy * 0.003));
        tiltGroup.rotation.x = baseRot.x + dragRot.x;
        tiltGroup.rotation.z = baseRot.z + dragRot.z;
        touchDragStart = { x: e.touches[1].clientX, y: e.touches[1].clientY };
        return;
      }
      if (!isTouching) return;
      const now = performance.now();
      const dt = Math.max(1, Math.min(32, now - lastTouchTs));
      lastTouchTs = now;
      const curY = e.touches[0].clientY;
      const dy = curY - touchLastY;
      const raw = dy * INERTIA.scrollSensitivity * INERTIA.strength * 0.5;
      touchVelocity = touchVelocity * 0.7 + raw * 0.3;
      scrollOffset += dy * INERTIA.scrollSensitivity * INERTIA.strength * 0.8;
      updateUVOffset();
      touchLastY = curY;
    }
    function onTouchEnd(e) {
      e.preventDefault();
      isTouching = false;
      isDraggingTouch = false;
      if (Math.abs(touchVelocity) > 0.001) {
        targetVelocity = Math.max(
          -INERTIA.maxSpeed * 1.5,
          Math.min(INERTIA.maxSpeed * 1.5, touchVelocity * 1.2)
        );
      }
      touchVelocity = 0;
    }

    // ── Keyboard zoom ──────────────────────────────────────────────────────
    function onKeyDown(e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        zoomLevel = Math.min(maxZoom, zoomLevel + 0.05);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        zoomLevel = Math.max(minZoom, zoomLevel - 0.05);
      }
      camera.position.z = 9 / zoomLevel;
      camera.position.y = 3.5 / zoomLevel;
    }

    // ── Resize ─────────────────────────────────────────────────────────────
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ── Event registration ─────────────────────────────────────────────────
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    container.style.cursor = "grab";

    init();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // ── Fullscreen ────────────────────────────────────────────────────────────
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none touch-none">

      {/* WebGL canvas container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-10"
        style={{ pointerEvents: "auto" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full outline-none"
        />
      </div>

      {/* Top-left copy badge */}
      <div className="fixed top-5 left-5 z-20 bg-white/70 text-black text-xs px-2.5 py-2 rounded-md pointer-events-none">
        &amp;Toc
      </div>

      {/* Top-right title */}
      <div
        className="fixed top-5 right-5 z-20 max-w-[251px] bg-[rgb(30,30,30,0.9)] px-3 py-2 rounded-md text-right text-[3em] uppercase leading-none hidden md:block"
        style={{ fontFamily: "'Monoton', sans-serif" }}
      >
        infinite spiral loop
      </div>

      {/* Bottom-left credits */}
      <div className="fixed bottom-5 left-5 z-20 bg-[rgb(30,30,30,0.9)] px-3 py-2 rounded-md text-sm pointer-events-auto">
        All images from{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noreferrer"
          className="text-[tomato] no-underline hover:text-[#10cbea] transition-colors duration-1000"
        >
          Unsplash.com
        </a>
      </div>

      {/* Bottom-center info toast */}
      {infoVisible && (
        <button
          onClick={() => setInfoVisible(false)}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 bg-white text-black text-[13px] px-3 py-2 rounded-lg cursor-pointer"
        >
          scroll | drag &nbsp;·&nbsp; click to hide
        </button>
      )}

      {/* Bottom-right fullscreen toggle */}
      <button
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={toggleFullscreen}
        className="fixed bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white flex items-center justify-center transition-colors hover:bg-black/20"
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>
    </div>
  );
}