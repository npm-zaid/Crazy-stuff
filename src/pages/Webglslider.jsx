/**
 * WebGLSlider.jsx
 *
 * Required packages:
 *   npm install three gsap splitting imagesloaded
 *
 * Splitting.js is used for char-level splits on index/title.
 * imagesloaded for preload promise.
 *
 * Usage:
 *   import WebGLSlider from './WebGLSlider'
 *   <WebGLSlider />
 *
 * Fonts loaded via @import in your global CSS or index.css:
 *   @import url("https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;700&display=swap");
 *   @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");
 *   import 'splitting/dist/splitting.css'
 *   import 'splitting/dist/splitting-cells.css'
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    index: '01',
    title: 'RETRO',
    description:
      'Your assumptions are your windows on the world. Scrub them off every once in a while, or the light won',
    image: 'https://raw.githubusercontent.com/devloop01/webgl-slider/main/src/img/retro.jpg',
  },
  {
    index: '02',
    title: 'MODERN',
    description:
      'In this modern world it is easy to be complex but difficult to be simple. At least try to keep your mind simple.',
    image: 'https://raw.githubusercontent.com/devloop01/webgl-slider/main/src/img/modern.jpg',
  },
  {
    index: '03',
    title: 'METAL',
    description:
      'You simply have to turn your back on a culture that has gone sterile and dead and get with the program of a living world and the imagination.',
    image: 'https://raw.githubusercontent.com/devloop01/webgl-slider/main/src/img/metal.jpg',
  },
  {
    index: '04',
    title: 'EMOTION',
    description:
      'Every man has his secret sorrows which the world knows not; and often times we call a man cold when he is only sad.',
    image: 'https://raw.githubusercontent.com/devloop01/webgl-slider/main/src/img/emotion.jpg',
  },
]

const BG_COLORS = ['#1f1322', '#27172e', '#454d53', '#2d1f2d']

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uProgDirection;
  uniform float uMouseOverAmp;
  uniform float uRadius;
  uniform vec2 uMeshSize;
  uniform vec2 uMousePos;
  uniform bool uAnimating;
  uniform bool uTranslating;

  float mapVal(in float n,in float start1,in float stop1,in float start2,in float stop2){
    return((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  }

  void main(){
    vec3 pos=position;
    vUv=uv;
    vec2 center=vUv-uMousePos;
    center.x*=uMeshSize.x/uMeshSize.y;
    float dist=length(center);
    float radius=uRadius;
    float mask=smoothstep(radius,radius*5.,dist);
    float d=mapVal(mask,-1.,1.,-1.,0.);
    if(uAnimating){
      pos.z=sin(pos.x*5.+uTime*10.*uProgDirection)*uAmplitude;
      pos.z*=2.5;
    }else{
      pos.z=d*uMouseOverAmp;
      pos.z*=15.;
    }
    if(uTranslating){
      pos.z=sin(pos.y*6.+uTime*10.)*uAmplitude;
      pos.z*=3.5;
    }
    vWave=pos.z;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform float uProg;
  uniform float uProgDirection;
  uniform sampler2D uCurrTex;
  uniform sampler2D uNextTex;
  uniform vec2 uMeshSize;
  uniform vec2 uImageSize;

  vec2 backgroundCoverUv(vec2 uv,vec2 canvasSize,vec2 textureSize){
    vec2 ratio=vec2(
      min((canvasSize.x/canvasSize.y)/(textureSize.x/textureSize.y),1.),
      min((canvasSize.y/canvasSize.x)/(textureSize.y/textureSize.x),1.)
    );
    vec2 uvWithRatio=uv*ratio;
    return vec2(uvWithRatio.x+(1.-ratio.x)*.5,uvWithRatio.y+(1.-ratio.y)*.5);
  }

  void main(){
    vec2 texUv=backgroundCoverUv(vUv,uMeshSize,uImageSize);
    float x=uProg;
    float y;
    if(uProgDirection==1.)y=(x*2.+(vUv.x-1.));
    else y=((x*2.)-vUv.x);
    x=smoothstep(0.,1.,y);
    float w=vWave;
    float r1=texture2D(uCurrTex,texUv+w*.04).r;
    float g1=texture2D(uCurrTex,texUv+w*.01).g;
    float b1=texture2D(uCurrTex,texUv+w*-.03).b;
    vec3 tex1=vec3(r1,g1,b1);
    float r2=texture2D(uNextTex,texUv+w*.04).r;
    float g2=texture2D(uNextTex,texUv+w*.01).g;
    float b2=texture2D(uNextTex,texUv+w*-.03).b;
    vec3 tex2=vec3(r2,g2,b2);
    float scaleUp=(.4+.6*(1.-uProg));
    float scaleDown=(.6+.4*uProg);
    vec4 f1=mix(
      texture2D(uCurrTex,texUv*(1.-x)*scaleUp+vec2(.15)*uProg),
      texture2D(uNextTex,texUv*x*scaleDown),x
    );
    vec3 f2=mix(tex1,tex2,x);
    vec4 final=mix(f1,vec4(f2,1.),.12);
    gl_FragColor=final;
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lerp = (a, b, n) => (1 - n) * a + n * b

function preloadImages(imgs) {
  return Promise.all(
    imgs.map(
      (src) =>
        new Promise((res) => {
          const img = new Image()
          img.onload = res
          img.onerror = res
          img.src = src
        })
    )
  )
}

/** Canvas-based line splitter (no SplitText dependency) */
function splitIntoLines(el) {
  const maxWidth = el.getBoundingClientRect().width
  const style    = getComputedStyle(el)
  const words    = el.innerText.split(' ')
  const lines    = []
  let   curLine  = []

  const canvas  = document.createElement('canvas')
  const ctx     = canvas.getContext('2d')
  ctx.font      = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`

  for (const word of words) {
    curLine.push(word)
    if (ctx.measureText(curLine.join(' ')).width >= maxWidth) {
      const last = curLine.pop()
      lines.push(curLine.join(' '))
      curLine = [last]
    }
  }
  lines.push(curLine.join(' '))

  el.innerHTML = lines
    .map(
      (line) =>
        `<span class="line" style="display:block;overflow:hidden;"><span class="line--innertext" style="display:block;">${line}</span></span>`
    )
    .join('')

  return Array.from(el.querySelectorAll('.line--innertext'))
}

/** Split text into individual char spans (replaces Splitting.js for index/title) */
function splitChars(el) {
  const text = el.innerText
  el.innerHTML = text
    .split('')
    .map((ch) =>
      ch === ' '
        ? `<span style="display:inline-block;width:0.25em;"> </span>`
        : `<span class="char" style="display:inline-block;">${ch}</span>`
    )
    .join('')
  return Array.from(el.querySelectorAll('.char'))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebGLSlider() {
  const containerRef   = useRef(null)
  const canvasRef      = useRef(null)
  const imageWrapRef   = useRef(null)
  const slideInfosRef  = useRef([])
  const navPrevRef     = useRef(null)
  const navNextRef     = useRef(null)
  const cursorLargeRef = useRef(null)
  const cursorSmallRef = useRef(null)
  const cursorCloseRef = useRef(null)
  const loadingRef     = useRef(null)

  useEffect(() => {
    let rafId
    let animFrames = []
    const cleanups = []

    // ── Grab DOM refs ─────────────────────────────────────────────────────────
    const imageWrapper = imageWrapRef.current
    const navPrev      = navPrevRef.current
    const navNext      = navNextRef.current

    // ── Mouse state ───────────────────────────────────────────────────────────
    const nMouse  = new THREE.Vector2()
    let mouseOver = false
    let mouseDown = false

    const mousePos = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      nMouse.x    = (e.clientX / window.innerWidth)  *  2 - 1
      nMouse.y    = -(e.clientY / window.innerHeight) *  2 + 1
      mousePos.x  = e.pageX
      mousePos.y  = e.pageY
    }
    window.addEventListener('mousemove', onMouseMove)
    cleanups.push(() => window.removeEventListener('mousemove', onMouseMove))

    // ── THREE setup ───────────────────────────────────────────────────────────
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    const clock = new THREE.Clock()

    // ── GL Object helpers ─────────────────────────────────────────────────────
    function calculateUnitSize(distance) {
      const vFov   = (camera.fov * Math.PI) / 180
      const height = 2 * Math.tan(vFov / 2) * distance
      const width  = height * camera.aspect
      return { width, height }
    }

    // ── Build plane ───────────────────────────────────────────────────────────
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader })

    material.uniforms = {
      uCurrTex:      { value: null },
      uNextTex:      { value: null },
      uTime:         { value: 0 },
      uProg:         { value: 0 },
      uAmplitude:    { value: 0 },
      uProgDirection:{ value: 0 },
      uMeshSize:     { value: new THREE.Vector2(imageWrapper.offsetWidth, imageWrapper.offsetHeight) },
      uImageSize:    { value: new THREE.Vector2(0, 0) },
      uMousePos:     { value: new THREE.Vector2(0.5, 0.5) },
      uMouseOverAmp: { value: 0 },
      uAnimating:    { value: false },
      uRadius:       { value: 0.08 },
      uTranslating:  { value: true },
    }

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // ── Position mesh to match imageWrapper DOM element ───────────────────────
    let camUnit = { width: 0, height: 0 }
    let bounds  = {}

    function setBounds() {
      const rect = imageWrapper.getBoundingClientRect()
      bounds = {
        left:   rect.left,
        top:    rect.top + window.scrollY,
        width:  rect.width,
        height: rect.height,
      }
      camUnit = calculateUnitSize(camera.position.z - mesh.position.z)

      const x = bounds.width  / window.innerWidth
      const y = bounds.height / window.innerHeight
      mesh.scale.x = camUnit.width  * x
      mesh.scale.y = camUnit.height * y

      material.uniforms.uMeshSize.value.set(bounds.width, bounds.height)

      // position
      mesh.position.y = camUnit.height / 2 - mesh.scale.y / 2
      mesh.position.y -= ((bounds.top) / window.innerHeight) * camUnit.height
      mesh.position.x = -(camUnit.width / 2) + mesh.scale.x / 2
      mesh.position.x += (bounds.left / window.innerWidth) * camUnit.width
    }
    setBounds()

    // ── Load textures ─────────────────────────────────────────────────────────
    const textures = []
    const loader   = new THREE.TextureLoader()

    SLIDES.forEach((slide, i) => {
      loader.load(slide.image, (tex) => {
        tex.minFilter         = THREE.LinearFilter
        tex.generateMipmaps   = false
        textures[i]           = tex
        if (i === 0) {
          material.uniforms.uCurrTex.value = tex
          // grab natural size from a hidden img (already in DOM)
          const imgEl = imageWrapper.querySelectorAll('img')[0]
          if (imgEl) material.uniforms.uImageSize.value.set(imgEl.naturalWidth || 800, imgEl.naturalHeight || 1067)
        }
      })
    })

    // ── Raycaster for mouse UV ────────────────────────────────────────────────
    const raycaster   = new THREE.Raycaster()
    const mouseLerped = new THREE.Vector2()
    let   mouseLerpAmt = 0.1

    // ── Slider state ──────────────────────────────────────────────────────────
    let current   = 0
    let animating = false
    let clicked   = false
    let isFullscreen = false

    // ── Animate texture switch ────────────────────────────────────────────────
    function switchTextures(index, direction) {
      if (animating || !textures[index]) return
      gsap.timeline({
        onStart: () => {
          animating = true
          material.uniforms.uAnimating.value    = true
          material.uniforms.uProgDirection.value = direction
          material.uniforms.uNextTex.value       = textures[index]
        },
        onComplete: () => {
          animating = false
          material.uniforms.uAnimating.value = false
          material.uniforms.uCurrTex.value   = textures[index]
        },
      })
        .fromTo(material.uniforms.uProg,      { value: 0 }, { value: 1, duration: 1, ease: 'power2.out' }, 0)
        .fromTo(material.uniforms.uAmplitude, { value: 0 }, { duration: 0.8, value: 1, repeat: 1, yoyo: true, yoyoEase: 'sine.out', ease: 'expo.out' }, 0)
    }

    // ── Slide info DOM refs (built after render) ──────────────────────────────
    // We'll collect them after mount via querySelectorAll
    const slideInfoEls = containerRef.current.querySelectorAll('.slide-info')
    const slideInfos   = Array.from(slideInfoEls).map((el) => {
      const indexChars = splitChars(el.querySelector('.slide-index'))
      const titleChars = splitChars(el.querySelector('.slide-title'))
      const descEl     = el.querySelector('.slide-description')
      const descLines  = splitIntoLines(descEl)
      return { el, indexChars, titleChars, descLines }
    })

    // ── Init: hide everything ─────────────────────────────────────────────────
    const cur = slideInfos[0]
    gsap.set([cur.indexChars, cur.titleChars], { yPercent: 120, rotation: -3 })
    gsap.set(cur.descLines, { yPercent: 100 })
    gsap.set(navPrev, { translateX: 100, opacity: 0 })
    gsap.set(navNext, { translateX: -100, opacity: 0 })
    gsap.set(imageWrapper, {
      translateY: '150%',
      onUpdate: setBounds,
    })

    // ── Render loop ───────────────────────────────────────────────────────────
    function renderLoop() {
      const elapsed = clock.getElapsedTime()
      material.uniforms.uTime.value = elapsed

      // mouse UV via raycaster
      const m = mouseOver ? nMouse : new THREE.Vector2(0, 0)
      mouseLerped.lerp(m, mouseLerpAmt)
      raycaster.setFromCamera(mouseLerped, camera)
      const hits = raycaster.intersectObject(mesh)
      if (hits.length > 0) {
        material.uniforms.uMousePos.value = [hits[0].uv.x, hits[0].uv.y]
      }

      if (mouseOver) {
        material.uniforms.uMouseOverAmp.value = lerp(material.uniforms.uMouseOverAmp.value, 1, 0.08)
        mouseLerpAmt = lerp(mouseLerpAmt, 0.1, 0.5)
      } else {
        material.uniforms.uMouseOverAmp.value = lerp(material.uniforms.uMouseOverAmp.value, 0, 0.08)
        mouseLerpAmt = lerp(mouseLerpAmt, 0, 0.5)
      }

      if (mouseOver && mouseDown) {
        material.uniforms.uRadius.value = lerp(material.uniforms.uRadius.value, 1, 0.01)
      } else if (mouseOver) {
        material.uniforms.uRadius.value = lerp(material.uniforms.uRadius.value, 0.08, 0.08)
      }

      if (animating) {
        material.uniforms.uMouseOverAmp.value = lerp(material.uniforms.uMouseOverAmp.value, 0, 0.1)
      }

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(renderLoop)
    }
    renderLoop()

    // ── Cursor ────────────────────────────────────────────────────────────────
    const cursorLarge = cursorLargeRef.current
    const cursorSmall = cursorSmallRef.current
    const cursorClose = cursorCloseRef.current

    const curState = {
      large: { x: 0, y: 0, scale: 1, opacity: 1 },
      small: { x: 0, y: 0, scale: 1, opacity: 1 },
      close: { x: 0, y: 0, scale: 0.5, opacity: 0 },
    }
    const curTarget = {
      large: { x: 0, y: 0, scale: 1, opacity: 0 },
      small: { x: 0, y: 0, scale: 1, opacity: 0 },
      close: { x: 0, y: 0, scale: 0.5, opacity: 0 },
    }
    const curAmts = { large: 0.2, small: 0.85, close: 0.5 }
    let cursorReady = false

    function renderCursors() {
      curTarget.large.x = mousePos.x - 30
      curTarget.large.y = mousePos.y - 30
      curTarget.small.x = mousePos.x - 30
      curTarget.small.y = mousePos.y - 30
      curTarget.close.x = mousePos.x - 20
      curTarget.close.y = mousePos.y - 20

      ;['large', 'small', 'close'].forEach((key) => {
        const s   = curState[key]
        const t   = curTarget[key]
        const amt = curAmts[key]
        s.x       = lerp(s.x, t.x, amt)
        s.y       = lerp(s.y, t.y, amt)
        s.scale   = lerp(s.scale, t.scale, 0.2)
        s.opacity = lerp(s.opacity, t.opacity, 0.15)
      })

      gsap.set(cursorLarge, { x: curState.large.x, y: curState.large.y, scale: curState.large.scale, opacity: curState.large.opacity })
      gsap.set(cursorSmall, { x: curState.small.x, y: curState.small.y, scale: curState.small.scale, opacity: curState.small.opacity })
      gsap.set(cursorClose, { x: curState.close.x, y: curState.close.y, scale: curState.close.scale, opacity: curState.close.opacity })

      animFrames.push(requestAnimationFrame(renderCursors))
    }

    const onFirstMove = () => {
      curState.large.x = curState.small.x = mousePos.x - 30
      curState.large.y = curState.small.y = mousePos.y - 30
      curTarget.large.opacity = 1
      curTarget.small.opacity = 1
      if (!cursorReady) { cursorReady = true; renderCursors() }
      window.removeEventListener('mousemove', onFirstMove)
    }
    window.addEventListener('mousemove', onFirstMove)
    cleanups.push(() => window.removeEventListener('mousemove', onFirstMove))

    // ── Navigate ──────────────────────────────────────────────────────────────
    function navigate(direction) {
      if (animating) return

      const prev    = current
      const total   = SLIDES.length
      const increment = direction === 'prev' ? -1 : 1

      let next = current + increment
      if (next >= total) next = 0
      if (next < 0) next = total - 1
      current = next

      const curInfo  = slideInfos[prev]
      const nextInfo = slideInfos[current]

      switchTextures(current, increment)

      gsap.to('body', { duration: 1.2, backgroundColor: BG_COLORS[current] })

      gsap.timeline({ defaults: { duration: 1, ease: 'power4.inOut' } })
        .addLabel('start', 0)
        .to([curInfo.indexChars, curInfo.titleChars], {
          yPercent: direction === 'next' ? -120 : 120,
          rotation: direction === 'next' ? 3 : -3,
          stagger:  direction === 'next' ? 0.02 : -0.02,
        }, 'start')
        .to(curInfo.descLines, {
          yPercent: direction === 'next' ? -100 : 100,
          stagger:  direction === 'next' ? 0.05 : -0.05,
        }, 'start')
        .addLabel('upcoming', 0.4)
        .add(() => {
          gsap.set([nextInfo.indexChars, nextInfo.titleChars], {
            yPercent: direction === 'next' ? 120 : -120,
            rotation: direction === 'next' ? -3 : 3,
          })
          gsap.set(nextInfo.descLines, { yPercent: direction === 'next' ? 100 : -100 })
          curInfo.el.classList.remove('slide--current')
          nextInfo.el.classList.add('slide--current')
        }, 'upcoming')
        .to([nextInfo.indexChars, nextInfo.titleChars], {
          yPercent: 0,
          rotation: 0,
          stagger:  direction === 'next' ? 0.02 : -0.02,
        }, 'upcoming')
        .to(nextInfo.descLines, {
          yPercent: 0,
          stagger:  direction === 'next' ? 0.05 : -0.05,
        }, 'upcoming')
    }

    // ── Image click → fullscreen toggle ───────────────────────────────────────
    function onImageClick() {
      if (animating) return
      clicked   = !clicked
      isFullscreen = clicked

      const info = slideInfos[current]

      if (clicked) {
        gsap.to(imageWrapper, { scale: window.innerHeight / 600, duration: 1.2, ease: 'elastic.out(1,1)', onUpdate: setBounds })
        curTarget.large.scale   = 2
        curTarget.large.opacity = 0
        curTarget.small.scale   = 5
        curAmts.small           = 0.25
        curTarget.close.opacity = 1
        curTarget.close.scale   = 1
      } else {
        gsap.to(imageWrapper, { scale: 1, duration: 1.2, ease: 'elastic.out(1,1)', onUpdate: setBounds })
        curTarget.large.scale   = 1
        curTarget.large.opacity = 1
        curTarget.small.scale   = 1
        curAmts.small           = 0.85
        curTarget.close.opacity = 0
        curTarget.close.scale   = 0.5
      }

      const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power4.inOut' } }).addLabel('start', clicked ? 0 : 0.2)
      tl.fromTo([info.indexChars, info.titleChars],
          { yPercent: clicked ? 0 : 120, rotation: clicked ? 0 : -3 },
          { yPercent: clicked ? -120 : 0, rotation: clicked ? 3 : 0, stagger: clicked ? 0.02 : -0.02 },
          'start')
        .fromTo(info.descLines,
          { yPercent: clicked ? 0 : 100 },
          { yPercent: clicked ? -100 : 0, stagger: 0.05 },
          'start')
        .fromTo(navPrev,
          { translateX: clicked ? 0 : 100, opacity: clicked ? 1 : 0 },
          { translateX: clicked ? -100 : 0, opacity: clicked ? 0 : 1 },
          'start')
        .fromTo(navNext,
          { translateX: clicked ? 0 : -100, opacity: clicked ? 1 : 0 },
          { translateX: clicked ? 100 : 0, opacity: clicked ? 0 : 1 },
          'start')
        .set([navPrev, navNext], { pointerEvents: clicked ? 'none' : 'auto' })
    }

    // ── Image wrapper mouse events ────────────────────────────────────────────
    imageWrapper.addEventListener('mouseenter', () => { mouseOver = true })
    imageWrapper.addEventListener('mouseleave', () => { mouseOver = false })
    imageWrapper.addEventListener('mousedown',  () => { mouseDown = true })
    imageWrapper.addEventListener('mouseup',    () => { mouseDown = false })
    imageWrapper.addEventListener('click', onImageClick)

    // Nav
    navPrev.addEventListener('click', () => navigate('prev'))
    navNext.addEventListener('click', () => navigate('next'))

    // ── Cursor hover on a/button ──────────────────────────────────────────────
    const interactEls = [...document.querySelectorAll('a'), ...document.querySelectorAll('button')]
    interactEls.forEach((el) => {
      el.addEventListener('mouseenter', () => { curTarget.large.scale = 2; curTarget.large.opacity = 0; curTarget.small.scale = 5 })
      el.addEventListener('mouseleave', () => { curTarget.large.scale = 1; curTarget.large.opacity = 1; curTarget.small.scale = 1 })
      el.addEventListener('mousedown',  () => { curTarget.small.scale = 4 })
      el.addEventListener('mouseup',    () => { curTarget.small.scale = 5 })
    })

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      setBounds()
    }
    window.addEventListener('resize', onResize)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    // ── Loading + intro animation ─────────────────────────────────────────────
    preloadImages(SLIDES.map((s) => s.image)).then(() => {
      const loading = loadingRef.current
      if (!loading) return

      const initAnimation = () => {
        const curSlide = slideInfos[0]

        gsap.timeline({ defaults: { duration: 1, ease: 'power4.inOut' }, delay: 0.25 })
          .addLabel('start', 0)
          .addLabel('upcoming', 1.25)
          .to(imageWrapper, {
            duration: 1.25,
            translateY: 0,
            ease: 'sine.out',
            onUpdate: setBounds,
          }, 'start')
          .to(material.uniforms.uAmplitude, {
            duration: 1,
            value: 1,
            repeat: 1,
            yoyo: true,
            yoyoEase: 'sine.out',
            ease: 'expo.out',
            onComplete: () => { material.uniforms.uTranslating = false },
          }, 'start')
          .to([curSlide.indexChars, curSlide.titleChars], { yPercent: 0, rotation: 0, stagger: -0.02 }, 'upcoming')
          .to(curSlide.descLines, { yPercent: 0, stagger: 0.05 }, 'upcoming')
          .to([navPrev, navNext], { translateX: 0, opacity: 1 }, 'upcoming')
      }

      const textEls = loading.querySelectorAll('.loading-text-row .loading-text')
      gsap.set(textEls, { autoAlpha: 1 })

      gsap.timeline()
        .to(loading.querySelector('.loading-label'), { duration: 1, opacity: 0 })
        .from(textEls, {
          duration: 3,
          translateY: (i) => `-${100 + i * 25}%`,
          ease: 'expo.out',
          stagger: 0.1,
        })
        .to(textEls, {
          duration: 3,
          translateY: (i) => `${100 + i * 25}%`,
          ease: 'expo.in',
          stagger: 0.25,
        })
        .to(loading.querySelector('.loading-bg'), {
          duration: 1,
          scaleY: 0,
          transformOrigin: 'top center',
          ease: 'expo.out',
          onComplete: () => {
            initAnimation()
            gsap.set(loading, { pointerEvents: 'none', autoAlpha: 0 })
          },
        })

      gsap.from(
        ['.frame-logo', '.frame-button', '.frame-artist span', '.frame-credits span'],
        { duration: 1, opacity: 0, yPercent: 100, stagger: 0.1, ease: 'expo.out', delay: 7 }
      )
    })

    return () => {
      cancelAnimationFrame(rafId)
      animFrames.forEach(cancelAnimationFrame)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  // ─── JSX ────────────────────────────────────────────────────────────────────

  const svgArrowLeft = (
    <svg viewBox="0 0 49 19" className="block w-full h-full transition-transform duration-[250ms] ease-in-out group-hover:-translate-x-[10px] group-active:-translate-x-[5px]">
      <path d="M 47.5547,8.05465 H 4.94603 L 10.0165,3.00878 C 10.5822,2.44568 10.5844,1.53058 10.0213,0.964816 9.45823,0.398976 8.54305,0.396881 7.97729,0.959902 L 0.425238,8.47552 c -5.06e-4,4.4e-4 -8.67e-4,9.4e-4 -0.0013,0.00138 -0.564323,0.56309 -0.566129,1.48115 -1.45e-4,2.0461 5.06e-4,5e-4 8.67e-4,10e-4 0.001301,0.0014 L 7.97714,18.04 c 0.5657,0.563 1.48087,0.561 2.04406,-0.0049 0.5631,-0.5658 0.5609,-1.4809 -0.0049,-2.044 L 4.94603,10.9453 H 47.5547 C 48.353,10.9453 49,10.2982 49,9.49996 49,8.70172 48.353,8.05465 47.5547,8.05465 Z" fill="white" />
    </svg>
  )
  const svgArrowRight = (
    <svg viewBox="0 0 49 19" className="block w-full h-full transition-transform duration-[250ms] ease-in-out group-hover:translate-x-[10px] group-active:translate-x-[5px]">
      <path d="M 1.44529,10.9454 H 44.054 l -5.0705,5.0458 c -0.5657,0.5631 -0.5679,1.4782 -0.0048,2.044 0.5631,0.5658 1.4782,0.5679 2.044,0.0049 l 7.5521,-7.5156 c 5e-4,-5e-4 8e-4,-10e-4 0.0013,-0.0014 0.5643,-0.56309 0.5661,-1.48115 1e-4,-2.04613 -5e-4,-4.3e-4 -9e-4,-9.3e-4 -0.0013,-0.00137 L 41.0229,0.959983 C 40.4572,0.397033 39.542,0.398984 38.9788,0.964896 38.4157,1.53066 38.4179,2.44576 38.9837,3.00886 L 44.054,8.05473 H 1.44528 C 0.64704,8.05473 0,8.7018 0,9.50004 0,10.2983 0.647041,10.9454 1.44529,10.9454 Z" fill="white" />
    </svg>
  )

  return (
    <div ref={containerRef} className="w-full h-full">

      {/* ── WebGL Canvas (fixed, behind everything) ── */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />

      {/* ── Frame UI ── */}
      <div
        className="fixed w-full h-full pointer-events-none text-white z-50"
        style={{ padding: '2rem 3rem', display: 'grid', justifyContent: 'space-between', alignContent: 'space-between', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateAreas: '"logo . btn" "artist . credits"' }}
      >
        <h3 className="frame-logo pointer-events-auto" style={{ gridArea: 'logo', justifySelf: 'left', fontFamily: "'Red Rose', serif", fontWeight: 300 }}>GL.</h3>
        <button className="frame-button pointer-events-auto" style={{ gridArea: 'btn', justifySelf: 'right', fontFamily: "'Red Rose', serif", fontWeight: 300, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>Menu</button>
        <p className="frame-artist pointer-events-auto overflow-hidden" style={{ gridArea: 'artist', justifySelf: 'left', fontFamily: "'Red Rose', serif", fontWeight: 300, fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-block' }}>Artist — <a href="https://www.instagram.com/adxmboni/" target="_blank" rel="noreferrer" style={{ fontWeight: 400, opacity: 0.8 }}>Adam Rosol</a></span>
        </p>
        <p className="frame-credits pointer-events-auto overflow-hidden" style={{ gridArea: 'credits', justifySelf: 'right', fontFamily: "'Red Rose', serif", fontWeight: 300, fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-block' }}>Wave effect — <a href="https://www.nightingale.world/" target="_blank" rel="noreferrer" style={{ fontWeight: 400, opacity: 0.8 }}>nightingale.world</a></span>
        </p>
      </div>

      {/* ── Slider ── */}
      <main className="w-full h-full relative overflow-hidden">

        {/* Image wrapper — THREE.js maps onto this */}
        <div
          ref={imageWrapRef}
          className="absolute left-1/2 top-1/2 overflow-hidden select-none"
          style={{
            width: 'var(--image-width, 450px)',
            height: 'var(--image-height, 600px)',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            '--image-width': '450px',
            '--image-height': '600px',
          }}
        >
          {SLIDES.map((slide, i) => (
            <img
              key={i}
              className="absolute left-1/2 top-0 h-full hidden"
              style={{ transform: 'translateX(-50%)' }}
              src={slide.image}
              alt={`slide ${slide.index}`}
            />
          ))}
        </div>

        {/* Slide info overlay */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: 'var(--image-width, 450px)',
            height: 'var(--image-height, 600px)',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`slide-info absolute inset-0 text-white pointer-events-auto${i === 0 ? ' slide--current' : ''}`}
              style={{ fontFamily: "'Red Rose', serif" }}
            >
              {/* Large index number */}
              <h2
                className="slide-index absolute"
                style={{
                  left: 0,
                  top: 0,
                  transform: 'translate(-60%, -20%)',
                  fontSize: '14rem',
                  fontWeight: 700,
                  lineHeight: '80%',
                  overflow: 'hidden',
                  display: 'inline-block',
                  pointerEvents: 'none',
                }}
              >
                {slide.index}
              </h2>

              {/* Text block */}
              <div className="absolute" style={{ bottom: 0, left: '105%' }}>
                <h2
                  className="slide-title"
                  style={{
                    fontSize: '7rem',
                    fontWeight: 700,
                    transform: 'translateX(-35%)',
                    overflow: 'hidden',
                    lineHeight: '80%',
                    color: 'transparent',
                    WebkitTextStroke: '2px #fff',
                    pointerEvents: 'none',
                  }}
                >
                  {slide.title}
                </h2>
                <p
                  className="slide-description"
                  style={{
                    width: '350px',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '1rem',
                    lineHeight: '140%',
                    fontWeight: 300,
                    pointerEvents: 'none',
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <nav className="absolute top-1/2 w-full -translate-y-1/2 pointer-events-none" style={{ zIndex: 12 }}>
          <button
            ref={navPrevRef}
            className="group slider-nav absolute pointer-events-auto cursor-pointer"
            style={{ left: '25vw', width: '50px', height: '20px', background: 'none', border: 'none' }}
          >
            {svgArrowLeft}
          </button>
          <button
            ref={navNextRef}
            className="group slider-nav absolute pointer-events-auto cursor-pointer"
            style={{ right: '25vw', width: '50px', height: '20px', background: 'none', border: 'none' }}
          >
            {svgArrowRight}
          </button>
        </nav>
      </main>

      {/* ── Custom cursors ── */}
      <svg ref={cursorLargeRef} className="fixed top-0 left-0 pointer-events-none mix-blend-difference hidden md:block" style={{ zIndex: 100, width: 60, height: 60 }} viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="20" fill="transparent" stroke="#5631e9" strokeWidth="1" opacity="0.7" />
      </svg>
      <svg ref={cursorSmallRef} className="fixed top-0 left-0 pointer-events-none mix-blend-difference hidden md:block" style={{ zIndex: 100, width: 60, height: 60 }} viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="5" fill="#5631e9" opacity="0.7" />
      </svg>
      <svg ref={cursorCloseRef} className="fixed top-0 left-0 pointer-events-none mix-blend-difference hidden md:block" style={{ zIndex: 100, width: 40, height: 40 }} viewBox="0 0 512 512">
        <line x1="368" y1="368" x2="144" y2="144" stroke="#5631e9" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="368" y1="144" x2="144" y2="368" stroke="#5631e9" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* ── Loading screen ── */}
      <div
        ref={loadingRef}
        className="fixed left-0 top-0 w-full h-screen flex justify-center items-center"
        style={{ zIndex: 1000 }}
      >
        <h4
          className="loading-label absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
          style={{ fontSize: '2vmin', fontFamily: "'Red Rose', sans-serif" }}
        >
          <span style={{ animation: 'blink 1s infinite alternate-reverse' }}>Loading...</span>
        </h4>

        <h1
          className="relative text-white uppercase select-none"
          style={{ fontSize: '10vmin', fontFamily: "'Red Rose', sans-serif" }}
        >
          {[0,1,2,3,4,5].map((i) => (
            <span
              key={i}
              className={`loading-text-row block${i > 0 ? ' absolute top-0 left-0' : ''}`}
              style={{
                clipPath: [
                  'polygon(0% 75%, 100% 75%, 100% 100%, 0% 100%)',
                  'polygon(0% 50%, 100% 50%, 100% 75.5%, 0% 75.5%)',
                  'polygon(0% 25%, 100% 25%, 100% 50.5%, 0% 50.5%)',
                  'polygon(0% 0%, 100% 0%, 100% 25.5%, 0% 25.5%)',
                  'polygon(0% -25%, 100% -25%, 100% 0.5%, 0% 0.5%)',
                  'polygon(0% -50%, 100% -50%, 100% -24.5%, 0% -24.5%)',
                ][i],
              }}
              aria-hidden={i > 0 ? true : undefined}
            >
              <span className="loading-text block select-none opacity-0">WELCOME</span>
            </span>
          ))}
        </h1>

        <div
          className="loading-bg absolute left-0 top-0 w-full h-full"
          style={{ background: '#0e0e0e', zIndex: -1 }}
        />
      </div>

      {/* ── Global styles (injected once) ── */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap");
        @keyframes blink { from { opacity:1 } to { opacity:0.6 } }
        body { background: #1f1322; -webkit-font-smoothing: antialiased; }
        .slide-info:not(.slide--current) .slide-index,
        .slide-info:not(.slide--current) .slide-title,
        .slide-info:not(.slide--current) .slide-description { opacity: 0; pointer-events: none; }
        @media (max-width: 64em) { .frame-credits { display: none; } }
        @media (max-width: 32em) { .frame-artist { display: none; } }
      `}</style>
    </div>
  )
}

