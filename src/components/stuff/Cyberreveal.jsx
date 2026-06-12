import { useEffect, useRef } from "react";
import * as THREE from "three";

const MASK_SIZE = 1024;
const BRUSH_RADIUS = 120;

export default function CyberReveal() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene & Camera ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const updateCamera = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    };
    updateCamera();

    const fitCover = (plane, texture) => {
      const imgAspect = texture.image.width / texture.image.height;
      const winAspect = window.innerWidth / window.innerHeight;
      if (imgAspect >= winAspect) {
        plane.scale.set(imgAspect, 1, 1);
      } else {
        plane.scale.set(winAspect, winAspect / imgAspect, 1);
      }
    };

    // ── Mask Canvas ─────────────────────────────────────────────────────────
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = MASK_SIZE;
    maskCanvas.height = MASK_SIZE;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
    const maskTexture = new THREE.CanvasTexture(maskCanvas);

    const paintBrush = (x, y, dx = 0, dy = 0) => {
      const speed = Math.hypot(dx, dy);
      const angle = speed > 1 ? Math.atan2(dy, dx) : 0;
      const stretch = 1 + Math.min(speed / (BRUSH_RADIUS * 0.4), 3.0);

      maskCtx.save();
      maskCtx.translate(x, y);
      maskCtx.rotate(angle);
      maskCtx.scale(stretch, 1);

      const g = maskCtx.createRadialGradient(0, 0, 0, 0, 0, BRUSH_RADIUS);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.65, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = g;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, BRUSH_RADIUS, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      maskTexture.needsUpdate = true;
    };

    // ── Interaction State ────────────────────────────────────────────────────
    let mouseNormX = 0, mouseNormY = 0;
    let smoothX = 0, smoothY = 0, smoothZ = 0;
    let prevMouse = null;
    let lastMouseTime = performance.now();

    const handleMove = (clientX, clientY) => {
      lastMouseTime = performance.now();
      mouseNormX = (clientX / window.innerWidth - 0.5) * 2;
      mouseNormY = -(clientY / window.innerHeight - 0.5) * 2;

      const winAspect = window.innerWidth / window.innerHeight;
      const worldX = ((clientX / window.innerWidth) * 2 - 1) * winAspect;
      const worldY = 1 - (clientY / window.innerHeight) * 2;
      const scaleX = plane2.scale.x;
      const scaleY = plane2.scale.y;
      const cx = ((worldX + scaleX) / (2 * scaleX)) * MASK_SIZE;
      const cy = ((scaleY - worldY) / (2 * scaleY)) * MASK_SIZE;

      if (prevMouse) {
        const dx = cx - prevMouse.x;
        const dy = cy - prevMouse.y;
        const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / (BRUSH_RADIUS * 0.25)));
        for (let i = 0; i <= steps; i++) {
          paintBrush(
            prevMouse.x + (dx * i) / steps,
            prevMouse.y + (dy * i) / steps,
            dx,
            dy
          );
        }
      } else {
        paintBrush(cx, cy);
      }
      prevMouse = { x: cx, y: cy };
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseLeave = () => { prevMouse = null; };
    const onTouchStart = (e) => {
      e.preventDefault();
      prevMouse = null;
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { prevMouse = null; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    // ── Plane 1 — Base Image ─────────────────────────────────────────────────
    const plane1 = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial()
    );
    plane1.position.z = 0;
    scene.add(plane1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/cyber1.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        plane1.material.map = tex;
        plane1.material.needsUpdate = true;
        fitCover(plane1, tex);
      }
    );

    // ── Plane 2 — Reveal Layer ───────────────────────────────────────────────
    const plane2Material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uMask: { value: maskTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uMask;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 wUv = vUv + vec2(
            sin(vUv.y * 5.0 + uTime * 0.9) * 0.02,
            cos(vUv.x * 5.0 + uTime * 0.7) * 0.02
          );
          vec2 d1 = vec2(
            sin(wUv.y * 4.0 + uTime * 1.4) * cos(wUv.x * 3.0 + uTime * 1.1),
            cos(wUv.x * 3.5 + uTime * 1.3) * sin(wUv.y * 2.5 + uTime * 0.9)
          ) * 0.045;
          vec2 d2 = vec2(
            sin(wUv.y * 11.0 - uTime * 2.6 + wUv.x * 5.0),
            cos(wUv.x * 9.0  + uTime * 2.9 - wUv.y * 6.0)
          ) * 0.022;
          vec2 distort = d1 + d2;

          float mask = texture2D(uMask, vUv + distort).r;

          float noise =
            sin(vUv.x * 18.0 + uTime * 2.0) * cos(vUv.y * 16.0 + uTime * 1.7) * 0.22
          + sin(vUv.x * 38.0 - uTime * 3.2) * cos(vUv.y * 33.0 + uTime * 2.6) * 0.11;

          float edgeMask = smoothstep(0.05, 0.35, mask) * (1.0 - smoothstep(0.35, 0.65, mask));
          float liquidMask = mask + noise * edgeMask * 1.8;
          float alpha = smoothstep(0.45, 0.55, liquidMask);

          vec4 imgColor = texture2D(uTexture, vUv);
          vec4 revealColor = vec4(imgColor.rgb, alpha);

          float t = mod(uTime, 5.0) / 5.0;
          float target = t * 2.5 - 0.25;
          float dist = (vUv.x + vUv.y) - target;
          float sweepIntensity = max(0.0, 1.0 - abs(dist) / 0.1);

          vec2 grid = fract(vUv * 100.0);
          float thickness = 0.03;
          bool isLine = grid.x < thickness || grid.y < thickness || abs(grid.x - grid.y) < thickness;

          vec4 wireColor = vec4(0.0);
          if (sweepIntensity > 0.0) {
            float baseAlpha = sweepIntensity * 0.18;
            wireColor = vec4(imgColor.rgb, isLine ? sweepIntensity : baseAlpha);
          }

          gl_FragColor = mix(revealColor, wireColor, wireColor.a);
        }
      `,
    });

    const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), plane2Material);
    plane2.position.z = 0.01;
    scene.add(plane2);

    textureLoader.load(
      "https://raw.githubusercontent.com/danielyl123/person/refs/heads/main/cyber2.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        plane2.material.uniforms.uTexture.value = tex;
        plane2.material.needsUpdate = true;
        fitCover(plane2, tex);
      }
    );

    // ── Animation Loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      plane2.material.uniforms.uTime.value = elapsedTime;

      const secondsSinceMouse = (performance.now() - lastMouseTime) / 1000;
      const targetX = mouseNormX;
      const targetY = mouseNormY;

      if (secondsSinceMouse > 2.0) {
        const zigX = Math.sin(elapsedTime * 1.1);
        const zigY = Math.sin(elapsedTime * 0.7);
        const winAspect = window.innerWidth / window.innerHeight;
        const worldX = zigX * winAspect;
        const worldY = zigY;
        const scaleX = plane2.scale.x;
        const scaleY = plane2.scale.y;
        const cx = ((worldX + scaleX) / (2 * scaleX)) * MASK_SIZE;
        const cy = ((scaleY - worldY) / (2 * scaleY)) * MASK_SIZE;
        paintBrush(cx, cy);
      }

      smoothX += (targetX - smoothX) * 0.06;
      smoothY += (targetY - smoothY) * 0.06;
      const dist = Math.sqrt(targetX * targetX + targetY * targetY);
      smoothZ += (dist - smoothZ) * 0.06;

      plane1.position.x = smoothX * 0.012;
      plane1.position.y = smoothY * 0.012;
      plane1.position.z = -smoothZ * 0.03;

      plane2.position.x = smoothX * 0.02;
      plane2.position.y = smoothY * 0.02;
      plane2.position.z = 0.01 + smoothZ * 0.05;

      const lookTarget = new THREE.Vector3(smoothX * 0.3, smoothY * 0.3, 5);
      plane1.lookAt(lookTarget);
      plane2.lookAt(lookTarget);

      // Fade trail
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = "rgba(0,0,0,0.018)";
      maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
      maskTexture.needsUpdate = true;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      updateCamera();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (plane1.material.map) fitCover(plane1, plane1.material.map);
      if (plane2.material.uniforms.uTexture.value)
        fitCover(plane2, plane2.material.uniforms.uTexture.value);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      maskTexture.dispose();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
    </div>
  );
}