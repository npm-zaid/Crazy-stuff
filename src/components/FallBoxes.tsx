import { useRef, useEffect, useState } from "react";
import Matter from "matter-js";

export default function FallBoxes({
  items = [],
  trigger = "auto", // auto | scroll | click | hover
  gravity = 1,
  mouseConstraintStiffness = 0.4
}) {
  const containerRef = useRef(null);
  const boxesRef = useRef([]);
  const [effectStarted, setEffectStarted] = useState(false);

  // ───────────────── TRIGGER ─────────────────
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
        { threshold: 0.25 }
      );

      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  const handleTrigger = () => {
    if (!effectStarted) setEffectStarted(true);
  };

  // ─────────────── MATTER PHYSICS ───────────────
  useEffect(() => {
    if (!effectStarted || items.length === 0) return;

    const { Engine, World, Bodies, Mouse, MouseConstraint, Runner } = Matter;

    const container = containerRef.current.getBoundingClientRect();
    const W = container.width;
    const H = container.height;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    // WALLS
    const wallOpts = { isStatic: true };
    const floor = Bodies.rectangle(W / 2, H + 40, W, 80, wallOpts);
    const left = Bodies.rectangle(-40, H / 2, 80, H, wallOpts);
    const right = Bodies.rectangle(W + 40, H / 2, 80, H, wallOpts);
    const top = Bodies.rectangle(W / 2, -40, W, 80, wallOpts);

    // BODIES FROM DOM
    const bodies = boxesRef.current.map((elem, i) => {
      const item = items[i];
      const rect = elem.getBoundingClientRect();

      const x = rect.left - container.left + rect.width / 2;
      const y = rect.top - container.top + rect.height / 2;

      let body;

      if (item.type === "ball") {
        body = Bodies.circle(x, y, rect.width / 2, {
          restitution: 0.95,
          frictionAir: 0.01
        });
      } else {
        body = Bodies.rectangle(x, y, rect.width, rect.height, {
          chamfer: item.type === "pill" ? { radius: rect.height / 2 } : undefined,
          restitution: 0.8,
          frictionAir: 0.02
        });
      }

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 6,
        y: -2
      });

      return { elem, body };
    });

    // MOUSE
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

    const runner = Runner.create();
    Runner.run(runner, engine);

    // DOM SYNC
    const update = () => {
      bodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        elem.style.zIndex = Math.floor(body.position.y);
      });

      requestAnimationFrame(update);
    };
    update();

    return () => {
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [effectStarted, items, gravity, mouseConstraintStiffness]);

  // ───────────────── RENDER ─────────────────
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-white"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => (boxesRef.current[i] = el)}
          className={`absolute overflow-hidden ${
            item.type === "ball"
              ? "rounded-full shadow-xl"
              : item.type === "pill"
              ? "rounded-full shadow-2xl"
              : "rounded-xl shadow-lg"
          }`}
          style={{
            width: item.size || item.w || 120,
            height: item.size || item.h || 120,
            pointerEvents: "none",
            background: "white"
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}


//  <FallingBox
//   trigger="scroll"
//   gravity={0.7}
//   items={[

//     // 🟢 BALLS — influencer faces (using your 8 images)

//     {
//       id: 1,
//       type: "ball",
//       size: 120,
//       content: (
//         <img
//           src="https://assets.codepen.io/3685267/advertising_dashboard_oqsmigok.png"
//           className="w-full h-full object-cover rounded-full"
//         />
//       )
//     },
//     {
//       id: 2,
//       type: "ball",
//       size: 120,
//       content: (
//         <img
//           src="https://assets.codepen.io/3685267/advertising_dashboard_hiwzaogx.png"
//           className="w-full h-full object-cover rounded-full"
//         />
//       )
//     },
//     {
//       id: 3,
//       type: "ball",
//       size: 120,
//       content: (
//         <img
//           src="https://assets.codepen.io/3685267/advertising_dashboard_bzsdwaaw.png"
//           className="w-full h-full object-cover rounded-full"
//         />
//       )
//     },
//     {
//       id: 4,
//       type: "ball",
//       size: 120,
//       content: (
//         <img
//           src="https://assets.codepen.io/3685267/advertising_dashboard_zdeztokp.png"
//           className="w-full h-full object-cover rounded-full"
//         />
//       )
//     },

//     // 🟣 PILLS — influencer name + niche

//     {
//       id: 5,
//       type: "pill",
//       w: 240,
//       h: 64,
//       content: (
//         <div className="flex items-center gap-3 px-4 h-full bg-black text-white rounded-full">
//           <img
//             src="https://assets.codepen.io/3685267/advertising_dashboard_nsiqbmcp.png"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="leading-tight">
//             <p className="text-sm font-medium">@fitwithmia</p>
//             <p className="text-[11px] text-white/60">Fitness • 420k</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 6,
//       type: "pill",
//       w: 240,
//       h: 64,
//       content: (
//         <div className="flex items-center gap-3 px-4 h-full bg-indigo-600 text-white rounded-full">
//           <img
//             src="https://assets.codepen.io/3685267/advertising_dashboard_vmhdjezu.png"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="leading-tight">
//             <p className="text-sm font-medium">@techwithsam</p>
//             <p className="text-[11px] text-white/80">Tech • 310k</p>
//           </div>
//         </div>
//       )
//     },
//     {
//       id: 7,
//       type: "pill",
//       w: 250,
//       h: 64,
//       content: (
//         <div className="flex items-center gap-3 px-4 h-full bg-emerald-600 text-white rounded-full">
//           <img
//             src="https://assets.codepen.io/3685267/advertising_dashboard_jddlfcvb.png"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <div className="leading-tight">
//             <p className="text-sm font-medium">@travelwithlee</p>
//             <p className="text-[11px] text-white/80">Travel • 520k</p>
//           </div>
//         </div>
//       )
//     },

//     // 🟦 STAT / BRAND CARDS

//     {
//       id: 8,
//       type: "box",
//       w: 160,
//       h: 110,
//       content: (
//         <div className="bg-cyan-500 h-full flex flex-col items-center justify-center text-white">
//           <p className="text-xl font-bold">4.8%</p>
//           <p className="text-xs">Engagement</p>
//         </div>
//       )
//     },
//     {
//       id: 9,
//       type: "box",
//       w: 170,
//       h: 110,
//       content: (
//         <div className="bg-black h-full flex flex-col items-center justify-center text-white">
//           <p className="text-xl font-bold">120+</p>
//           <p className="text-xs">Brands</p>
//         </div>
//       )
//     },
//     {
//       id: 10,
//       type: "box",
//       w: 170,
//       h: 110,
//       content: (
//         <div className="bg-rose-500 h-full flex flex-col items-center justify-center text-white">
//           <p className="text-xl font-bold">2.4M</p>
//           <p className="text-xs">Reach</p>
//         </div>
//       )
//     },

//     // 🟢 MORE BALLS (remaining images)

//     {
//       id: 11,
//       type: "ball",
//       size: 110,
//       content: (
//         <img
//           src="https://assets.codepen.io/3685267/advertising_dashboard_vshneddw.png"
//           className="w-full h-full object-cover rounded-full"
//         />
//       )
//     },

//     // 🟣 MORE PILLS

//     {
//       id: 12,
//       type: "pill",
//       w: 230,
//       h: 60,
//       content: (
//         <div className="flex items-center gap-3 px-4 h-full bg-slate-800 text-white rounded-full">
//           <img
//             src="https://assets.codepen.io/3685267/advertising_dashboard_oqsmigok.png"
//             className="w-9 h-9 rounded-full object-cover"
//           />
//           <span className="text-sm">@beautybyella • 260k</span>
//         </div>
//       )
//     },

//     // 🟦 CAMPAIGN CARDS

//     {
//       id: 13,
//       type: "box",
//       w: 180,
//       h: 120,
//       content: (
//         <div className="bg-purple-600 h-full flex flex-col items-center justify-center text-white">
//           <p className="text-lg font-semibold">Nike</p>
//           <p className="text-xs">Active Campaign</p>
//         </div>
//       )
//     },
//     {
//       id: 14,
//       type: "box",
//       w: 180,
//       h: 120,
//       content: (
//         <div className="bg-amber-500 h-full flex flex-col items-center justify-center text-black">
//           <p className="text-lg font-semibold">Adidas</p>
//           <p className="text-xs">Live Collab</p>
//         </div>
//       )
//     },

//     // 🟣 FINAL TUBE

//     {
//       id: 15,
//       type: "pill",
//       w: 250,
//       h: 64,
//       content: (
//         <div className="flex items-center gap-3 px-4 h-full bg-pink-600 text-white rounded-full">
//           <img
//             src="https://assets.codepen.io/3685267/advertising_dashboard_bzsdwaaw.png"
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <span className="text-sm">@streetstyle • 410k</span>
//         </div>
//       )
//     }

//   ]}
// /> 