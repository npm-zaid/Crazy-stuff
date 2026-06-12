import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { vertex, fragment } from "./Shader";
import { useTexture, useAspect } from "@react-three/drei";
import useMouse from "./useMouse";
import useDimension from "./useDimension";
import { projects } from "./data";

export default function Model({ activeMenu }) {
  const plane = useRef();
  const { viewport } = useThree();
  const dimension = useDimension();
  const mouse = useMouse();

  const opacityRef = useRef(0);

  const textures = projects.map((p) => useTexture(p.src));
  const { width, height } = textures[0].image;

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const scale = useAspect(width, height, 0.225);

  const smoothMouse = {
    x: useRef(0),
    y: useRef(0),
  };

  // ------------------------------
  // Handle menu-based fade in/out
  // ------------------------------
  useEffect(() => {
    if (!plane.current) return;

    if (activeMenu != null) {
      plane.current.material.uniforms.uTexture.value = textures[activeMenu];

      gsap.to(opacityRef, {
        current: 1,
        duration: 0.3,
        onUpdate: () => {
          plane.current.material.uniforms.uAlpha.value = opacityRef.current;
        },
      });
    } else {
      gsap.to(opacityRef, {
        current: 0,
        duration: 0.3,
        onUpdate: () => {
          plane.current.material.uniforms.uAlpha.value = opacityRef.current;
        },
      });
    }
  }, [activeMenu]);

  // ------------------------------
  // Shader uniforms
  // ------------------------------
  const uniforms = useRef({
    uDelta: { value: { x: 0, y: 0 } },
    uAmplitude: { value: 0.0005 },
    uTexture: { value: textures[0] },
    uAlpha: { value: 0 },
  });

  // ------------------------------
  // Mouse-follow + position update
  // ------------------------------
  useFrame(() => {
    if (!plane.current) return;

    const { x, y } = mouse;

    const smoothX = smoothMouse.x.current;
    const smoothY = smoothMouse.y.current;

    // Smoothing
    if (Math.abs(x - smoothX) > 1) {
      smoothMouse.x.current = lerp(smoothX, x, 0.1);
      smoothMouse.y.current = lerp(smoothY, y, 0.1);

      plane.current.material.uniforms.uDelta.value = {
        x: x - smoothX,
        y: -(y - smoothY),
      };
    }

    // Convert screen → viewport just like useTransform
    const posX =
      ((smoothMouse.x.current / dimension.width) * viewport.width) -
      viewport.width / 2;

    const posY =
      (1 - smoothMouse.y.current / dimension.height) * viewport.height -
      viewport.height / 2;

    plane.current.position.x = posX;
    plane.current.position.y = posY;
  });

  return (
    <mesh ref={plane} scale={scale}>
      <planeGeometry args={[1, 1, 15, 15]} />

      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
}
