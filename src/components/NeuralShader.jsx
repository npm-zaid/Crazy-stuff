'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // --- SIMPLE NEURAL-LIKE DISTORTION -----------------
  float sigmoid(float x) { return 1.0 / (1.0 + exp(-x)); }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;

    float n = sin(uv.x * 3.0 + uTime * 0.8) +
              cos(uv.y * 4.0 + uTime * 0.4);

    float m = length(uv - uMouse * 0.3);

    float glow = sigmoid(n * 2.0 - m * 6.0);

    vec3 col = mix(vec3(0.05, 0.1, 0.2), vec3(0.6, 0.9, 1.0), glow);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function NeuralPlane() {
  const matRef = useRef();
  const [mouse, setMouse] = useState([0, 0]);

  // update uniforms every frame
  useFrame((state) => {
    if (!matRef.current) return;

    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    matRef.current.uniforms.uMouse.value = new THREE.Vector2(
      mouse[0],
      mouse[1]
    );
  });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMouse([x, -y]);
  };

  return (
    <mesh onPointerMove={handleMouseMove}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function NeuralShader() {
  return (
    <div className="w-screen h-screen">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true }}
      >
        <NeuralPlane />
      </Canvas>
    </div>
  );
}
