import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const MES_IMAGES = [
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

// ── Influencer data ───────────────────────────────────────────────────────────
// Each entry maps to an image in MES_IMAGES by index (loops if fewer entries)
const INFLUENCERS = [
  { handle: "@alexmorrow", name: "Alex Morrow", niche: "Fashion & Lifestyle", location: "New York", followers: "2.4M", eng: "8.7%", posts: "847", avgLikes: "192K", avgComments: "3.2K", tags: ["fashion", "streetwear", "ootd", "nyc"], lastPost: "2h ago", platform: "instagram" },
  { handle: "@priyashoots", name: "Priya Singh", niche: "Beauty & Skincare", location: "Mumbai", followers: "1.8M", eng: "11.2%", posts: "612", avgLikes: "148K", avgComments: "4.1K", tags: ["beauty", "skincare", "glow", "india"], lastPost: "5h ago", platform: "instagram" },
  { handle: "@kaito.lens", name: "Kaito Yamada", niche: "Photography & Travel", location: "Tokyo", followers: "3.1M", eng: "6.4%", posts: "1.2K", avgLikes: "224K", avgComments: "2.8K", tags: ["travel", "photography", "japan", "minimal"], lastPost: "1d ago", platform: "instagram" },
  { handle: "@lunavibes", name: "Luna Reyes", niche: "Wellness & Fitness", location: "Los Angeles", followers: "980K", eng: "13.5%", posts: "423", avgLikes: "87K", avgComments: "5.6K", tags: ["wellness", "yoga", "fitness", "mindset"], lastPost: "3h ago", platform: "tiktok" },
  { handle: "@marcofood", name: "Marco Bianchi", niche: "Food & Cooking", location: "Milan", followers: "4.2M", eng: "9.1%", posts: "2.1K", avgLikes: "318K", avgComments: "7.2K", tags: ["food", "cooking", "italy", "recipes"], lastPost: "6h ago", platform: "youtube" },
  { handle: "@siennastyle", name: "Sienna Park", niche: "Luxury & Fashion", location: "Paris", followers: "5.7M", eng: "5.8%", posts: "1.8K", avgLikes: "412K", avgComments: "6.4K", tags: ["luxury", "fashion", "paris", "style"], lastPost: "12h ago", platform: "instagram" },
  { handle: "@devtech_raj", name: "Raj Patel", niche: "Tech & Gadgets", location: "Bengaluru", followers: "760K", eng: "14.2%", posts: "531", avgLikes: "64K", avgComments: "8.9K", tags: ["tech", "gadgets", "coding", "india"], lastPost: "4h ago", platform: "youtube" },
  { handle: "@norabakes", name: "Nora Lindqvist", niche: "Baking & Pastry", location: "Stockholm", followers: "1.3M", eng: "10.7%", posts: "892", avgLikes: "103K", avgComments: "3.8K", tags: ["baking", "pastry", "nordic", "foodie"], lastPost: "1d ago", platform: "instagram" },
  { handle: "@carlosfit", name: "Carlos Vega", niche: "Fitness & Sports", location: "Barcelona", followers: "2.9M", eng: "7.6%", posts: "1.4K", avgLikes: "196K", avgComments: "4.7K", tags: ["fitness", "sports", "motivation", "gym"], lastPost: "8h ago", platform: "tiktok" },
  { handle: "@zoeart", name: "Zoe Chen", niche: "Art & Illustration", location: "Singapore", followers: "620K", eng: "16.3%", posts: "318", avgLikes: "52K", avgComments: "6.1K", tags: ["art", "illustration", "design", "creative"], lastPost: "2d ago", platform: "instagram" },
  { handle: "@milesmusic", name: "Miles Thompson", niche: "Music & Production", location: "Atlanta", followers: "3.4M", eng: "8.9%", posts: "734", avgLikes: "248K", avgComments: "9.3K", tags: ["music", "hiphop", "producer", "beats"], lastPost: "3h ago", platform: "youtube" },
  { handle: "@harpertravel", name: "Harper Davis", niche: "Travel & Adventure", location: "Sydney", followers: "2.1M", eng: "9.4%", posts: "1.1K", avgLikes: "172K", avgComments: "5.2K", tags: ["travel", "adventure", "australia", "explore"], lastPost: "7h ago", platform: "instagram" },
  { handle: "@amiraskin", name: "Amira Hassan", niche: "Skincare & Beauty", location: "Dubai", followers: "1.5M", eng: "12.1%", posts: "567", avgLikes: "124K", avgComments: "4.8K", tags: ["skincare", "beauty", "halal", "dubai"], lastPost: "5h ago", platform: "instagram" },
  { handle: "@tomcooks", name: "Tom Nguyen", niche: "Street Food & Culture", location: "Ho Chi Minh", followers: "870K", eng: "11.8%", posts: "940", avgLikes: "78K", avgComments: "3.4K", tags: ["streetfood", "culture", "vietnam", "cooking"], lastPost: "1h ago", platform: "tiktok" },
  { handle: "@elsaoutdoor", name: "Elsa Hoffman", niche: "Outdoor & Hiking", location: "Zurich", followers: "1.1M", eng: "10.2%", posts: "786", avgLikes: "91K", avgComments: "2.9K", tags: ["hiking", "outdoor", "alps", "nature"], lastPost: "9h ago", platform: "instagram" },
  { handle: "@jakedraws", name: "Jake Morrison", niche: "Comics & Design", location: "Chicago", followers: "540K", eng: "15.7%", posts: "281", avgLikes: "46K", avgComments: "7.4K", tags: ["comics", "design", "illustration", "art"], lastPost: "2d ago", platform: "instagram" },
  { handle: "@sofiafashion", name: "Sofia Alvarez", niche: "Sustainable Fashion", location: "Mexico City", followers: "1.6M", eng: "9.9%", posts: "712", avgLikes: "134K", avgComments: "5.1K", tags: ["sustainable", "fashion", "eco", "style"], lastPost: "4h ago", platform: "instagram" },
  { handle: "@nickgames", name: "Nick Kozlov", niche: "Gaming & Esports", location: "Moscow", followers: "4.8M", eng: "6.2%", posts: "2.4K", avgLikes: "356K", avgComments: "12.1K", tags: ["gaming", "esports", "streams", "fps"], lastPost: "30m ago", platform: "youtube" },
  { handle: "@linafit", name: "Lina Meyer", niche: "Pilates & Wellness", location: "Berlin", followers: "730K", eng: "13.8%", posts: "489", avgLikes: "61K", avgComments: "3.6K", tags: ["pilates", "wellness", "fitness", "germany"], lastPost: "6h ago", platform: "instagram" },
  { handle: "@omarphoto", name: "Omar Sharif", niche: "Portrait Photography", location: "Cairo", followers: "920K", eng: "11.4%", posts: "634", avgLikes: "79K", avgComments: "4.3K", tags: ["portrait", "photography", "egypt", "fineart"], lastPost: "1d ago", platform: "instagram" },
  { handle: "@yuki.cook", name: "Yuki Tanaka", niche: "Japanese Cuisine", location: "Osaka", followers: "2.2M", eng: "8.3%", posts: "1.5K", avgLikes: "168K", avgComments: "6.7K", tags: ["japanese", "cuisine", "ramen", "sushi"], lastPost: "3h ago", platform: "youtube" },
  { handle: "@isabellastyle", name: "Isabella Rossi", niche: "Italian Fashion", location: "Florence", followers: "3.3M", eng: "7.1%", posts: "1.9K", avgLikes: "241K", avgComments: "5.8K", tags: ["fashion", "italian", "luxury", "florence"], lastPost: "11h ago", platform: "instagram" },
  { handle: "@ryanadventure", name: "Ryan O'Brien", niche: "Extreme Sports", location: "Dublin", followers: "1.4M", eng: "10.6%", posts: "823", avgLikes: "117K", avgComments: "4.2K", tags: ["extreme", "sports", "surfing", "adventure"], lastPost: "8h ago", platform: "tiktok" },
  { handle: "@aishawrites", name: "Aisha Kamara", niche: "Books & Literature", location: "Lagos", followers: "580K", eng: "14.9%", posts: "364", avgLikes: "49K", avgComments: "8.2K", tags: ["books", "literature", "poetry", "africa"], lastPost: "1d ago", platform: "instagram" },
  { handle: "@lucastech", name: "Lucas Weber", niche: "AI & Innovation", location: "Munich", followers: "2.7M", eng: "7.8%", posts: "1.1K", avgLikes: "203K", avgComments: "9.6K", tags: ["ai", "tech", "innovation", "future"], lastPost: "2h ago", platform: "youtube" },
];

const PLATFORM_COLORS: Record<string, { bg: string; label: string }> = {
  instagram: { bg: "#E1306C", label: "Instagram" },
  tiktok: { bg: "#010101", label: "TikTok" },
  youtube: { bg: "#FF0000", label: "YouTube" },
};

const IMAGE_WIDTH = 180;
const IMAGE_HEIGHT = 180;
const GAP = 25;
const SUBDIV = 32;

export default function InfinitePortraitGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const buffersRef = useRef<{
    position: WebGLBuffer | null;
    texCoord: WebGLBuffer | null;
    index: WebGLBuffer | null;
    indexCount: number;
  }>({ position: null, texCoord: null, index: null, indexCount: 0 });
  const texturesRef = useRef<WebGLTexture[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const viewOffsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    velocityX: 0,
    velocityY: 0,
  });
  const bulgeRef = useRef({ strength: 0.4, radius: 1.5, adjustedRadius: 1.5 });
  const animFrameRef = useRef<number>(0);

  const [loadingText, setLoadingText] = useState("Loading... 0%");
  const [loaded, setLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [selectedData, setSelectedData] = useState<{ src: string; index: number } | null>(null);
  const selectedDataRef = useRef<{ src: string; index: number } | null>(null);
  selectedDataRef.current = selectedData;

  // ── helpers ───────────────────────────────────────────────────────────────

  function applyBulgeJS(posX: number, posY: number, resX: number, resY: number, strength: number, radius: number) {
    let normX = posX / resX;
    let normY = posY / resY;
    let deltaX = normX - 0.5;
    let deltaY = normY - 0.5;
    const aspect = resX / resY;
    deltaX *= aspect;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist < radius) {
      const t = dist / radius;
      const z = Math.sqrt(0.5 - t * t);
      const factor = 0.35 + strength / z;
      deltaX *= factor;
      deltaY *= factor;
      deltaX /= aspect;
      normX = 0.5 + deltaX;
      normY = 0.5 + deltaY;
      posX = normX * resX;
      posY = normY * resY;
    }
    return { x: posX, y: posY };
  }

  function getVisibleTilesData(canvasW: number, canvasH: number, ox: number, oy: number, count: number) {
    const tileW = IMAGE_WIDTH + GAP;
    const tileH = IMAGE_HEIGHT + GAP;
    const tiles: { x: number; y: number; imageIndex: number }[] = [];
    if (count === 0) return tiles;
    // Always hash within MES_IMAGES.length so imageIndex stays in 0..(n-1)
    // and maps 1-to-1 with INFLUENCERS. Using the loaded `count` (which can
    // be up to 50) caused top/bottom row hashes to land in indices 25-49,
    // which then wrapped unpredictably through INFLUENCERS (len 25).
    const hashMod = MES_IMAGES.length;
    for (
      let y = Math.floor((oy - canvasH) / tileH) - 1;
      y <= Math.ceil((oy + canvasH * 2) / tileH) + 1;
      y++
    ) {
      for (
        let x = Math.floor((ox - canvasW) / tileW) - 1;
        x <= Math.ceil((ox + canvasW * 2) / tileW) + 1;
        x++
      ) {
        const hash = (x * 7919 + y * 7307) % hashMod;
        tiles.push({ x: x * tileW, y: y * tileH, imageIndex: Math.abs(hash) });
      }
    }
    return tiles;
  }

  function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program error:", gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function createTexture(gl: WebGLRenderingContext, img: HTMLImageElement): WebGLTexture {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return tex;
  }

  function getAdjustedRadius(w: number, h: number, baseRadius: number) {
    const minDim = Math.min(w, h);
    const diagonal = Math.sqrt(Math.pow(w / minDim, 2) + Math.pow(h / minDim, 2));
    return Math.max(baseRadius, diagonal * 0.6 * 1.2);
  }

  // ── init WebGL ────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) { alert("WebGL not supported"); return; }
    glRef.current = gl;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bulgeRef.current.adjustedRadius = getAdjustedRadius(canvas.width, canvas.height, bulgeRef.current.radius);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      uniform vec2 uResolution;
      uniform vec2 uOffset;
      uniform float uRotation;
      uniform vec2 uImagePosition;
      uniform float uBulgeStrength;
      uniform float uBulgeRadius;

      vec2 applyBulge(vec2 pos){
        vec2 norm = pos / uResolution;
        vec2 center = vec2(0.5, 0.5);
        vec2 delta = norm - center;
        float aspect = uResolution.x / uResolution.y;
        delta.x *= aspect;
        float dist = length(delta);
        if(dist < uBulgeRadius){
          float t = dist / uBulgeRadius;
          float z = sqrt(0.5 - t * t);
          delta *= 0.35 + uBulgeStrength / z;
          delta.x /= aspect;
          norm = center + delta;
          pos = norm * uResolution;
        }
        return pos;
      }

      void main(){
        vec2 pos = aPosition * vec2(${IMAGE_WIDTH}.0, ${IMAGE_HEIGHT}.0);
        pos += uImagePosition;
        pos -= uOffset;
        vec2 center = uImagePosition + vec2(${IMAGE_WIDTH / 2.0}, ${IMAGE_HEIGHT / 2.0}) - uOffset;
        pos -= center;
        float cosR = cos(uRotation);
        float sinR = sin(uRotation);
        pos = vec2(pos.x*cosR - pos.y*sinR, pos.x*sinR + pos.y*cosR);
        pos += center;
        pos = applyBulge(pos);
        vec2 clip = pos / uResolution * 2.0 - 1.0;
        gl_Position = vec4(clip, 0.0, 1.0);
        vTexCoord = aTexCoord;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform sampler2D uSampler;
      void main(){
        vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
        vec4 color = texture2D(uSampler, uv);
        if(color.a < 0.01) discard;
        gl_FragColor = color;
      }
    `;
    programRef.current = createProgram(gl, vsSource, fsSource);

    const positions: number[] = [];
    const texCoords: number[] = [];
    const indices: number[] = [];
    for (let y = 0; y <= SUBDIV; y++) {
      for (let x = 0; x <= SUBDIV; x++) {
        positions.push(x / SUBDIV, y / SUBDIV);
        texCoords.push(x / SUBDIV, y / SUBDIV);
      }
    }
    for (let y = 0; y < SUBDIV; y++) {
      for (let x = 0; x < SUBDIV; x++) {
        const i = y * (SUBDIV + 1) + x;
        indices.push(i, i + 1, i + SUBDIV + 1);
        indices.push(i + 1, i + SUBDIV + 2, i + SUBDIV + 1);
      }
    }

    const posBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const tcBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, tcBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    const idxBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    buffersRef.current = { position: posBuf, texCoord: tcBuf, index: idxBuf, indexCount: indices.length };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── load images ───────────────────────────────────────────────────────────

  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;

    const imageSources = MES_IMAGES.length > 0 ? MES_IMAGES : getDefaultImages();
    const total = Math.max(50, imageSources.length);
    let loadedCount = 0;

    function getDefaultImages() {
      return [1011, 1015, 1018, 1020, 1023].map(
        (id) => `https://picsum.photos/id/${id}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`
      );
    }

    async function loadAll() {
      for (let i = 0; i < total; i++) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = imageSources[i % imageSources.length];
          img.onload = () => {
            imagesRef.current.push(img);
            texturesRef.current.push(createTexture(gl, img));
            loadedCount++;
            setLoadingText(`Loading... ${Math.round((loadedCount / total) * 100)}%`);
            resolve();
          };
          img.onerror = () => {
            img.src = `https://picsum.photos/id/${(i % 100) + 1}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`;
            img.onload = () => {
              imagesRef.current.push(img);
              texturesRef.current.push(createTexture(gl, img));
              loadedCount++;
              setLoadingText(`Loading... ${Math.round((loadedCount / total) * 100)}%`);
              resolve();
            };
            img.onerror = resolve;
          };
        });
      }
      setLoaded(true);
    }

    loadAll();
  }, []);

  // ── render loop ───────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = glRef.current;

    function render() {
      if (!gl || !programRef.current || imagesRef.current.length === 0) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programRef.current);

      const { position, texCoord, index, indexCount } = buffersRef.current;

      const posLoc = gl.getAttribLocation(programRef.current, "aPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, position);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const tcLoc = gl.getAttribLocation(programRef.current, "aTexCoord");
      gl.enableVertexAttribArray(tcLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoord);
      gl.vertexAttribPointer(tcLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);

      const resLoc = gl.getUniformLocation(programRef.current, "uResolution");
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      const offsetLoc = gl.getUniformLocation(programRef.current, "uOffset");
      const imgPosLoc = gl.getUniformLocation(programRef.current, "uImagePosition");
      const samplerLoc = gl.getUniformLocation(programRef.current, "uSampler");
      const bsLoc = gl.getUniformLocation(programRef.current, "uBulgeStrength");
      const brLoc = gl.getUniformLocation(programRef.current, "uBulgeRadius");
      gl.uniform1f(bsLoc, bulgeRef.current.strength);
      gl.uniform1f(brLoc, bulgeRef.current.adjustedRadius);

      const tiles = getVisibleTilesData(canvas.width, canvas.height, viewOffsetRef.current.x, viewOffsetRef.current.y, imagesRef.current.length);
      for (const t of tiles) {
        gl.uniform2f(offsetLoc, viewOffsetRef.current.x, viewOffsetRef.current.y);
        gl.uniform2f(imgPosLoc, t.x, t.y);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[t.imageIndex]);
        gl.uniform1i(samplerLoc, 0);
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
      }
    }

    function animate() {
      const drag = dragRef.current;
      if (!drag.isDragging) {
        viewOffsetRef.current.x -= drag.velocityX;
        viewOffsetRef.current.y -= drag.velocityY;
        drag.velocityX *= 0.95;
        drag.velocityY *= 0.95;
        if (Math.abs(drag.velocityX) < 0.01) drag.velocityX = 0;
        if (Math.abs(drag.velocityY) < 0.01) drag.velocityY = 0;
      }
      render();
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ── event listeners ───────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current!;

    const handleCanvasClick = (clientX: number, clientY: number) => {
      if (selectedDataRef.current) return;

      const { width, height } = canvas;
      const { x: ox, y: oy } = viewOffsetRef.current;
      const b = bulgeRef.current;
      const count = imagesRef.current.length;
      if (count === 0) return;

      const tiles = getVisibleTilesData(width, height, ox, oy, count);

      let closestTile = null;
      let minDistance = Infinity;

      for (const t of tiles) {
        const cx = t.x + IMAGE_WIDTH / 2 - ox;
        const cy = t.y + IMAGE_HEIGHT / 2 - oy;
        const bulgedCenter = applyBulgeJS(cx, cy, width, height, b.strength, b.adjustedRadius);
        // WebGL renders with Y flipped relative to CSS screen coords:
        //   CSS_y_on_screen = height - bulgedCenter.y
        // So we must compare bulgedCenter.y against (height - clientY), not clientY directly.
        // This is why top/bottom rows were swapped (middle is symmetric → unaffected).
        const dist = Math.sqrt(Math.pow(bulgedCenter.x - clientX, 2) + Math.pow(bulgedCenter.y - (height - clientY), 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestTile = t;
        }
      }

      if (closestTile && minDistance < Math.max(IMAGE_WIDTH, IMAGE_HEIGHT)) {
        const imgSrc = imagesRef.current[closestTile.imageIndex]?.src;
        if (imgSrc) {
          setSelectedData({ src: imgSrc, index: closestTile.imageIndex });
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      dragRef.current.isDragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      canvas.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.velocityX = dx * 0.3 + dragRef.current.velocityX * 0.7;
      dragRef.current.velocityY = dy * 0.3 + dragRef.current.velocityY * 0.7;
      viewOffsetRef.current.x -= dragRef.current.velocityX;
      viewOffsetRef.current.y -= dragRef.current.velocityY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };
    const onMouseUp = (e: MouseEvent) => {
      dragRef.current.isDragging = false;
      canvas.style.cursor = "grab";
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        handleCanvasClick(e.clientX, e.clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      dragRef.current.isDragging = true;
      dragRef.current.lastX = e.touches[0].clientX;
      dragRef.current.lastY = e.touches[0].clientY;
      dragRef.current.startX = e.touches[0].clientX;
      dragRef.current.startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - dragRef.current.lastX;
      const dy = e.touches[0].clientY - dragRef.current.lastY;
      dragRef.current.velocityX = dx * 0.3 + dragRef.current.velocityX * 0.7;
      dragRef.current.velocityY = dy * 0.3 + dragRef.current.velocityY * 0.7;
      viewOffsetRef.current.x -= dragRef.current.velocityX;
      viewOffsetRef.current.y -= dragRef.current.velocityY;
      dragRef.current.lastX = e.touches[0].clientX;
      dragRef.current.lastY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      dragRef.current.isDragging = false;
      const dx = dragRef.current.lastX - dragRef.current.startX;
      const dy = dragRef.current.lastY - dragRef.current.startY;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        handleCanvasClick(dragRef.current.lastX, dragRef.current.lastY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      dragRef.current.velocityX += e.deltaX * 0.5;
      dragRef.current.velocityY += e.deltaY * 0.5;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const b = bulgeRef.current;
      switch (e.key) {
        case "+": case "=":
          b.strength = Math.min(1.5, b.strength + 0.05); break;
        case "-": case "_":
          b.strength = Math.max(0, b.strength - 0.05); break;
        case "[":
          b.radius = Math.max(0.5, b.radius - 0.05);
          b.adjustedRadius = getAdjustedRadius(canvas.width, canvas.height, b.radius);
          break;
        case "]":
          b.radius = Math.min(3, b.radius + 0.05);
          b.adjustedRadius = getAdjustedRadius(canvas.width, canvas.height, b.radius);
          break;
        case "r": case "R":
          b.strength = 0.6; b.radius = 1.5;
          b.adjustedRadius = getAdjustedRadius(canvas.width, canvas.height, b.radius);
          break;
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // ── fullscreen ────────────────────────────────────────────────────────────

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── modal animations ──────────────────────────────────────────────────────

  useEffect(() => {
    if (selectedData) {
      gsap.to(".overlay-bg", { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        ".influencer-card",
        { opacity: 0, scale: 0.85, y: 40, rotationX: 8 },
        { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 0.55, ease: "back.out(1.2)", delay: 0.05 }
      );
    }
  }, [selectedData]);

  const closeCard = () => {
    gsap.to(".influencer-card", {
      scale: 0.88,
      y: 30,
      rotationX: 8,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
    });
    gsap.to(".overlay-bg", {
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setSelectedData(null),
    });
  };

  // ── render ────────────────────────────────────────────────────────────────

  // imageIndex is now always in 0..(MES_IMAGES.length-1) == 0..24,
  // which is the same length as INFLUENCERS, so the modulo is a no-op safety net.
  const inf = selectedData ? INFLUENCERS[selectedData.index % INFLUENCERS.length] : null;
  const platformColor = inf ? (PLATFORM_COLORS[inf.platform]?.bg ?? "#333") : "#333";

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#000",
        width: "100vw",
        height: "100vh",
        touchAction: "none",
        userSelect: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      }}
    >
      {/* black overlay while loading */}
      {!loaded && (
        <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 999 }} />
      )}

      {/* loading text */}
      {!loaded && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: 20,
            zIndex: 1000,
            background: "rgba(0,0,0,0.8)",
            padding: "20px 40px",
            borderRadius: 10,
            fontFamily: "monospace",
            pointerEvents: "none",
          }}
        >
          {loadingText}
        </div>
      )}

      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          outline: "none",
          cursor: "grab",
          touchAction: "none",
        }}
      />

      {/* fullscreen button */}
      <button
        aria-label="Fullscreen"
        onClick={toggleFullscreen}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 44,
          height: 44,
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isFullscreen ? "⊡" : "⛶"}
      </button>

      {/* ── Influencer Card Modal ─────────────────────────────────────────── */}
      {selectedData && inf && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            perspective: "1000px",
            pointerEvents: "auto",
          }}
          onClick={closeCard}
        >
          {/* backdrop */}
          <div
            className="overlay-bg"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(14px)",
              opacity: 0,
            }}
          />

          {/* card */}
          <div
            className="influencer-card"
            style={{
              position: "relative",
              width: 340,
              borderRadius: 22,
              overflow: "hidden",
              background: "rgba(14,14,18,0.92)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={closeCard}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.55)",
                border: "0.5px solid rgba(255,255,255,0.18)",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            {/* cover image */}
            <div style={{ position: "relative" }}>
              <img
                src={selectedData.src}
                alt={inf.name}
                style={{ width: "100%", height: 210, objectFit: "cover", display: "block" }}
              />
              {/* gradient overlay on image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 35%, rgba(14,14,18,0.95) 100%)",
                }}
              />

              {/* platform badge + handle */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    background: platformColor,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 11px",
                    borderRadius: 20,
                    letterSpacing: "0.2px",
                  }}
                >
                  {inf.handle}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 20,
                    border: "0.5px solid rgba(255,255,255,0.15)",
                  }}
                >
                  ✦ Verified
                </span>
              </div>
            </div>

            {/* body */}
            <div style={{ padding: "16px 18px 20px" }}>

              {/* name + follow */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 3px", lineHeight: 1.2 }}>
                    {inf.name}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                    {inf.niche} · {inf.location}
                  </p>
                </div>
                <button
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "0.5px solid rgba(255,255,255,0.22)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "7px 16px",
                    borderRadius: 20,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    flexShrink: 0,
                    marginLeft: 10,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                >
                  + Follow
                </button>
              </div>

              {/* stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Followers", value: inf.followers },
                  { label: "Eng. rate", value: inf.eng },
                  { label: "Posts", value: inf.posts },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      padding: "10px 8px",
                      textAlign: "center",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {inf.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: `${platformColor}22`,
                      color: platformColor === "#010101" ? "#aaa" : platformColor,
                      fontSize: 11,
                      padding: "4px 11px",
                      borderRadius: 20,
                      border: `0.5px solid ${platformColor}44`,
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* avg engagement */}
              <div
                style={{
                  borderTop: "0.5px solid rgba(255,255,255,0.09)",
                  paddingTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 14 }}>♥</span> {inf.avgLikes} avg
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 14 }}>💬</span> {inf.avgComments} avg
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                  Last post {inf.lastPost}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  ); 
}