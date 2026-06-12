import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ── Slide Data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    title: ["Amur", "Leopard"],
    status: "Critically Endangered",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/leopard2.jpg",
  },
  {
    id: 1,
    title: ["Asiatic", "Lion"],
    status: "Endangered",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/lion2.jpg",
  },
  {
    id: 2,
    title: ["Siberian", "Tiger"],
    status: "Endangered",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/tiger2.jpg",
  },
  {
    id: 3,
    title: ["Brown", "Bear"],
    status: "Least Concern",
    src: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/bear2.jpg",
  },
];

// ── GLSL Shaders ─────────────────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D currentImage;
  uniform sampler2D nextImage;
  uniform float dispFactor;
  uniform vec4 res;

  void main() {
    vec2 rs = res.xy;
    vec2 imageRes = res.zw;
    
    vec2 ratio = vec2(
      min((rs.x / rs.y) / (imageRes.x / imageRes.y), 1.0),
      min((rs.y / rs.x) / (imageRes.y / imageRes.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    float intensity = 0.3;
    vec4 orig1 = texture2D(currentImage, uv);
    vec4 orig2 = texture2D(nextImage, uv);
    vec4 _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2.r * intensity)));
    vec4 _nextImage    = texture2D(nextImage,    vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1.r * intensity)));
    gl_FragColor = mix(_currentImage, _nextImage, dispFactor);
  }
`;

// ── Main Component ────────────────────────────────────────────────────────────
export default function DisplacementSlider() {
  const mountRef   = useRef(null);
  const titleRef   = useRef(null);
  const statusRef  = useRef(null);
  const matRef     = useRef(null);
  const textures   = useRef([]);
  const animating  = useRef(false);

  const [current, setCurrent]   = useState(0);
  const [loaded, setLoaded]     = useState(false);
  const [displayData, setDisplayData] = useState(SLIDES[0]);

  // ── Three.js Setup ──────────────────────────────────────────────────────
  useEffect(() => {
    const parent = mountRef.current;
    if (!parent) return;

    const renderW = window.innerWidth;
    const renderH = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x23272a, 1.0);
    renderer.setSize(renderW, renderH);
    parent.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x23272a);

    const camera = new THREE.OrthographicCamera(
      renderW / -2, renderW / 2,
      renderH / 2,  renderH / -2,
      1, 1000
    );
    camera.position.z = 1;

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    let loaded = 0;
    const sliderTextures = [];

    SLIDES.forEach((slide, i) => {
      const tex = loader.load(slide.src + "?v=" + Date.now(), (loadedTex) => {
        if (i === 0 && matRef.current) {
          matRef.current.uniforms.res.value.z = loadedTex.image.width;
          matRef.current.uniforms.res.value.w = loadedTex.image.height;
        }
        loaded++;
        if (loaded === SLIDES.length) setLoaded(true);
      });
      tex.magFilter = tex.minFilter = THREE.LinearFilter;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sliderTextures.push(tex);
    });
    textures.current = sliderTextures;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        dispFactor:   { value: 0.0 },
        currentImage: { value: sliderTextures[0] },
        nextImage:    { value: sliderTextures[1] },
        res:          { value: new THREE.Vector4(renderW, renderH, 1920, 1080) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      opacity: 1.0,
    });
    matRef.current = mat;

    const geometry = new THREE.PlaneGeometry(renderW, renderH, 1);
    const mesh     = new THREE.Mesh(geometry, mat);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(w, h, 1);
      
      if (matRef.current) {
        matRef.current.uniforms.res.value.x = w;
        matRef.current.uniforms.res.value.y = h;
      }
    };
    window.addEventListener("resize", onResize);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      window.removeEventListener("resize", onResize);
      if (parent.contains(renderer.domElement)) parent.removeChild(renderer.domElement);
    };
  }, []);

  // ── Slide Transition ────────────────────────────────────────────────────
  const goToSlide = (slideId) => {
    if (animating.current || slideId === current) return;
    animating.current = true;

    const mat = matRef.current;
    mat.uniforms.nextImage.value = textures.current[slideId];
    mat.uniforms.nextImage.needsUpdate = true;

    gsap.to(mat.uniforms.dispFactor, {
      value: 1,
      duration: 1,
      ease: "expo.inOut",
      onComplete: () => {
        mat.uniforms.currentImage.value = textures.current[slideId];
        mat.uniforms.currentImage.needsUpdate = true;
        mat.uniforms.dispFactor.value = 0.0;
        animating.current = false;
        setCurrent(slideId);
      },
    });

    // Animate title out → swap → in
    gsap.fromTo(
      titleRef.current,
      { autoAlpha: 1, y: 0 },
      {
        autoAlpha: 0, y: 20, duration: 0.5, ease: "expo.in",
        onComplete: () => {
          setDisplayData(SLIDES[slideId]);
          gsap.to(titleRef.current, { autoAlpha: 1, y: 0, duration: 0.5 });
        },
      }
    );

    gsap.fromTo(
      statusRef.current,
      { autoAlpha: 1, y: 0 },
      {
        autoAlpha: 0, y: 20, duration: 0.5, ease: "expo.in",
        onComplete: () => {
          gsap.to(statusRef.current, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.1 });
        },
      }
    );
  };

  return (
    <>
      {/* Google Font — Playfair Display as stand-in for acta-display */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Barlow:wght@300;400&display=swap"
      />

      {/* Loading overlay */}
      {!loaded && (
        <div className="fixed inset-0 z-[100000] bg-black flex items-center justify-center">
          <div
            className="w-[60px] h-[60px] rounded-full bg-white opacity-40"
            style={{ animation: "loaderAnim 0.7s linear infinite alternate" }}
          />
          <style>{`
            @keyframes loaderAnim {
              to { opacity: 1; transform: scale3d(0.5, 0.5, 1); }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <header
        className="absolute top-0 left-0 w-full h-[115px] z-10"
        style={{
          backgroundImage: "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/menutexture.png)",
          backgroundPosition: "center top",
          backgroundSize: "auto 200px",
          backgroundRepeat: "repeat-x",
        }}
      >
        <div className="max-w-[1060px] mx-auto flex h-[70px] items-center justify-center relative">
          {/* Logo */}
          <div className="absolute top-0 left-0 w-[76px] h-[90px] bg-white text-center flex justify-center">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123024/wwf-logo.png"
              className="w-[45px] mt-[10px] object-contain"
              alt="WWF Logo"
            />
          </div>

          {/* Burger — mobile only */}
          <div
            className="md:hidden relative pl-[30px] top-[-6px] before:content-[''] before:absolute before:left-0 before:top-0 before:w-[30px] before:h-[2px] before:bg-white before:shadow-[0_12px_0_0_white,0_6px_0_0_white]"
          />

          {/* Nav */}
          <nav className="hidden md:block">
            {["Species", "About Us", "Our Work", "Get Involved"].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`font-['Barlow'] text-[12px] uppercase tracking-[3px] no-underline mx-[18px] transition-colors ${
                  i === 0 ? "text-white" : "text-[#8c8c8e] hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Donate */}
          <a
            href="#"
            className="absolute right-[10px] top-[27px] w-[72px] text-center font-['Barlow'] text-[12px] text-white uppercase tracking-[3px] no-underline pb-[6px] border-b-2 border-white/30"
          >
            Donate
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative w-full h-screen overflow-hidden bg-[#23272A]">
        {/* Three.js canvas mount */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full z-0 [&>canvas]:w-full [&>canvas]:h-full"
        />

        {/* Slider Content */}
        <div className="relative w-full max-w-[1060px] h-full mx-auto flex items-center z-[5]">
          <div className="px-[10px]">
            <div
              className="inline-block font-['Barlow'] text-[11px] md:text-[13px] tracking-[5px] text-[#88888a] uppercase relative
                after:content-[''] after:absolute after:top-[5px] after:right-[-55px] after:w-[45px] after:h-[2px] after:bg-[#393d40]"
            >
              Species
            </div>

            <div ref={titleRef}>
              <h2
                className="font-['Playfair_Display'] font-normal text-[30px] md:text-[110px] tracking-[-1px] text-white leading-[30px] md:leading-[100px] mt-[20px] mb-[60px]"
              >
                {displayData.title[0]}
                <br />
                {displayData.title[1]}
              </h2>
            </div>

            <div
              className="inline-block font-['Barlow'] text-[11px] md:text-[13px] tracking-[5px] text-[#88888a] uppercase relative
                after:content-[''] after:absolute after:top-[5px] after:right-[-55px] after:w-[45px] after:h-[2px] after:bg-[#393d40]"
            >
              Status
            </div>

            <div
              ref={statusRef}
              className="mt-[10px] font-['Playfair_Display'] font-normal text-[18px] md:text-[34px] text-white"
            >
              {displayData.status}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="absolute top-1/2 -translate-y-1/2 right-[30px] z-[6]">
          {SLIDES.map((slide) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(slide.id)}
              className={`
                block appearance-none border-0 w-[16px] h-[16px] bg-white rounded-full p-0 my-[30px] cursor-pointer relative
                transition-opacity duration-200 outline-none
                before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                before:rounded-full before:border before:border-white/20 before:transition-all before:duration-400
                ${
                  current === slide.id
                    ? "opacity-100 before:w-[300%] before:h-[300%] before:opacity-100"
                    : "opacity-20 hover:opacity-50 before:w-full before:h-full before:opacity-0"
                }
              `}
              aria-label={`Go to slide ${slide.id + 1}`}
            />
          ))}
        </div>
      </main>
    </>
  );
}