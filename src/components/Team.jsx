import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { vertex, fragment } from "../components/Brand-led/Shader";

const backgrounds = [
  new THREE.Color("#ff4d4d"),   // red
  new THREE.Color("#4dff91"),   // green
  new THREE.Color("#4dc3ff"),   // blue
  new THREE.Color("#ffcd4d"),   // yellow
];

function Slide({ color }) {
  const mesh = useRef();

  const uniforms = useRef({
    uTexture: { value: null },  // unused but required
    uDelta: { value: new THREE.Vector2(0, 0) },
    uAmplitude: { value: 0.25 },
    uAlpha: { value: 1 },
    uColor: { value: color }       // <<< NEW
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1.8, 1.2, 32, 32]} />
      <shaderMaterial
        transparent
        vertexShader={vertex}
        fragmentShader={fragment
          .replace("vec3 texture = texture2D(uTexture, vUv).rgb;", "vec3 texture = uColor;")
        }
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

export default function Team() {
  const [index, setIndex] = useState(0);
  const dir = useRef(1);

  const triggerAnim = () => {
    const mesh = document.querySelector("canvas").__r3f.root.getState().scene.children[0];
    const mat = mesh.material;

    gsap.fromTo(
      mat.uniforms.uDelta.value,
      { x: 0, y: 0 },
      {
        x: dir.current * 1.0,
        y: dir.current * -1.0,
        duration: 1,
        ease: "power2.out",
      }
    );
  };

  const next = () => {
    dir.current = 1;
    triggerAnim();
    setIndex((i) => (i + 1) % backgrounds.length);
  };

  const prev = () => {
    dir.current = -1;
    triggerAnim();
    setIndex((i) => (i - 1 + backgrounds.length) % backgrounds.length);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Slide color={backgrounds[index]} />
      </Canvas>

      <div className="absolute bottom-10 w-full flex justify-center gap-4">
        <button onClick={prev} className="text-white px-4 py-2 bg-white/20 backdrop-blur">
          Prev
        </button>
        <button onClick={next} className="text-white px-4 py-2 bg-white/20 backdrop-blur">
          Next
        </button>
      </div>
    </div>
  );
}
