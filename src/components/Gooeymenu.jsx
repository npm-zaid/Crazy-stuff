import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

// ── Icon SVG paths ──────────────────────────────────────────────────────────
const ICONS = {
  user: (
    <g>
      <circle cx="46.3" cy="30.5" r="20.7" />
      <path d="M70.4,58.4a31.8,31.8,0,0,1,7.8,21" />
      <path d="M14.3,79.4a31.6,31.6,0,0,1,7.8-20.9" />
    </g>
  ),
  settings: (
    <g>
      <path d="M71.5,51.3a28.4,28.4,0,0,0,.5-5.1,25.7,25.7,0,0,0-.8-6.2l8.9-5.9a35.4,35.4,0,0,0-10-14.9l-8.9,6a24,24,0,0,0-6.1-3.3V11.2a38.2,38.2,0,0,0-9-1.1,36.8,36.8,0,0,0-8.9,1.1V21.9a27.3,27.3,0,0,0-6.7,3.7l-9-5.7A35.5,35.5,0,0,0,11.8,35l9.1,5.6a26.9,26.9,0,0,0,0,11.3l-8.9,6a35,35,0,0,0,9.8,14.9l8.8-5.9a26.4,26.4,0,0,0,6.6,3.6V81.2a36.8,36.8,0,0,0,8.9,1.1,38.2,38.2,0,0,0,9-1.1V70.5a27,27,0,0,0,7-4l9.1,5.7A37.5,37.5,0,0,0,80.6,57ZM46.2,61.5A15.3,15.3,0,1,1,61.5,46.2,15.4,15.4,0,0,1,46.2,61.5Z" />
    </g>
  ),
  msg: (
    <g>
      <path d="M81.9,43.2c0,12.9-16,23.4-35.7,23.4-6.3,0-10-.4-15.2-2.2-1.8-.7-17.5,9.1-19.1,8.2s6-14.9,3.9-17.2a17.4,17.4,0,0,1-5.3-12.2c0-13,16-23.5,35.7-23.5S81.9,30.2,81.9,43.2Z" />
    </g>
  ),
};

const BUTTON_NAMES = ["user", "settings", "msg"];

const PARAMS = {
  pageContentMaxWidth: 800,
  btnPixelRadius: 43,
  widthPixel: 300,
  heightPixel: 250,
};

// ── Vertex & Fragment shaders (unchanged) ───────────────────────────────────
const VERT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0., 1.);
  }
`;

const FRAG_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_max_y;
  uniform vec2 u_pointer;
  uniform float u_click_t;
  uniform vec3 u_drops_pos_x;
  uniform vec3 u_drops_pos_y;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float get_point_shape(vec2 uv, vec2 pos) {
    float width = 1.9 * (u_drops_pos_x[2] - u_drops_pos_x[0]) / 3.;
    vec2 dist = vec2(uv.x * u_ratio, uv.y) - vec2(pos.x * u_ratio, 1. - pos.y);
    float l = length(dist);
    l = max(0., l);
    l /= u_max_y;
    l *= u_ratio;
    width += .1 * pow(l, -.7);
    float c = smoothstep(pos.x - .5 * width, pos.x, uv.x);
    c *= smoothstep(pos.x + .5 * width, pos.x, uv.x);
    c *= smoothstep(1. - pos.y - .5 * u_ratio * width, 1. - pos.y, uv.y);
    c = pow(c, 10.);
    return c;
  }

  void main() {
    vec2 uv = vUv;
    uv.y -= .03;
    float noise_speed = .25;
    float width = .2;
    float shape = 0.;

    float mid_shape = smoothstep(0. - .7 * width, u_drops_pos_x[1] - u_drops_pos_x[0], uv.x - u_drops_pos_x[0])
      - smoothstep(u_drops_pos_x[1], u_drops_pos_x[2] + .5 * width, uv.x);
    mid_shape = pow(mid_shape, 1.5);
    mid_shape *= 2.6 * (1. - (1. - uv.y) / max(u_drops_pos_y[0], max(u_drops_pos_y[1], u_drops_pos_x[2])));

    float top_shape = (1. - (1. - uv.y) / u_max_y);
    top_shape = pow(top_shape, 3.);
    vec2 noise_uv = uv;
    noise_uv.x /= width;
    noise_uv.x *= .7;
    noise_uv.y += noise_speed * u_time;
    float noise = snoise(noise_uv);
    top_shape -= .2 * noise;
    noise_uv.x *= .1;
    noise = snoise(noise_uv);
    top_shape -= .2 * noise;

    shape += .5 * mid_shape;
    shape += top_shape;
    shape = 5. * pow(shape, 7.);

    for (int i = 0; i < 3; i++) {
      float column = get_point_shape(vUv, vec2(u_drops_pos_x[i], u_drops_pos_y[i]));
      shape += column;
    }

    float border_limit = .4;
    float border = smoothstep(border_limit, border_limit + .1, shape);
    float contour = border - smoothstep(border_limit, border_limit + .25, shape);

    shape = clamp(shape, 0., 2.);
    shape = .4 + pow(shape, .2);

    vec3 purple = vec3(0.780, 0.474, 0.816);
    vec3 yellow = vec3(0.7, 0.7, 0.7);
    vec3 blue   = vec3(0.296, 0.753, 0.784);

    vec3 color = mix(blue, purple, (.5 + .1 * sin(u_time)) * shape);

    vec2 p = uv - u_pointer;
    p.x *= u_ratio;
    float pl = (1. - min(1., length(p)));
    pl = pow(pl, 4.);
    pl *= (1. + u_click_t);
    pl += .4 * noise;
    color = mix(color, yellow, pl + .1 * shape);

    color -= .2 * contour;
    color += (.2 * pl) * contour;
    color *= shape;

    gl_FragColor = vec4(color, border);
  }
`;

// ── Component ───────────────────────────────────────────────────────────────
export default function GooeyMenu() {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const ballsRef = useRef(null);
  const stateRef = useRef({
    gl: null,
    uniforms: {},
    buttons: BUTTON_NAMES.map((name) => ({ name, pos: { x: 0, y: 0 }, el: null })),
    pointer: { x: -10, y: 0, tx: 0, ty: 0 },
    xOffset: 0,
    clickPower: 0,
    tickerAdded: false,
  });

  // ── helpers ────────────────────────────────────────────────────────────────
  const createShader = (gl, src, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShader = useCallback((canvas) => {
    const s = stateRef.current;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) { alert("WebGL not supported"); return null; }

    const vs = createShader(gl, VERT_SHADER, gl.VERTEX_SHADER);
    const fs = createShader(gl, FRAG_SHADER, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return null;
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(program);

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    s.uniforms = {
      time:    gl.getUniformLocation(program, "u_time"),
      posX:    gl.getUniformLocation(program, "u_drops_pos_x"),
      posY:    gl.getUniformLocation(program, "u_drops_pos_y"),
      ratio:   gl.getUniformLocation(program, "u_ratio"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      maxY:    gl.getUniformLocation(program, "u_max_y"),
      click:   gl.getUniformLocation(program, "u_click_t"),
    };

    s.gl = gl;
    return gl;
  }, []);

  const resizeCanvas = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    const { gl, uniforms } = s;
    if (!canvas || !gl) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.uniform1f(uniforms.ratio, window.innerWidth / window.innerHeight);
    gl.uniform1f(uniforms.maxY,  PARAMS.heightPixel / window.innerHeight);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  const resizeOverlay = useCallback(() => {
    const s = stateRef.current;
    const svg = svgRef.current;
    const balls = ballsRef.current;
    if (!svg || !balls) return;

    gsap.set(svg, { attr: { viewBox: `0 0 ${window.innerWidth} ${window.innerHeight}` } });

    s.xOffset = window.innerWidth - PARAMS.widthPixel;
    if (window.innerWidth > PARAMS.pageContentMaxWidth) {
      s.xOffset -= 0.5 * (window.innerWidth - PARAMS.pageContentMaxWidth);
    }
    gsap.set(balls, { x: s.xOffset });
  }, []);

  const renderShader = useCallback((t) => {
    const { gl, uniforms, xOffset, buttons } = stateRef.current;
    if (!gl) return;

    gl.uniform1f(uniforms.time, t);

    const gX = (b) => (xOffset + b.pos.x) / window.innerWidth;
    const gY = (b) => b.pos.y / window.innerHeight;

    gl.uniform3f(uniforms.posX, gX(buttons[0]), gX(buttons[1]), gX(buttons[2]));
    gl.uniform3f(uniforms.posY, gY(buttons[0]), gY(buttons[1]), gY(buttons[2]));

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);

  const setupAnimation = useCallback(() => {
    const { buttons, uniforms } = stateRef.current;
    const { btnPixelRadius, widthPixel, heightPixel } = PARAMS;

    buttons.forEach((b, i) => {
      b.yLoop = gsap.fromTo(b.pos,
        { y: btnPixelRadius + (i === 1 ? 4 : 2) * btnPixelRadius },
        {
          duration: 2,
          y: heightPixel - (i === 0 ? 2 : 0) * btnPixelRadius,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      ).progress(i / buttons.length + 0.2 * Math.random());

      b.xLoop = gsap.fromTo(b.pos,
        { x: (i / buttons.length) * widthPixel },
        {
          duration: 2 + Math.random(),
          x: `+=${(i > 0 ? -0.12 : 0.1) * widthPixel}`,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      ).progress(Math.random());

      if (b.el) {
        b.el.onclick = () => {
          const s = stateRef.current;
          gsap.timeline({
            onUpdate: () => stateRef.current.gl?.uniform1f(uniforms.click, s.clickPower),
          })
            .to(s, { duration: 0.1, clickPower: 0.2, ease: "power1.inOut" }, 0)
            .to(s, { duration: 0.3, clickPower: 0,   ease: "back(2).out"  }, ">")
            .to(b.el, { duration: 0.1, opacity: 0.1, ease: "power1.inOut" }, 0)
            .to(b.el, { duration: 0.3, opacity: 1,   ease: "power1.inOut" }, ">");
        };
      }
    });

    const maxDistance = 4 * btnPixelRadius;
    window.addEventListener("mousemove", (e) => {
      const s = stateRef.current;
      s.pointer.tx = e.clientX;
      s.pointer.ty = e.clientY;
      s.gl?.uniform2f(
        s.uniforms.pointer,
        s.pointer.x / window.innerWidth,
        1 - s.pointer.y / window.innerHeight
      );

      s.buttons.forEach((b) => {
        const circleX = s.xOffset + gsap.getProperty(b.el, "x");
        const circleY = gsap.getProperty(b.el, "y");
        b.distance = Math.min(
          1,
          Math.sqrt(
            Math.pow(s.pointer.tx - circleX, 2) + Math.pow(s.pointer.ty - circleY, 2)
          ) / maxDistance
        );
        const ts = 1.2 * Math.pow(b.distance, 2);
        gsap.set(b.xLoop, { timeScale: ts });
        gsap.set(b.yLoop, { timeScale: ts });
      });
    });
  }, []);

  // ── mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const balls  = ballsRef.current;
    if (!canvas || !balls) return;

    // wire el refs from DOM
    const gEls = balls.querySelectorAll(".menu-item");
    stateRef.current.buttons.forEach((b, i) => { b.el = gEls[i]; });

    initShader(canvas);
    resizeCanvas();
    resizeOverlay();
    setupAnimation();

    const onTick = (t) => {
      const s = stateRef.current;
      s.pointer.x += (s.pointer.tx - s.pointer.x) * 0.95;
      s.pointer.y += (s.pointer.ty - s.pointer.y) * 0.95;
      s.buttons.forEach((b) => {
        if (b.el) gsap.set(b.el, { x: b.pos.x, y: b.pos.y });
      });
      renderShader(t);
    };

    gsap.ticker.add(onTick);

    const onResize = () => { resizeCanvas(); resizeOverlay(); };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("resize", onResize);
    };
  }, [initShader, resizeCanvas, resizeOverlay, setupAnimation, renderShader]);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full m-0 p-0">
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        id="gooey-canvas"
        className="fixed top-0 left-0 w-full h-full"
      />

      {/* SVG overlay */}
      <svg
        ref={svgRef}
        id="gooey-overlay"
        className="fixed top-0 left-0 w-full h-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      >
        <defs>
          {BUTTON_NAMES.map((name) => (
            <symbol key={name} id={`icon-${name}`} viewBox="0 0 100 100">
              {ICONS[name]}
            </symbol>
          ))}
        </defs>

        <g ref={ballsRef} className="balls">
          {BUTTON_NAMES.map((name) => (
            <g key={name} className="menu-item cursor-pointer group">
              <circle cx="0" cy="0" r={PARAMS.btnPixelRadius} fill="transparent" />
              <use
                href={`#icon-${name}`}
                x={-0.5 * PARAMS.btnPixelRadius}
                y={-0.5 * PARAMS.btnPixelRadius}
                width={PARAMS.btnPixelRadius}
                height={PARAMS.btnPixelRadius}
                className="stroke-[#222288] group-hover:stroke-black transition-colors duration-150"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}