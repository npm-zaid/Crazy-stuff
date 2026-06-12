import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Data ─────────────────────────────────────────────────────────────────────
const IMAGES = [
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c71c61f6db7df2e5218bc_collections-oranith-1.webp",
    title: "Image 1",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c71c6bd8971b3e73ee7c8_collections-anturax-1.webp",
    title: "Image 2",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c71c6648fdd5236d5b972_collections-oranith-2.webp",
    title: "Image 3",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c71c67e1e5c7edbcc0c3f_collections-anturax-3.webp",
    title: "Image 4",
  },
];

const THUMBNAILS = [
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c7c7c41d8916da35baa9c_card-Oraniths-1.webp",
    title: "Image 1",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c7c7c65d779e7cfe7a75a_card-anturax-1.webp",
    title: "Image 2",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c7c7c5225fefdd3302e57_card-Oraniths-2.webp",
    title: "Image 3",
  },
  {
    url: "https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/682c7c7c8c0dbe0a8563fe55_card-anturax-3.webp",
    title: "Image 4",
  },
];

const PIXELS = new Float32Array(
  [
    1, 1.5, 2, 2.5, 3, 1, 1.5, 2, 2.5, 3, 3.5, 4, 2, 2.5, 3, 3.5, 4, 4.5, 5,
    5.5, 6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 20, 100,
  ].map((v) => v / 100)
);

// ── Shaders ───────────────────────────────────────────────────────────────────
const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = `
  uniform float uTime;
  uniform vec3 uFillColor;
  uniform float uProgress;
  uniform float uType;
  uniform float uPixels[36];
  uniform vec2 uTextureSize;
  uniform vec2 uElementSize;
  uniform sampler2D uTexture;
  varying vec2 vUv;

  float quadraticInOut(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
  }

  void main() {
    vec2 uv = vUv - vec2(0.5);
    float aspect1 = uTextureSize.x / uTextureSize.y;
    float aspect2 = uElementSize.x / uElementSize.y;
    if (aspect1 > aspect2) { uv *= vec2(aspect2 / aspect1, 1.); }
    else { uv *= vec2(1., aspect1 / aspect2); }
    uv += vec2(0.5);

    if (uType == 3.0) {
      float progress = quadraticInOut(1.0 - uProgress);
      float s = 50.0;
      float imageAspect = uTextureSize.x / uTextureSize.y;
      vec2 gridSize = vec2(s, floor(s / imageAspect));

      float v = smoothstep(0.0, 1.0,
        vUv.y
        + sin(vUv.x * 4.0 + progress * 6.0)
          * mix(0.3, 0.1, abs(0.5 - vUv.x)) * 0.5
          * smoothstep(0.0, 0.2, progress)
        + (1.0 - progress * 2.0)
      );
      float mixnewUV = (vUv.x * 3.0 + (1.0 - v) * 50.0) * progress;
      vec2 subUv = mix(uv, floor(uv * gridSize) / gridSize, mixnewUV);

      vec4 color = texture2D(uTexture, subUv);
      color.a = pow(v, 1.0);
      color.rgb = mix(color.rgb, uFillColor,
        smoothstep(0.5, 0.0, abs(0.5 - color.a)) * progress);
      gl_FragColor = color;
    }
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 1.2));
  }
`;

// ── Thumbnail ─────────────────────────────────────────────────────────────────
function Thumbnail({ img, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex justify-center items-center
        w-[74px] h-[105px] cursor-pointer overflow-hidden
        transition-all duration-400 ease-in-out
        ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}
      `}
    >
      <img
        src={img.url}
        alt={img.title}
        className="w-[66px] h-[99px] object-cover"
      />
      {/* Frame overlay */}
      <div
        className={`
          absolute inset-0 w-full h-full bg-cover bg-no-repeat
          transition-opacity duration-400 ease-in-out
          ${active ? "opacity-100" : "opacity-0 hover:opacity-100"}
        `}
        style={{
          backgroundImage:
            'url("https://cdn.prod.website-files.com/675835c7f4ae1fa1a79b3733/6762b98cb5e68f0b74323e61_collection-card-frame.svg")',
        }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ShaderGallery() {
  const wrapperRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const texturesRef = useRef([]);
  const rafRef = useRef(null);

  const activeImageRef = useRef(0);
  const transitionImageRef = useRef(null);
  const progressRef = useRef(1);
  const isAnimatingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  // ── Three.js init ──────────────────────────────────────────────────────────
  const createScene = useCallback(() => {
    const textures = texturesRef.current;
    const active = activeImageRef.current;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:        { value: 0 },
        uFillColor:   { value: new THREE.Color("#000000") },
        uProgress:    { value: 1 },
        uType:        { value: 3 },
        uPixels:      { value: PIXELS },
        uTextureSize: { value: new THREE.Vector2(1, 1) },
        uElementSize: { value: new THREE.Vector2(1, 1) },
        uTexture:     { value: textures[active] },
      },
      transparent: true,
    });

    material.uniforms.uTextureSize.value.set(
      textures[active].image.width,
      textures[active].image.height
    );

    const geometry = new THREE.PlaneGeometry(8.3, 8.3);
    const plane = new THREE.Mesh(geometry, material);
    sceneRef.current.add(plane);
    materialRef.current = material;
  }, []);

  const updateAnimation = useCallback(() => {
    const mat = materialRef.current;
    if (!mat) return;

    if (transitionImageRef.current !== null && isAnimatingRef.current) {
      progressRef.current += 0.015;

      if (
        progressRef.current > 0.1 &&
        mat.uniforms.uTexture.value !== texturesRef.current[transitionImageRef.current]
      ) {
        const tex = texturesRef.current[transitionImageRef.current];
        mat.uniforms.uTexture.value = tex;
        mat.uniforms.uTextureSize.value.set(tex.image.width, tex.image.height);
      }

      if (progressRef.current >= 1) {
        progressRef.current = 1;
        activeImageRef.current = transitionImageRef.current;
        transitionImageRef.current = null;
        isAnimatingRef.current = false;
      }
      mat.uniforms.uProgress.value = progressRef.current;
    }
  }, []);

  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    // Scene / camera / renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(450, 450);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load textures
    const loader = new THREE.TextureLoader();
    let loaded = 0;
    IMAGES.forEach((img, idx) => {
      loader.load(img.url, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        texturesRef.current[idx] = tex;
        loaded++;
        if (loaded === IMAGES.length) {
          createScene();
          // Start render loop
          const loop = () => {
            rafRef.current = requestAnimationFrame(loop);
            updateAnimation();
            renderer.render(scene, camera);
          };
          loop();
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [createScene, updateAnimation]);

  // ── Thumbnail click ────────────────────────────────────────────────────────
  const handleThumbnailClick = useCallback((index) => {
    if (index === activeImageRef.current || isAnimatingRef.current) return;
    transitionImageRef.current = index;
    progressRef.current = 0;
    isAnimatingRef.current = true;
    setActiveIndex(index);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: "#ffdfc4",
        backgroundImage: "url(https://img.blacklead.work/grid.svg)",
      }}
    >
      {/* Outer border ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 464,
          height: 464,
          background: "black",
          clipPath: "circle(50% at 50% 50%)",
        }}
      >
        {/* Gradient halo behind the ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full -z-10"
          style={{
            width: 454,
            height: 454,
            backgroundImage: "linear-gradient(180deg, #ffff82, #f4d2ba00 50%, #e8a5f3)",
          }}
        />

        {/* Canvas clip circle */}
        <div
          ref={wrapperRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{
            width: 450,
            height: 450,
            clipPath: "circle(50% at 50% 50%)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Inner border ring */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: 440,
              height: 440,
              border: "10px solid black",
              clipPath: "circle(50% at 50% 50%)",
              zIndex: 10,
            }}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-5 right-5 flex flex-row gap-2.5">
        {THUMBNAILS.map((img, idx) => (
          <Thumbnail
            key={idx}
            img={img}
            active={activeIndex === idx}
            onClick={() => handleThumbnailClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}