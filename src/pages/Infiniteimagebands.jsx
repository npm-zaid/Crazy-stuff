import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────
// Constants (mirrored from original)
// ─────────────────────────────────────────────
const BAND_HEIGHT = 120;
const IMAGE_HEIGHT = 100;
const IMAGE_GAP = 20;
const CLONE_COUNT = 3;
const MAX_IMAGE_WIDTH = 300;
const IMAGES_PER_BAND = [8, 12, 9, 13, 14, 10, 9, 13];

const ImageBand1 = ["https://images.unsplash.com/photo-1649730837819-e68ff76c1816?h=400","https://images.unsplash.com/photo-1649730845726-90c8921bde03?h=400","https://images.unsplash.com/photo-1648090330632-4c9531c3ea60?h=400","https://images.unsplash.com/photo-1648090328990-773c71909629?h=400","https://images.unsplash.com/photo-1648090330282-286c3b1a6a7f?h=400","https://images.unsplash.com/photo-1648090319891-22ce6cc39bba?h=400","https://images.unsplash.com/photo-1648090324472-041e0203e6ce?h=400","https://images.unsplash.com/photo-1688907487698-b2392019f522?h=400"];
const ImageBand2 = ["https://images.unsplash.com/photo-1649730837968-c51a42f9396e?w=300","https://images.unsplash.com/photo-1649730842615-2ff02352e535?w=300","https://images.unsplash.com/photo-1649730845183-37de96f3acbf?w=300","https://images.unsplash.com/photo-1649730837657-95502fac2858?w=300","https://images.unsplash.com/photo-1649730842550-a2b4481f6505?w=300","https://images.unsplash.com/photo-1633657321317-f1e83e9b2b57?w=300","https://images.unsplash.com/photo-1648090319885-a90824ccd765?w=300","https://images.unsplash.com/photo-1648090319997-ca10568f8b88?w=300","https://images.unsplash.com/photo-1648090324464-ca18cce37a44?w=300","https://images.unsplash.com/photo-1648090324464-87b5e78ae9f8?w=300","https://images.unsplash.com/photo-1648090325560-6c3e4df8fc21?w=300","https://images.unsplash.com/photo-1648090329516-ee37a5ff060b?w=300"];
const ImageBand3 = ["https://images.unsplash.com/photo-1648090268311-4f1831fc5600?w=300","https://images.unsplash.com/photo-1648090317695-f0a97182ddfd?w=300","https://images.unsplash.com/photo-1648090317724-5cc66d54cb59?w=300","https://images.unsplash.com/photo-1632054553195-bfd7034fee25?w=300","https://images.unsplash.com/photo-1632054259416-61e1913909f8?w=300","https://images.unsplash.com/photo-1632054259418-def36ea6c2a5?w=300","https://images.unsplash.com/photo-1632054553790-c4f1f534c184?w=300","https://images.unsplash.com/photo-1648090317489-e2a4434b0be2?w=300","https://images.unsplash.com/photo-1632054553871-c2817a775d18?w=300"];
const ImageBand4 = ["https://images.unsplash.com/photo-1665264998342-e1c485aa9e6c?w=300","https://images.unsplash.com/photo-1688907487591-962299895ad2?w=300","https://images.unsplash.com/photo-1648090322521-57f40a418fc9?w=300","https://images.unsplash.com/photo-1648090317719-a57c907a7284?w=300","https://images.unsplash.com/photo-1648090319998-2763a51e00c9?w=300","https://images.unsplash.com/photo-1630163666316-39db7fd0f2d8?w=300","https://images.unsplash.com/photo-1648090325360-d68298515046?w=300","https://images.unsplash.com/photo-1648090322506-c79522085735?w=300","https://images.unsplash.com/photo-1630636147267-42808cca8243?w=300","https://images.unsplash.com/photo-1688907487492-67541759c0ec?w=300","https://images.unsplash.com/photo-1648090255048-90079d233070?w=300","https://images.unsplash.com/photo-1648090265052-ac09d6212872?w=300","https://images.unsplash.com/photo-1630163666253-d499c23e1be2?w=300"];
const ImageBand5 = ["https://images.unsplash.com/photo-1648090328043-e75292e328ec?w=300","https://images.unsplash.com/photo-1648090322515-02be75f7d731?w=300","https://images.unsplash.com/photo-1648090317691-5e54b4f49b13?w=300","https://images.unsplash.com/photo-1631932389691-e537af7cb995?w=300","https://images.unsplash.com/photo-1631932389075-4ac0d4bf7394?w=300","https://images.unsplash.com/photo-1688907487001-28bb3592ea31?w=300","https://images.unsplash.com/photo-1688907487499-5109d7d14bfa?w=300","https://images.unsplash.com/photo-1648090327601-36dc97fed197?w=300","https://images.unsplash.com/photo-1648090326716-14e01e43da03?w=300","https://images.unsplash.com/photo-1648090326914-fcf7ad3f5aa1?w=300","https://images.unsplash.com/photo-1631932392715-dfed5d0e9332?w=300","https://images.unsplash.com/photo-1630163664826-16147bbdbb65?w=300","https://images.unsplash.com/photo-1630163670776-0f64ec1acf1d?w=300","https://images.unsplash.com/photo-1545041587-ccd03e26b580?w=300"];
const ImageBand6 = ["https://images.unsplash.com/photo-1633657324109-d031bd981583?w=300","https://images.unsplash.com/photo-1633657322204-cfbe7f9f803a?w=300","https://images.unsplash.com/photo-1635125293454-695c272749a7?w=300","https://images.unsplash.com/photo-1630163671229-07fdcf23ba71?w=300","https://images.unsplash.com/photo-1597522888503-a8ebde1da97d?w=300","https://images.unsplash.com/photo-1688907487658-56175bfee35a?w=300","https://images.unsplash.com/photo-1651107466227-1a7100432973?w=300","https://images.unsplash.com/photo-1649730845235-050a47af7c33?w=300","https://images.unsplash.com/photo-1648090320060-d4c61f30fb18?w=300","https://images.unsplash.com/photo-1648090319890-62e6ce986438?w=300"];
const ImageBand7 = ["https://images.unsplash.com/photo-1635989198295-76680f9ce67a?w=300","https://images.unsplash.com/photo-1635301443938-d95a891d46b7?w=300","https://images.unsplash.com/photo-1648090272846-316807cd80c2?w=300","https://images.unsplash.com/photo-1635989193974-102e31f3db9b?w=300","https://images.unsplash.com/photo-1635989194850-9349356f9d3d?w=300","https://images.unsplash.com/photo-1688907487543-43bcab100449?w=300","https://images.unsplash.com/photo-1635989197685-19d50a475348?w=300","https://images.unsplash.com/photo-1633657322446-ed5784d121e4?w=300","https://images.unsplash.com/photo-1553918926-1fbf8e38d53b?w=300"];
const ImageBand8 = ["https://images.unsplash.com/photo-1688907486206-2f6244413e61?w=300","https://images.unsplash.com/photo-1648090329178-7f3e54ceea9c?w=300","https://images.unsplash.com/photo-1648090328368-93633744e952?w=300","https://images.unsplash.com/photo-1648090317720-d61e2ec5adb4?w=300","https://images.unsplash.com/photo-1648090317938-efbe4e792ba9?w=300","https://images.unsplash.com/photo-1635989197697-5596cc9a9a6c?w=300","https://images.unsplash.com/photo-1632681179698-35ac572f6510?w=300","https://images.unsplash.com/photo-1633657321411-b8fbeb8c6adb?w=300","https://images.unsplash.com/photo-1535378181097-9cf5e853b572?w=300","https://images.unsplash.com/photo-1665264343390-4ebd4a7731d0?w=300","https://images.unsplash.com/photo-1648090319893-1d3a26d80627?w=300","https://images.unsplash.com/photo-1648090319889-73787d9b3f14?w=300","https://images.unsplash.com/photo-1630163664483-9ee845d40a63?w=300"];

const ALL_BANDS = [ImageBand1, ImageBand2, ImageBand3, ImageBand4, ImageBand5, ImageBand6, ImageBand7, ImageBand8];

const bandConfigs = [
  { offsetY: -110, speed: 1.0,  rotation: 7 * Math.PI / 180, rotationType: "fromLeft",   name: "Haut 1",      curveAmount: 40.0, curveDirection: 1 },
  { offsetY: -330, speed: 1.3,  rotation: 7 * Math.PI / 180, rotationType: "fromCenter", name: "Haut 2",      curveAmount: 35.0, curveDirection: 1 },
  { offsetY: -440, speed: 1.6,  rotation: 7 * Math.PI / 180, rotationType: "fromLeft",   name: "Centre Haut", curveAmount: 40.0, curveDirection: 1 },
  { offsetY: -220, speed: 0.7,  rotation: 7 * Math.PI / 180, rotationType: undefined,     name: "Centrale",    curveAmount: 40.0, curveDirection: 1 },
  { offsetY: 0,    speed: 0.4,  rotation: 7 * Math.PI / 180, rotationType: undefined,     name: "Centre Bas",  curveAmount: 40.0, curveDirection: 1 },
  { offsetY: 110,  speed: 1.2,  rotation: 7 * Math.PI / 180, rotationType: undefined,     name: "Bas 1",       curveAmount: 40.0, curveDirection: 1 },
  { offsetY: 220,  speed: 0.8,  rotation: 7 * Math.PI / 180, rotationType: undefined,     name: "Bas 2",       curveAmount: 40.0, curveDirection: 1 },
  { offsetY: 330,  speed: 1.4,  rotation: 7 * Math.PI / 180, rotationType: undefined,     name: "Très Bas",    curveAmount: 40.0, curveDirection: 1 },
];

// ─────────────────────────────────────────────
// Shaders (verbatim from original)
// ─────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTextureWidth;
  uniform float uSequenceWidth;
  uniform float uBandHeight;
  uniform float uScroll;
  uniform float uSpeed;
  uniform float uOffsetY;
  uniform float uRotation;
  uniform float uRotationType;
  uniform float uHasRotation;
  uniform float uBandIndex;
  uniform float uCurveAmount;
  uniform float uCurveDirection;
  uniform float uTime;
  varying vec2 vUv;

  mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec2 pixelCoord = vUv * uResolution;
    vec2 originalPixelCoord = pixelCoord;

    float normalizedX = pixelCoord.x / uResolution.x;
    float curveFactor = 4.0 * (normalizedX - 0.5) * (normalizedX - 0.5);
    float curveOffset = (0.5 - curveFactor) * uCurveAmount * uCurveDirection;

    float bandTopBase = (uResolution.y - uBandHeight) * 0.5 + uOffsetY;
    float bandTop = bandTopBase + curveOffset;
    float bandBottom = bandTop + uBandHeight;
    float bandCenterY = bandTopBase + (uBandHeight * 0.5);

    if (uHasRotation > 0.5) {
      vec2 rotationCenter;
      if (uRotationType > 0.5) {
        rotationCenter = vec2(0.0, bandCenterY);
      } else {
        rotationCenter = vec2(uResolution.x * 0.5, bandCenterY);
      }
      pixelCoord -= rotationCenter;
      pixelCoord = rotate2d(uRotation) * pixelCoord;
      pixelCoord += rotationCenter;
      originalPixelCoord -= rotationCenter;
      originalPixelCoord = rotate2d(uRotation) * originalPixelCoord;
      originalPixelCoord += rotationCenter;
      vec2 rotatedBandTop = vec2(0.0, bandTop);
      vec2 rotatedBandBottom = vec2(0.0, bandBottom);
      rotatedBandTop -= rotationCenter;
      rotatedBandTop = rotate2d(uRotation) * rotatedBandTop;
      rotatedBandTop += rotationCenter;
      rotatedBandBottom -= rotationCenter;
      rotatedBandBottom = rotate2d(uRotation) * rotatedBandBottom;
      rotatedBandBottom += rotationCenter;
      bandTop = min(rotatedBandTop.y, rotatedBandBottom.y);
      bandBottom = max(rotatedBandTop.y, rotatedBandBottom.y);
    }

    float margin = 3.0;
    if (pixelCoord.y < bandTop - margin || pixelCoord.y > bandBottom + margin) {
      discard; return;
    }

    float scrollPos = uScroll * uSpeed;
    float wrappedX = mod(originalPixelCoord.x + scrollPos, uSequenceWidth);
    float cloneIndex = 1.0;
    float textureX = (wrappedX + (cloneIndex * uSequenceWidth)) / uTextureWidth;
    float texY = (pixelCoord.y - bandTop) / (bandBottom - bandTop);

    if (textureX < 0.0 || textureX > 1.0 || texY < 0.0 || texY > 1.0) {
      discard; return;
    }

    vec4 color = texture2D(uTexture, vec2(textureX, texY));
    if (color.a < 0.5) { discard; return; }

    float edge = min(pixelCoord.y - bandTop, bandBottom - pixelCoord.y);
    if (edge < margin) { color.a *= smoothstep(0.0, margin, edge); }
    if (color.a < 0.01) { discard; return; }

    float hueShift = uBandIndex * 0.1;
    color.r *= (1.0 + sin(hueShift) * 0.02);
    color.g *= (1.0 + sin(hueShift + 2.094) * 0.02);
    color.b *= (1.0 + sin(hueShift + 4.188) * 0.02);
    gl_FragColor = color;
  }
`;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatRatio(ratio) {
  const commonRatios = [
    { value: 1.5, text: "3:2", tolerance: 0.05 },
    { value: 1.333, text: "4:3", tolerance: 0.02 },
    { value: 1.777, text: "16:9", tolerance: 0.02 },
    { value: 1.0, text: "1:1", tolerance: 0.01 },
    { value: 0.667, text: "2:3", tolerance: 0.02 },
  ];
  for (const c of commonRatios) {
    if (Math.abs(ratio - c.value) < c.tolerance) return c.text;
  }
  return ratio.toFixed(2) + ":1";
}

function createFallbackCanvas(imgIndex, bandIndex, ratio) {
  const targetH = IMAGE_HEIGHT;
  let targetW = Math.round(targetH * ratio);
  if (targetW > MAX_IMAGE_WIDTH) { targetW = MAX_IMAGE_WIDTH; }
  const cvs = document.createElement("canvas");
  cvs.width = targetW; cvs.height = targetH;
  const ctx = cvs.getContext("2d");
  const bandColors = ["hsl(210,70%,60%)","hsl(180,70%,60%)","hsl(150,70%,60%)","hsl(120,70%,60%)","hsl(90,70%,60%)","hsl(60,70%,60%)","hsl(30,70%,60%)","hsl(0,70%,60%)"];
  ctx.fillStyle = bandColors[bandIndex] || "hsl(0,0%,70%)";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.fillStyle = "white";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`B${bandIndex + 1}`, targetW / 2, targetH / 2 - 10);
  ctx.fillText(`Img ${imgIndex + 1}`, targetW / 2, targetH / 2 + 10);
  return cvs;
}

function loadImagesForBand(bandIndex, count) {
  return new Promise((resolve) => {
    const urls = ALL_BANDS[bandIndex] || [];
    const results = [];
    let done = 0;

    const finish = (i, imgEl, w, h, ratio) => {
      results[i] = { loaded: true, img: imgEl, width: w, height: h, ratio, displayRatio: formatRatio(ratio) };
      if (++done === count) resolve(results);
    };

    for (let i = 0; i < count; i++) {
      results[i] = null;
      const img = new Image();
      img.crossOrigin = "anonymous";
      const idx = i;

      img.onload = () => {
        const orig = img.naturalWidth / img.naturalHeight;
        let tw = Math.round(IMAGE_HEIGHT * orig);
        let th = IMAGE_HEIGHT;
        if (tw > MAX_IMAGE_WIDTH) { tw = MAX_IMAGE_WIDTH; th = Math.round(tw / orig); }
        finish(idx, img, tw, th, orig);
      };
      img.onerror = () => {
        const fallbackRatios = [1.5, 1.333, 1.777, 1.0, 0.75];
        const ratio = fallbackRatios[Math.floor(Math.random() * fallbackRatios.length)];
        let tw = Math.round(IMAGE_HEIGHT * ratio);
        let th = IMAGE_HEIGHT;
        if (tw > MAX_IMAGE_WIDTH) { tw = MAX_IMAGE_WIDTH; th = Math.round(tw / ratio); }
        const cvs = createFallbackCanvas(idx, bandIndex, ratio);
        finish(idx, cvs, tw, th, ratio);
      };

      if (urls[i]) {
        const url = new URL(urls[i]);
        url.searchParams.set("auto", "format");
        url.searchParams.set("fit", "crop");
        img.src = url.toString();
      } else {
        img.src = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/400/300`;
      }
    }
  });
}

function buildBandCanvas(images) {
  let seqW = 0;
  for (const info of images) {
    if (info?.loaded) seqW += info.width + IMAGE_GAP;
  }
  seqW -= IMAGE_GAP;
  const totalW = seqW * CLONE_COUNT;
  const cvs = document.createElement("canvas");
  cvs.width = totalW; cvs.height = BAND_HEIGHT;
  const ctx = cvs.getContext("2d");
  ctx.clearRect(0, 0, totalW, BAND_HEIGHT);
  let x = 0;
  for (let clone = 0; clone < CLONE_COUNT; clone++) {
    for (const info of images) {
      if (!info?.loaded) continue;
      const cy = (BAND_HEIGHT - info.height) / 2;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(info.img, x, cy, info.width, info.height);
      ctx.restore();
      x += info.width + IMAGE_GAP;
    }
  }
  return { canvas: cvs, totalWidth: totalW, sequenceWidth: seqW };
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function InfiniteImageBands() {
  const mountRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const totalImages = IMAGES_PER_BAND.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Three.js setup ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Scroll state ────────────────────────────────────────────────────
    let scrollY = 0;
    let targetScrollY = 0;
    let scrollVelocity = 0;
    let isDragging = false;
    let lastPointerY = 0;
    const INERTIA = 0.92;

    // ── Materials & meshes ──────────────────────────────────────────────
    const materials = [];
    const meshes = [];
    let animFrameId = null;

    // ── Load all bands ──────────────────────────────────────────────────
    let loadedSoFar = 0;

    const bandPromises = bandConfigs.map((config, bandIndex) =>
      loadImagesForBand(bandIndex, IMAGES_PER_BAND[bandIndex]).then((images) => {
        loadedSoFar += images.length;
        setLoadedCount(loadedSoFar);
        setLoadProgress(Math.round((loadedSoFar / totalImages) * 100));
        const { canvas, totalWidth, sequenceWidth } = buildBandCanvas(images);
        return { bandIndex, config, canvas, totalWidth, sequenceWidth };
      })
    );

    Promise.all(bandPromises).then((results) => {
      results.forEach(({ bandIndex, config, canvas, totalWidth, sequenceWidth }) => {
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uResolution:    { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            uTexture:       { value: texture },
            uTextureWidth:  { value: totalWidth },
            uSequenceWidth: { value: sequenceWidth },
            uBandHeight:    { value: BAND_HEIGHT },
            uScroll:        { value: 0 },
            uSpeed:         { value: config.speed },
            uOffsetY:       { value: config.offsetY },
            uRotation:      { value: config.rotation },
            uRotationType:  { value: config.rotationType === "fromLeft" ? 1.0 : 0.0 },
            uHasRotation:   { value: config.rotation !== 0 ? 1.0 : 0.0 },
            uBandIndex:     { value: bandIndex },
            uCurveAmount:   { value: config.curveAmount },
            uCurveDirection:{ value: config.curveDirection },
            uTime:          { value: 0 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          alphaTest: 0.5,
        });

        materials.push(material);
        const geo = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geo, material);
        mesh.position.z = bandIndex * -0.1;
        scene.add(mesh);
        meshes.push(mesh);
      });

      setIsLoaded(true);

      // ── Animate ───────────────────────────────────────────────────────
      const tick = () => {
        animFrameId = requestAnimationFrame(tick);

        // inertia
        if (!isDragging) {
          targetScrollY += scrollVelocity;
          scrollVelocity *= INERTIA;
          if (Math.abs(scrollVelocity) < 0.5) scrollVelocity = 0;
        }
        const smoothing = isDragging ? 0.3 : 0.1;
        scrollY += (targetScrollY - scrollY) * smoothing;

        materials.forEach((mat) => {
          mat.uniforms.uScroll.value = scrollY;
          mat.uniforms.uTime.value += 0.016;
          mat.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
        });

        renderer.render(scene, camera);
      };
      tick();
    });

    // ── Events ──────────────────────────────────────────────────────────
    const onWheel = (e) => {
      e.preventDefault();
      targetScrollY += e.deltaY;
      scrollVelocity = e.deltaY * 0.15;
    };

    const onMouseDown = (e) => {
      isDragging = true;
      lastPointerY = e.clientY;
      scrollVelocity = 0;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dy = e.clientY - lastPointerY;
      targetScrollY += dy * 2.0;
      lastPointerY = e.clientY;
      scrollVelocity = dy * 0.25;
    };
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e) => {
      e.preventDefault();
      lastPointerY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const dy = e.touches[0].clientY - lastPointerY;
      targetScrollY += dy * 2.5;
      lastPointerY = e.touches[0].clientY;
      scrollVelocity = dy * 0.3;
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); targetScrollY -= 50; scrollVelocity = -8; }
      if (e.key === "ArrowLeft")  { e.preventDefault(); targetScrollY += 50; scrollVelocity = 8; }
      if (e.key === " ")          { e.preventDefault(); scrollVelocity = -scrollVelocity * 1.5; }
    };

    const onDblClick = () => { targetScrollY = 0; scrollVelocity = 0; };

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      materials.forEach((mat) => {
        mat.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
      });
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("dblclick", onDblClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);

      meshes.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry?.dispose();
        if (mesh.material?.uniforms?.uTexture) mesh.material.uniforms.uTexture.value.dispose();
        mesh.material?.dispose();
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);

      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a1a2a] select-none">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl px-8 py-6 text-center shadow-2xl min-w-[200px]">
            <p className="text-sm font-medium text-gray-700 mb-3 tabular-nums">
              Loading… {loadedCount}/{totalImages}
            </p>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 rounded-full transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Top-left credit */}
      <div className="absolute top-5 left-5 z-10 bg-white/90 text-black text-xs px-3 py-2 rounded">
        &Toc
      </div>

      {/* Bottom-left photo credit */}
      <div className="absolute bottom-5 left-5 z-10 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        Photo by{" "}
        <a
          href="https://unsplash.com/fr/@abstralofficial"
          target="_blank"
          rel="noopener nofollow"
          className="text-[#ddc2b5] hover:underline"
        >
          Abstral Official
        </a>{" "}
        on Unsplash
      </div>

      {/* Hint tooltip */}
      {showHint && isLoaded && (
        <button
          onClick={() => setShowHint(false)}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 bg-white text-black text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          scroll · drag · ← → arrows · click to hide
        </button>
      )}

      {/* Fullscreen button */}
      <button
        aria-label="Toggle fullscreen"
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }}
        className="absolute bottom-5 right-5 z-10 w-11 h-11 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/20 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>
    </div>
  );
}