import { useEffect, useRef } from "react";
import * as THREE from "three";
import Lenis from "@studio-freight/lenis";

const SLIDE_TITLES = [
  "Field Unit",
  "Astral Convergence",
  "Eclipse Core",
  "Luminous",
  "Serenity",
  "Nebula Point",
  "Horizon",
];

// Thematic Unsplash images — no API key needed, served via CDN
const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=500&fit=crop", // green field
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=500&fit=crop", // nebula
  "https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&h=500&fit=crop", // eclipse sky
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=500&fit=crop", // glowing stars
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop", // calm lake
  "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&h=500&fit=crop", // galaxy
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop", // mountain horizon
];

const TOTAL_SLIDES = 7;
const SLIDE_HEIGHT = 15;
const GAP = 0.5;
const CYCLE_HEIGHT = TOTAL_SLIDES * (SLIDE_HEIGHT + GAP);

export default function ThreeSlider() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const images = [];
    let loadedCount = 0;

    const loadImages = () => {
      IMAGE_URLS.forEach((src, idx) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // required for canvas drawImage with external URLs
        const onDone = () => {
          loadedCount++;
          if (loadedCount === TOTAL_SLIDES) initScene();
        };
        img.onload = () => {
          images[idx] = img;
          onDone();
        };
        img.onerror = () => {
          images[idx] = null;
          onDone();
        };
        img.src = src;
      });
    };

    const initScene = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000);

      const parentWidth = 20;
      const parentHeight = 75;
      const curvature = 35;
      const segmentsX = 200;
      const segmentsY = 200;

      const geo = new THREE.PlaneGeometry(
        parentWidth,
        parentHeight,
        segmentsX,
        segmentsY
      );
      const positions = geo.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const y = positions[i + 1];
        const dist = Math.abs(y / (parentHeight / 2));
        positions[i + 2] = Math.pow(dist, 2) * curvature;
      }
      geo.computeVertexNormals();

      const texCanvas = document.createElement("canvas");
      const ctx = texCanvas.getContext("2d", {
        alpha: false,
        willReadFrequently: false,
      });
      texCanvas.width = 2048;
      texCanvas.height = 8192;

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = Math.min(
        4,
        renderer.capabilities.getMaxAnisotropy()
      );

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.x = THREE.MathUtils.degToRad(-20);
      mesh.rotation.y = THREE.MathUtils.degToRad(20);
      scene.add(mesh);

      const distance = 17.5;
      const heightOffset = 5;
      const offsetX = distance * Math.sin(THREE.MathUtils.degToRad(20));
      const offsetZ = distance * Math.cos(THREE.MathUtils.degToRad(20));
      camera.position.set(offsetX, heightOffset, offsetZ);
      camera.lookAt(0, -2, 0);
      camera.rotation.z = THREE.MathUtils.degToRad(-5);

      const updateTexture = (offset = 0) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

        const fontSize = 180;
        ctx.font = `500 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const extraSlides = 2;

        for (let i = -extraSlides; i < TOTAL_SLIDES + extraSlides; i++) {
          let slideY = -i * (SLIDE_HEIGHT + GAP);
          slideY += offset * CYCLE_HEIGHT;

          const textureY = (slideY / CYCLE_HEIGHT) * texCanvas.height;
          let wrappedY = textureY % texCanvas.height;
          if (wrappedY < 0) wrappedY += texCanvas.height;

          const slideIndex =
            ((-i % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;

          const slideRect = {
            x: texCanvas.width * 0.05,
            y: wrappedY,
            width: texCanvas.width * 0.9,
            height: (SLIDE_HEIGHT / CYCLE_HEIGHT) * texCanvas.height,
          };

          const img = images[slideIndex];
          if (img) {
            const imgAspect = img.width / img.height;
            const rectAspect = slideRect.width / slideRect.height;

            let drawWidth, drawHeight, drawX, drawY;
            if (imgAspect > rectAspect) {
              drawHeight = slideRect.height;
              drawWidth = drawHeight * imgAspect;
              drawX = slideRect.x + (slideRect.width - drawWidth) / 2;
              drawY = slideRect.y;
            } else {
              drawWidth = slideRect.width;
              drawHeight = drawWidth / imgAspect;
              drawX = slideRect.x;
              drawY = slideRect.y + (slideRect.height - drawHeight) / 2;
            }

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(
              slideRect.x,
              slideRect.y,
              slideRect.width,
              slideRect.height,
              [40] // FIX 1: Added border radius array
            );
            ctx.clip();
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
          } else {
            // Fallback: dark placeholder if image failed
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(
              slideRect.x,
              slideRect.y,
              slideRect.width,
              slideRect.height,
              [40] // FIX 1: Added border radius array
            );
            ctx.clip();
            ctx.fillStyle = "#111";
            ctx.fillRect(
              slideRect.x,
              slideRect.y,
              slideRect.width,
              slideRect.height
            );
            ctx.restore();
          }

          // Title overlay
          ctx.fillStyle = "white";
          ctx.fillText(
            SLIDE_TITLES[slideIndex],
            texCanvas.width / 2,
            wrappedY + slideRect.height / 2
          );
        }

        texture.needsUpdate = true;
      };

      lenis.on("scroll", ({ scroll, limit }) => {
        // FIX 2: Check limit to prevent NaN on initial frame
        const currentScroll = limit > 0 ? scroll / limit : 0;
        updateTexture(-currentScroll);
        renderer.render(scene, camera);
      });

      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);
      };
      window.addEventListener("resize", handleResize);

      updateTexture(0);
      renderer.render(scene, camera);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        texture.dispose();
        geo.dispose();
        material.dispose();
      };
    };

    loadImages();

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Scroll height to drive Lenis */}
      <div style={{ height: "1000vh" }} />

      {/* Three.js canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 75%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full px-8 py-6 flex justify-between items-center z-20">
        <p className="text-sm font-normal text-white">Animmaster</p>
        <div className="flex gap-8">
          <p className="text-sm font-normal text-white/50 cursor-pointer hover:text-white/80 transition-colors">
            Index
          </p>
          <p className="text-sm font-normal text-white/50 cursor-pointer hover:text-white/80 transition-colors">
            About
          </p>
        </div>
      </nav>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full px-8 py-6 flex justify-between items-center z-20">
        <p className="text-sm font-normal text-white/50">&copy; 2026</p>
      </footer>
    </div>
  );
}