import { useEffect, useRef, useCallback } from "react";
import GUI from "lil-gui";

const EXCERPT = `Many people will probably judge us callous as well as mad for thinking about the northward tunnel and the abyss so soon after our somber discovery, and I am not prepared to say that we would have immediately revived such thoughts but for a specific circumstance which broke in upon us and set up a whole new train of speculations. We had replaced the tarpaulin over poor Gedney and were standing in a kind of mute bewilderment when the sounds finally reached our consciousness—the first sounds we had heard since descending out of the open where the mountain wind whined faintly from its unearthly heights. Well-known and mundane though they were, their presence in this remote world of death was more unexpected and unnerving than any grotesque or fabulous tones could possibly have been—since they gave a fresh upsetting to all our notions of cosmic harmony. Had it been some trace of that bizarre musical piping over a wide range which Lake's dissection report had led us to expect in those others—and which, indeed, our overwrought fancies had been reading into every wind howl we had heard since coming on the camp horror—it would have had a kind of hellish congruity with the aeon-dead region around us. A voice from other epochs belongs in a graveyard of other epochs. As it was, however, the noise shattered all our profoundly seated adjustments—all our tacit acceptance of the inner antarctic as a waste utterly and irrevocably void of every vestige of normal life. What we heard was not the fabulous note of any buried blasphemy of elder earth from whose supernal toughness an age-denied polar sun had evoked a monstrous response. Instead, it was a thing so mockingly normal and so unerringly familiarized by our sea days off Victoria Land and our camp days at McMurdo Sound that we shuddered to think of it here, where such things ought not to be. To be brief—it was simply the raucous squawking of a penguin. The muffled sound floated from subglacial recesses nearly opposite to the corridor whence we had come—regions manifestly in the direction of that other tunnel to the vast abyss. The presence of a living water bird in such a direction—in a world whose surface was one of age-long and uniform lifelessness—could lead to only one conclusion; hence our first thought was to verify the objective reality of the sound. It was, indeed, repeated, and seemed at times to come from more than one throat. Seeking its source, we entered an archway from which much debris had been cleared; resuming our trail blazing—with an added paper supply taken with curious repugnance from one of the tarpaulin bundles on the sledges—when we left daylight behind.`;

const WORDS = EXCERPT.split(/\s+/);

const defaultCfg = {
  dur: 2050,
  speed: 670,
  bandWidth: 268,
  shrink: 2.5,
  trail: 2.2,
  noise: 4,
  chars: ".,·-─~+:;=*π┐┌┘╔╝║╚!?1742&35$690#@8$▀▄■░▒▓",
  charSpeed: 76,
  density: 1.25,
  minDist: 69,
  maxWaves: 16,
  fontSize: 15,
  lineHeight: 1.35,
};

function hash(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function getWaveIntensity(px, py, wave, now, cfg) {
  const age = now - wave.time;
  const life = 1 - age / cfg.dur;
  const bandHalf = (cfg.bandWidth / 2) * Math.pow(life, cfg.shrink);
  if (bandHalf < 0.5) return -1;

  const front = bandHalf;
  const wake = bandHalf * cfg.trail;
  const dx = px - wave.x;
  const dy = py - wave.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = (age / 1000) * cfg.speed;

  if (dist > radius + front + cfg.noise) return -1;
  if (dist < radius - wake - cfg.noise) return -1;

  const angle = Math.atan2(dy, dx);
  const wobble =
    (Math.sin(angle * 5 + age * 0.004) * 0.45 +
      Math.sin(angle * 8 - age * 0.006) * 0.3 +
      Math.sin(angle * 13 + age * 0.002) * 0.18) *
    cfg.noise;

  const gap = radius + wobble - dist;
  if (gap < -front || gap > wake) return -1;

  const t = gap < 0 ? 1 + gap / front : 1 - gap / wake;
  return smoothstep(t);
}

function pickChar(col, row, intensity, age, waveId, cfg) {
  const len = cfg.chars.length;
  const target = intensity * (len - 1);
  const seed = Math.floor(age / cfg.charSpeed) + waveId;
  const jitter = (hash(col, row, seed) - 0.5) * len * 0.25;
  return cfg.chars[Math.max(0, Math.min(len - 1, Math.round(target + jitter)))];
}

export default function ASCIIWaveEffect() {
  const fieldRef = useRef(null);
  const preRef = useRef(null);
  const stateRef = useRef({
    cfg: { ...defaultCfg },
    charW: 0,
    lineH: 0,
    cols: 0,
    rows: 0,
    grid: [],
    waves: [],
    waveId: 0,
    lastX: -9999,
    lastY: -9999,
    running: false,
    rafId: null,
  });

  const measure = useCallback(() => {
    const s = stateRef.current;
    const field = fieldRef.current;
    if (!field) return;
    const span = document.createElement("span");
    span.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-size:${s.cfg.fontSize}px;font-family:inherit`;
    span.textContent = "M";
    field.appendChild(span);
    s.charW = span.getBoundingClientRect().width;
    span.remove();
    s.lineH = s.cfg.fontSize * s.cfg.lineHeight;
  }, []);

  const buildGrid = useCallback(() => {
    const s = stateRef.current;
    const field = fieldRef.current;
    const pre = preRef.current;
    if (!field || !pre) return;
    measure();
    const rect = field.getBoundingClientRect();
    s.cols = Math.ceil(rect.width / s.charW) + 1;
    s.rows = Math.ceil(rect.height / s.lineH) + 1;
    s.grid = [];
    let wi = 0;
    for (let r = 0; r < s.rows; r++) {
      let line = "";
      while (line.length < s.cols) {
        if (line.length > 0) line += " ";
        line += WORDS[wi % WORDS.length];
        wi++;
      }
      s.grid.push(line.substring(0, s.cols).split(""));
    }
    pre.textContent = s.grid.map((row) => row.join("")).join("\n");
  }, [measure]);

  const loop = useCallback(() => {
    const s = stateRef.current;
    const pre = preRef.current;
    if (!pre) return;
    const now = performance.now();
    s.waves = s.waves.filter((w) => now - w.time < s.cfg.dur);

    if (s.waves.length === 0) {
      pre.textContent = s.grid.map((row) => row.join("")).join("\n");
      s.running = false;
      return;
    }

    let text = "";
    for (let r = 0; r < s.rows; r++) {
      if (r > 0) text += "\n";
      const py = r * s.lineH + s.lineH / 2;
      const rowChars = s.grid[r];
      if (!rowChars) continue;

      for (let c = 0; c < rowChars.length; c++) {
        const ch = rowChars[c];
        if (ch === " ") {
          text += " ";
          continue;
        }

        const px = c * s.charW + s.charW / 2;
        const threshold = hash(c, r, 0);
        let scrambled = false;

        for (const wave of s.waves) {
          const age = now - wave.time;
          const intensity = getWaveIntensity(px, py, wave, now, s.cfg);
          if (intensity < 0) continue;
          if (threshold > intensity * s.cfg.density) break;
          text += pickChar(c, r, intensity, age, wave.id, s.cfg);
          scrambled = true;
          break;
        }
        if (!scrambled) text += ch;
      }
    }
    pre.textContent = text;
    s.rafId = requestAnimationFrame(loop);
  }, []);

  const emitWave = useCallback(
    (x, y) => {
      const s = stateRef.current;
      const dx = x - s.lastX;
      const dy = y - s.lastY;
      if (dx * dx + dy * dy < s.cfg.minDist * s.cfg.minDist) return;
      s.lastX = x;
      s.lastY = y;
      s.waves.push({ x, y, time: performance.now(), id: s.waveId++ });
      if (s.waves.length > s.cfg.maxWaves) s.waves.shift();
      if (!s.running) {
        s.running = true;
        s.rafId = requestAnimationFrame(loop);
      }
    },
    [loop]
  );

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const handleMouseMove = (e) => {
      const r = field.getBoundingClientRect();
      emitWave(e.clientX - r.left, e.clientY - r.top);
    };

    const handleTouchMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const r = field.getBoundingClientRect();
      emitWave(t.clientX - r.left, t.clientY - r.top);
    };

    const handleResize = () => buildGrid();

    const init = () => {
      buildGrid();

      const s = stateRef.current;
      const gui = new GUI({ title: "ASCII Wave Config" });
      gui.add(s.cfg, "speed", 100, 2000, 10).name("Speed");
      gui.add(s.cfg, "bandWidth", 10, 300, 1).name("Band width");
      gui.add(s.cfg, "trail", 1.0, 6.0, 0.1).name("Trail");
      gui.add(s.cfg, "density", 0.1, 2.0, 0.01).name("Density");
      gui.add(s.cfg, "dur", 200, 3000, 10).name("Duration");

      const r = (min, max, step = 1) =>
        Math.round(((min + Math.random() * (max - min)) / step)) * step;
      gui
        .add(
          {
            randomise() {
              s.cfg.speed = r(150, 1600, 10);
              s.cfg.bandWidth = r(20, 280, 1);
              s.cfg.trail = r(1, 5, 0.1);
              s.cfg.density = r(0.3, 1.8, 0.01);
              s.cfg.dur = r(400, 2800, 10);
              gui.controllersRecursive().forEach((c) => c.updateDisplay());
            },
          },
          "randomise"
        )
        .name("Randomise");

      gui.domElement.addEventListener("mouseenter", (e) => e.stopPropagation());
      gui.domElement.addEventListener("mousemove", (e) => e.stopPropagation());

      stateRef.current.gui = gui;
    };

    field.addEventListener("mousemove", handleMouseMove);
    field.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    if (document.fonts?.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 2000)),
      ]).then(init);
    } else {
      window.addEventListener("load", init);
    }

    return () => {
      field.removeEventListener("mousemove", handleMouseMove);
      field.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      const s = stateRef.current;
      if (s.rafId) cancelAnimationFrame(s.rafId);
      if (s.gui) s.gui.destroy();
    };
  }, [buildGrid, emitWave]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[#121211] text-[#f9f9f7d3] font-mono cursor-crosshair select-none touch-none"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <h1 className="absolute w-px h-px overflow-hidden clip-rect-0 whitespace-nowrap border-0">
        ASCII Radial Wave Text Effect Experiment
      </h1>

      <div ref={fieldRef} className="w-full h-full" id="field">
        <pre
          ref={preRef}
          style={{
            margin: 0,
            padding: 0,
            fontFamily: "inherit",
            fontSize: `${defaultCfg.fontSize}px`,
            lineHeight: defaultCfg.lineHeight,
            whiteSpace: "pre",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Radial vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}