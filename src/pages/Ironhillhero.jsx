/**
 * IronhillHero.jsx
 *
 * Required packages:
 *   npm install three gsap
 *   (lenis is already in your project)
 *
 * Pass your existing Lenis instance as a prop:
 *   <IronhillHero lenis={lenisInstance} />
 *
 * ScrollTrigger needs to know Lenis is driving scroll.
 * Make sure your root-level Lenis setup already calls:
 *   lenis.on('scroll', ScrollTrigger.update)
 * OR pass the instance here and this component does it.
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform vec2  uResolution;
  uniform vec3  uColor;
  uniform float uSpread;
  varying vec2  vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }
  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)), f.x),
      mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.;
    v += noise(p * 1.0) * 0.500;
    v += noise(p * 2.0) * 0.250;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2  uv           = vUv;
    float aspect       = uResolution.x / uResolution.y;
    vec2  centeredUv   = (uv - 0.5) * vec2(aspect, 1.0);
    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue   = fbm(centeredUv * 15.0);
    float d            = dissolveEdge + noiseValue * uSpread;
    float px           = 1.0 / uResolution.y;
    float alpha        = 1.0 - smoothstep(-px, px, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG = {
  color:  '#ebf5df',
  spread: 0.5,
  speed:  1,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r
    ? { r: parseInt(r[1], 16) / 255, g: parseInt(r[2], 16) / 255, b: parseInt(r[3], 16) / 255 }
    : { r: 0.92, g: 0.96, b: 0.87 }
}

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/)
  el.innerHTML = words
    .map(w => `<span class="split-word" style="display:inline-block;opacity:0;margin-right:0.25em;white-space:nowrap;">${w}</span>`)
    .join('')
  return Array.from(el.querySelectorAll('.split-word'))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function IronhillHero({ lenis }) {
  const heroRef      = useRef(null)
  const canvasRef    = useRef(null)
  const h2Ref        = useRef(null)
  const twigLeftRef  = useRef(null)
  const twigRightRef = useRef(null)

  // Re-run if lenis arrives after first mount (common with context patterns)
  useEffect(() => {
    const hero   = heroRef.current
    const canvas = canvasRef.current
    const h2     = h2Ref.current
    if (!hero || !canvas || !h2) return

    // ── Tell ScrollTrigger to use Lenis' scroll position ─────────────────────
    // This is the critical fix: without this, ST reads native scrollY = 0.
    if (lenis) {
      gsap.ticker.add((time) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)
      lenis.on('scroll', ScrollTrigger.update)
    }

    // ── Three.js setup ────────────────────────────────────────────────────────
    const scene    = new THREE.Scene()
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })

    const rgb      = hexToRgb(CONFIG.color)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress:   { value: 0 },
        uResolution: { value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight) },
        uColor:      { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread:     { value: CONFIG.spread },
      },
      transparent: true,
    })

    scene.add(new THREE.Mesh(geometry, material))

    // ── Resize ────────────────────────────────────────────────────────────────
    const resize = () => {
      const w = hero.offsetWidth
      const h = hero.offsetHeight
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      material.uniforms.uResolution.value.set(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Render loop ───────────────────────────────────────────────────────────
    let scrollProgress = 0
    let rafId
    const animate = () => {
      material.uniforms.uProgress.value = scrollProgress
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    // ── Scroll → shader progress ──────────────────────────────────────────────
    // Read from Lenis' virtual scroll value, NOT window.scrollY.
    // Lenis intercepts native scroll so window.scrollY stays at 0.
    const onScroll = ({ scroll }) => {
      const heroHeight  = hero.offsetHeight
      const maxScroll   = heroHeight - window.innerHeight
      scrollProgress    = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1)
    }
    if (lenis) {
      lenis.on('scroll', onScroll)
    } else {
      // Fallback: native scroll (if Lenis not passed)
      const onNativeScroll = () => {
        const heroHeight = hero.offsetHeight
        const maxScroll  = heroHeight - window.innerHeight
        scrollProgress   = Math.min((window.scrollY / maxScroll) * CONFIG.speed, 1.1)
      }
      window.addEventListener('scroll', onNativeScroll)
    }

    // ── Word-fade on scroll ───────────────────────────────────────────────────
    const words = splitWords(h2)

    ScrollTrigger.create({
      trigger:  h2Ref.current.closest('.hero__content'),
      start:    'top 25%',
      end:      'bottom 100%',
      onUpdate: (self) => {
        const progress   = self.progress
        const totalWords = words.length
        words.forEach((word, i) => {
          const wp  = i       / totalWords
          const nwp = (i + 1) / totalWords
          let opacity = 0.1
          if (progress >= nwp)       opacity = 1
          else if (progress >= wp)   opacity = (progress - wp) / (nwp - wp)
          gsap.to(word, { opacity, duration: 0.1, overwrite: true })
        })
      },
    })

    // ── Twig parallax ─────────────────────────────────────────────────────────
    gsap.to(twigLeftRef.current, {
      y: -2000, ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to(twigRightRef.current, {
      y: -3500, ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    // ── Intro animations ──────────────────────────────────────────────────────
    gsap.from('.hero__top h1', { y: 60, opacity: 0, duration: 1.6, ease: 'power3.out', delay: 0.2 })
    gsap.from('.hero__top p',  { y: 30, opacity: 0, duration: 1.0, ease: 'power2.out', delay: 1.0 })

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update)
        lenis.off('scroll', onScroll)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      window.removeEventListener('resize', resize)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [lenis]) // ← depend on lenis so effect re-runs once instance is available

  return (
    <div className="min-w-[320px] bg-[#0f0f0f]">
      <section ref={heroRef} className="hero relative text-[#ebf5df] overflow-hidden">

        {/* Twigs */}
        <div className="absolute inset-0 z-[5] w-full h-full pointer-events-none">
          <img
            ref={twigLeftRef}
            className="absolute z-[5] bottom-[20%] left-0 w-[min(700px,60vw)]"
            src="https://images.unsplash.com/photo-1542382156834-e56ccfe3b7e2?w=700&auto=format&fit=crop&q=80&sat=-100"
            alt=""
          />
          <img
            ref={twigRightRef}
            className="absolute z-[5] bottom-[10%] right-0 w-[min(800px,65vw)]"
            src="https://images.unsplash.com/photo-1572979946575-10e15c41e8f5?w=800&auto=format&fit=crop&q=80&sat=-100"
            alt=""
          />
        </div>

        {/* Row — sets the tall scroll height */}
        <div className="relative w-full" style={{ height: '185vh' }}>

          {/* BG photo */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1499428665502-503f6c608263?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ironhill landscape"
          />

          {/* Shader canvas — sits above the photo, dissolves to reveal h2 */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
          />

          {/* UI layer */}
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>

            {/* Title */}
            <div className="hero__top absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center h-screen">
              <h1
                className="font-light leading-[0.9] tracking-[4px] m-0 text-[#ebf5df]"
                style={{ fontSize: 'clamp(80px, 16vw, 240px)' }}
              >
                IRONHILL
              </h1>
              <p
                className="uppercase font-medium tracking-[4px] mt-3"
                style={{ fontSize: '13px', color: 'rgba(235,245,223,0.55)', fontFamily: 'sans-serif' }}
              >
                A place the maps won't show
              </p>
            </div>

            {/* Pull-quote — revealed by shader dissolve */}
            <div
              className="hero__content absolute bottom-0 flex items-center justify-center text-center w-full px-6"
              style={{ height: '125vh' }}
            >
              <h2
                ref={h2Ref}
                className="uppercase font-light m-0 leading-snug tracking-wide"
                style={{
                  fontSize: 'clamp(22px, 3.5vw, 48px)',
                  color: '#0f0f0f',
                  maxWidth: '900px',
                  // critical: let words wrap naturally
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                }}
              >
                There's a place not far from here the maps won't show, known to some as the Ironhill.
              </h2>
            </div>

          </div>
        </div>
      </section>

      <div className="flex items-center justify-center bg-[#0f0f0f]" style={{ height: '50vh' }}>
        <p
          className="uppercase tracking-[4px]"
          style={{ fontSize: '13px', color: 'rgba(235,245,223,0.25)', fontFamily: 'sans-serif' }}
        >
          Beyond the Ironhill
        </p>
      </div>
    </div>
  )
}