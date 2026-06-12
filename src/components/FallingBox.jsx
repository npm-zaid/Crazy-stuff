import { useRef, useEffect, useState } from "react";
import Matter from "matter-js";

export default function FallingBox({
  items = [],              // [{ id, content, w, h }]
  trigger = "auto",
  gravity = 1,
  wireframes = false,
  backgroundColor = "transparent",
  mouseConstraintStiffness = 0.5,
  gap = 15
}) {
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const canvasContainerRef = useRef(null);

  const [effectStarted, setEffectStarted] = useState(false);

  // ────────────────────────────────────────────────
  // TRIGGER HANDLING
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }

    if (trigger === "scroll") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  const handleTrigger = () => {
    if (!effectStarted) setEffectStarted(true);
  };

  // ────────────────────────────────────────────────
  // MATTER.JS FALLING BOXES
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!effectStarted || items.length === 0) return;

    const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Runner } =
      Matter;

    const container = containerRef.current.getBoundingClientRect();
    const W = container.width;
    const H = container.height;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width: W,
        height: H,
        background: backgroundColor,
        wireframes
      }
    });

    // WORLD BOUNDARIES
    const staticOpts = { isStatic: true, render: { fillStyle: "transparent" } };
    const floor = Bodies.rectangle(W / 2, H + 20, W, 40, staticOpts);
    const left = Bodies.rectangle(-20, H / 2, 40, H, staticOpts);
    const right = Bodies.rectangle(W + 20, H / 2, 40, H, staticOpts);
    const top = Bodies.rectangle(W / 2, -20, W, 40, staticOpts);

    // CREATE BOX BODIES
    const bodies = boxesRef.current.map((elem) => {
      const rect = elem.getBoundingClientRect();

      const x = rect.left - container.left + rect.width / 2;
      const y = rect.top - container.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.8,
        frictionAir: 0.01
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0
      });

      return { elem, body };
    });

    // Allow dragging
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    });

    World.add(engine.world, [
      floor,
      left,
      right,
      top,
      mouseConstraint,
      ...bodies.map((b) => b.body)
    ]);

    // RUN PHYSICS
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Update DOM positions
    const loop = () => {
      bodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });

      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      canvasContainerRef.current.innerHTML = "";
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [effectStarted, items, gravity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      {/* INITIAL POSITION OF BOXES */}
      <div className="relative z-10 flex gap-5 items-center justify-center pt-10">
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (boxesRef.current[i] = el)}
            className="absolute"
            style={{
              width: item.w || "120px",
              height: item.h || "120px",
              pointerEvents: "none"
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
    </div>
  );
}
