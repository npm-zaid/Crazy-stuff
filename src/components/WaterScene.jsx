// WaterScene.jsx
import React, { useEffect, useRef } from "react";

const MAX_DROPS = 10;

// Vertex shader: fullscreen quad + UV
const vertexSrc = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Fragment shader: distort UV with ripples from drops
const fragmentSrc = `
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_time;

const int MAX_DROPS = ${MAX_DROPS};
uniform int u_dropCount;
uniform vec3 u_drops[MAX_DROPS]; // (x, y, startTime) in pixels + seconds

void main() {
  vec2 uv = v_uv;
  vec2 fragPos = uv * u_resolution;

  vec2 totalDisp = vec2(0.0);

  for (int i = 0; i < MAX_DROPS; i++) {
    if (i >= u_dropCount) break;

    vec3 drop = u_drops[i];
    vec2 center = drop.xy;
    float startTime = drop.z;

    float t = u_time - startTime;
    if (t < 0.0) continue;

    float dist = distance(fragPos, center);

    // --- slower, smoother waves ---
    // lower spatial frequency & temporal speed
    float wave = sin(dist * 0.08 - t * 2.0);

    // slower decay over time and distance for more "liquid" feel
    float timeFade = exp(-t * 1.1);
    float distFade = exp(-dist * 0.015);

    float strength = wave * timeFade * distFade;

    // displacement direction
    vec2 dir = normalize(fragPos - center);
    totalDisp += dir * strength * 0.035;
  }

  vec2 finalUV = uv + totalDisp;
  finalUV = clamp(finalUV, 0.0, 1.0);

  vec4 color = texture2D(u_image, finalUV);
  gl_FragColor = color;
}
`;

// ---- helpers ----
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// Draw text + white background onto an offscreen 2D canvas
function drawTextToCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  if (!ctx || !width || !height) return;

  // background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // heading
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${Math.max(26, Math.floor(width * 0.05))}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const padding = width * 0.08;
  ctx.fillText("Underwater Heading", padding, padding);

  // paragraph
  ctx.font = `${Math.max(16, Math.floor(width * 0.018))}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  const text =
    "This text is rendered to a canvas and then distorted in a WebGL shader so it looks like it is seen through moving water.";
  const maxWidth = width - padding * 2;
  const lineHeight = Math.max(22, Math.floor(width * 0.025));

  let x = padding;
  let y = padding + lineHeight * 2;

  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

const WaterScene = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const dropsRef = useRef([]); // {x, y, start}
  const startTimeRef = useRef(performance.now() / 1000);
  const textureReadyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const program = createProgram(gl, vertexSrc, fragmentSrc);
    if (!program) return;

    gl.useProgram(program);

    // fullscreen quad
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // uniforms
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uDropCount = gl.getUniformLocation(program, "u_dropCount");
    const uDrops = gl.getUniformLocation(program, "u_drops[0]");
    const uImage = gl.getUniformLocation(program, "u_image");

    // texture from offscreen text canvas
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const textCanvas = document.createElement("canvas");

    const updateTextureFromText = () => {
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      drawTextToCanvas(textCanvas);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textCanvas
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(uImage, 0); // texture unit 0
      textureReadyRef.current = true;
    };

    // resize
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        updateTextureFromText();
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      resize();

      if (!textureReadyRef.current) return;

      const now = performance.now() / 1000;
      const t = now - startTimeRef.current;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);

      // pack drops
      const arr = new Float32Array(MAX_DROPS * 3);
      const drops = dropsRef.current;
      const count = Math.min(drops.length, MAX_DROPS);

      for (let i = 0; i < count; i++) {
        arr[i * 3 + 0] = drops[i].x;
        arr[i * 3 + 1] = canvas.height - drops[i].y; // flip Y
        arr[i * 3 + 2] = drops[i].start;
      }

      gl.uniform1i(uDropCount, count);
      gl.uniform3fv(uDrops, arr);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    // interaction – add drop on move / click
    const addDrop = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      const now = performance.now() / 1000 - startTimeRef.current;

      dropsRef.current = [
        ...dropsRef.current.slice(-MAX_DROPS + 1),
        { x, y, start: now },
      ];
    };

    let moveThrottle = 0;
    const handleMove = (e) => {
      const now = performance.now();
      if (now - moveThrottle > 80) {
        moveThrottle = now;
        addDrop(e);
      }
    };

    canvas.addEventListener("click", addDrop);
    canvas.addEventListener("mousemove", handleMove);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", addDrop);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-white shadow-lg">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4">
        <span className="text-xs text-black/60">
          Move or click to create water ripples 💧
        </span>
      </div>
    </div>
  );
};

export default WaterScene;
