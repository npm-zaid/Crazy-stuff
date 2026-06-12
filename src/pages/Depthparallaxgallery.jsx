import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const IMAGE_PATHS = [
  "https://images.unsplash.com/photo-1602353195884-44ea7e76e196?w=200",
  "https://images.unsplash.com/photo-1582890158937-c11bebdc387f?w=200",
  "https://images.unsplash.com/photo-1583320901261-81b2160ac1eb?w=200",
  "https://images.unsplash.com/photo-1583705794539-ac40eb735193?w=200",
  "https://images.unsplash.com/photo-1585088316174-42ab5d3a99b2?w=200",
  "https://images.unsplash.com/photo-1585612155794-c83acbc99359?w=200",
  "https://images.unsplash.com/photo-1588367171393-c0f77a14faff?w=200",
  "https://images.unsplash.com/photo-1588501756867-865784321337?w=200",
  "https://images.unsplash.com/photo-1588608368947-c243aea32bff?w=200",
  "https://images.unsplash.com/photo-1591167068512-e96853b5a458?w=200",
  "https://images.unsplash.com/photo-1592926256627-488adc9a24f1?w=200",
  "https://images.unsplash.com/photo-1594063596316-aa5f41ceb8dc?w=200",
  "https://images.unsplash.com/photo-1595687825617-10c4d36566e7?w=200",
  "https://images.unsplash.com/photo-1595796098891-e6adfdc930bd?w=200",
  "https://images.unsplash.com/photo-1597426720982-d6d9d73de978?w=200",
  "https://images.unsplash.com/photo-1601574465779-76d6dbb88557?w=200",
  "https://images.unsplash.com/photo-1605815176963-328929c499cf?w=200",
  "https://images.unsplash.com/photo-1610642434561-956cd4111f42?w=200",
  "https://images.unsplash.com/photo-1612694790936-e4ac2ef03ec0?w=200",
  "https://images.unsplash.com/photo-1623572180554-d8d8d6ba8630?w=200",
  "https://images.unsplash.com/photo-1630155848269-94f37474ed8b?w=200",
  "https://images.unsplash.com/photo-1740919486071-1650afd5b694?w=200",
  "https://images.unsplash.com/photo-1738525052282-900818c83635?w=200",
  "https://images.unsplash.com/photo-1715615303987-b1168c876b0a?w=200",
  "https://images.unsplash.com/photo-1634545133513-b26b1d79bb34?w=200",
];

const DEPTH_LAYERS = 5;
const IMAGES_PER_LAYER = 10;
const MAX_WIDTH = 160;
const MAX_HEIGHT = 160;

const LAYER_CONFIG = [
  { scale: 1.5, speed: 80, opacity: 1.0 },
  { scale: 1.0, speed: 40, opacity: 0.85 },
  { scale: 0.8, speed: 30, opacity: 0.7 },
  { scale: 0.6, speed: 20, opacity: 0.55 },
  { scale: 0.5, speed: 15, opacity: 0.4 },
];

const FALLBACK_COLORS = ["#4a6572", "#344955", "#232f34", "#1c2529", "#0f1518"];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function DepthParallaxGallery() {
  const containerRef = useRef(null);
  const [loadingPct, setLoadingPct] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Three.js setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    let camera = null;
    let layers = Array.from({ length: DEPTH_LAYERS }, () => []);
    const textures = [];
    let loaded = 0;
    let lastTime = 0;
    let dragActive = false;
    let lastX = 0;
    let dragVelocity = 0;
    let speedFactor = 1;
    let rafId = null;

    // shuffled image queue
    let shuffled = shuffleArray(IMAGE_PATHS);
    let imgIdx = 0;
    function getNextImage() {
      if (imgIdx >= shuffled.length) { shuffled = shuffleArray(IMAGE_PATHS); imgIdx = 0; }
      return shuffled[imgIdx++];
    }

    // ── Camera / resize ─────────────────────────────────────────────────
    function setupCamera() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      if (!camera) {
        camera = new THREE.OrthographicCamera(0, w, h, 0, -1000, 1000);
        camera.position.z = 10;
      } else {
        camera.right = w;
        camera.top = h;
        camera.updateProjectionMatrix();
      }
    }

    function clearSprites() {
      for (const layer of layers) {
        for (const s of layer) {
          scene.remove(s);
          if (s.material.map) s.material.map.dispose();
          s.material.dispose();
          s.geometry.dispose();
        }
      }
      layers = Array.from({ length: DEPTH_LAYERS }, () => []);
    }

    function resize() {
      setupCamera();
      clearSprites();
      if (textures.length === DEPTH_LAYERS * IMAGES_PER_LAYER) fillViewport();
    }
    window.addEventListener("resize", resize);
    setupCamera();

    // ── Fallback texture ────────────────────────────────────────────────
    function fallbackTexture(layerIdx) {
      const c = document.createElement("canvas");
      c.width = MAX_WIDTH; c.height = MAX_HEIGHT;
      const ctx = c.getContext("2d");
      ctx.fillStyle = FALLBACK_COLORS[layerIdx];
      ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
      return new THREE.CanvasTexture(c);
    }

    // ── Sprite helpers ──────────────────────────────────────────────────
    function addSprite(layerIdx, startX) {
      const cfg = LAYER_CONFIG[layerIdx];
      const tex = textures[Math.floor(Math.random() * textures.length)] || fallbackTexture(layerIdx);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: cfg.opacity });
      const sprite = new THREE.Sprite(mat);

      const img = tex.image;
      let w = MAX_WIDTH, h = MAX_HEIGHT;
      if (img?.width && img?.height) {
        const ratio = img.width / img.height;
        if (ratio > 1) { w = MAX_WIDTH; h = MAX_WIDTH / ratio; }
        else { h = MAX_HEIGHT; w = MAX_HEIGHT * ratio; }
      }
      const sv = rand(0.85, 1.15);
      const sw = w * cfg.scale * sv;
      const sh = h * cfg.scale * sv;
      const spacing = sw * rand(0.5, 0.9);

      sprite.scale.set(sw, sh, 1);
      sprite.position.set(
        startX + sw / 2 + spacing,
        rand(sh / 2, container.clientHeight - sh / 2),
        -layerIdx * 50
      );
      sprite.userData = {
        speed: cfg.speed * rand(0.45, 1.15),
        width: sw, height: sh,
        seed: rand(0, 1000),
        baseY: sprite.position.y,
        opacity: cfg.opacity,
      };
      layers[layerIdx].push(sprite);
      scene.add(sprite);
    }

    function cleanupSprites() {
      const w = container.clientWidth;
      const buf = w * 0.5;
      for (let l = 0; l < DEPTH_LAYERS; l++) {
        const sprites = layers[l];
        if (!sprites?.length) continue;
        const max = IMAGES_PER_LAYER + 3;
        if (sprites.length <= max) continue;
        for (let i = sprites.length - 1; i >= 0; i--) {
          const s = sprites[i];
          const ud = s.userData;
          const overRight = speedFactor > 0 && s.position.x - ud.width / 2 > w + buf;
          const overLeft  = speedFactor < 0 && s.position.x + ud.width / 2 < -buf;
          if (overRight || overLeft) {
            scene.remove(s);
            if (s.material.map) s.material.map.dispose();
            s.material.dispose();
            sprites.splice(i, 1);
            if (sprites.length <= max) break;
          }
        }
      }
    }

    function fillViewport() {
      const w = container.clientWidth;
      for (let l = 0; l < DEPTH_LAYERS; l++) {
        const sprites = layers[l];
        if (!sprites) continue;
        let rightMost = sprites.length > 0
          ? Math.max(...sprites.map(s => s.position.x + s.userData.width / 2))
          : -container.clientWidth * 1.2;
        while (rightMost < w) {
          addSprite(l, rightMost);
          rightMost = Math.max(...layers[l].map(s => s.position.x + s.userData.width / 2));
        }
      }
    }

    // ── Animation loop ──────────────────────────────────────────────────
    function animate() {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min(40, now - lastTime) / 1000;
      lastTime = now;

      dragVelocity *= 0.92;
      if (dragVelocity !== 0) speedFactor = Math.sign(dragVelocity);

      if (Math.random() < 0.01) cleanupSprites();

      const w = container.clientWidth;
      for (const sprites of layers) {
        if (!sprites?.length) continue;
        for (const s of sprites) {
          const ud = s.userData;
          s.position.x += ud.speed * speedFactor * dt;
          if (speedFactor > 0 && s.position.x - ud.width / 2 > w)
            s.position.x = -ud.width / 2 - rand(0, ud.width);
          else if (speedFactor < 0 && s.position.x + ud.width / 2 < 0)
            s.position.x = w + ud.width / 2 + rand(0, ud.width);

          const pulse = 1 + Math.sin(now * 0.001 + ud.seed) * 0.015;
          s.scale.x = ud.width * pulse;
          s.scale.y = ud.height * pulse;
          s.position.y = ud.baseY + Math.sin(now * 0.001 + ud.seed) * 5;
          s.material.opacity = ud.opacity;
        }
      }
      renderer.render(scene, camera);
    }

    // ── Texture loading ─────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    const TOTAL = DEPTH_LAYERS * IMAGES_PER_LAYER;

    function onLoaded(tex) {
      textures.push(tex);
      loaded++;
      setLoadingPct(Math.round((loaded / TOTAL) * 100));
      if (loaded === TOTAL) {
        fillViewport();
        setReady(true);
        lastTime = performance.now();
        animate();
      }
    }

    for (let l = 0; l < DEPTH_LAYERS; l++) {
      for (let i = 0; i < IMAGES_PER_LAYER; i++) {
        const path = getNextImage();
        loader.load(path, onLoaded, undefined, () => onLoaded(fallbackTexture(l)));
      }
    }

    // ── Pointer events ──────────────────────────────────────────────────
    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    const onMouseDown = (e) => { dragActive = true; lastX = getX(e); };
    const onMouseMove = (e) => {
      if (!dragActive) return;
      const x = getX(e);
      dragVelocity = (x - lastX) * 0.02;
      lastX = x;
    };
    const onMouseUp = () => { dragActive = false; };

    const onWheel = (e) => {
      e.preventDefault();
      const dir = Math.sign(e.deltaY);
      speedFactor = Math.sign(dir) * Math.min(5, Math.abs(speedFactor) + 0.8);
      dragVelocity = 0;
      cleanupSprites();
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", (e) => { dragActive = true; lastX = getX(e); }, { passive: true });
    container.addEventListener("touchmove", (e) => {
      if (!dragActive) return;
      const x = getX(e);
      dragVelocity = (x - lastX) * 0.02;
      lastX = x;
    }, { passive: true });
    window.addEventListener("touchend", () => { dragActive = false; });
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", () => {});
      clearSprites();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#111] text-white overflow-hidden font-[system-ui,Segoe_UI,Roboto]">

      {/* WebGL container */}
      <div ref={containerRef} className="fixed inset-0 overflow-hidden" />

      {/* Loading overlay */}
      {!ready && (
        <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-white text-sm">
            Chargement {loadingPct}%
          </span>
        </div>
      )}

      {/* Credits */}
      {ready && (
        <div className="fixed left-3 bottom-3 z-10 bg-black/35 px-2 py-2 rounded-lg text-[13px] opacity-85">
          Photographies de{" "}
          <a
            href="https://unsplash.com/fr/@raaminka"
            target="_blank"
            rel="noopener nofollow"
            className="text-[#9cf] no-underline hover:text-white transition-colors"
          >
            Raamin ka
          </a>{" "}
          sur{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener nofollow"
            className="text-[#9cf] no-underline hover:text-white transition-colors"
          >
            Unsplash
          </a>
        </div>
      )}

      {/* Copy badge */}
      <div className="fixed bottom-5 right-5 z-10 bg-white/90 text-black text-xs px-2.5 py-2.5 rounded pointer-events-none">
        &amp;Toc
      </div>
    </div>
  );
}