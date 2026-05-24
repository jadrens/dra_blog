"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const CONFETTI_SVGS: { src: string; w: number; h: number; weight: number }[] = [
  { src: "/backgrounds/confetti/blue-line-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/gold-line-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/pink-line-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/green-line-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/blue-wave-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/gold-wave-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/pink-wave-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/green-wave-short.svg", w: 80, h: 40, weight: 1.5 },
  { src: "/backgrounds/confetti/blue-circle.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/gold-circle.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/pink-circle.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/green-circle.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/blue-diamond.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/gold-diamond.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/pink-diamond.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/green-diamond.svg", w: 60, h: 60, weight: 1 },
  { src: "/backgrounds/confetti/blue-triangle-sm.svg", w: 40, h: 40, weight: 1 },
  { src: "/backgrounds/confetti/blue-triangle-lg.svg", w: 80, h: 80, weight: 1 },
  { src: "/backgrounds/confetti/gold-triangle-sm.svg", w: 40, h: 40, weight: 1 },
  { src: "/backgrounds/confetti/gold-triangle-lg.svg", w: 80, h: 80, weight: 1 },
  { src: "/backgrounds/confetti/pink-triangle-sm.svg", w: 40, h: 40, weight: 1 },
  { src: "/backgrounds/confetti/pink-triangle-lg.svg", w: 80, h: 80, weight: 1 },
  { src: "/backgrounds/confetti/green-triangle-sm.svg", w: 40, h: 40, weight: 1 },
  { src: "/backgrounds/confetti/green-triangle-lg.svg", w: 80, h: 80, weight: 1 },
];

export default function ConfettiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      await Promise.all(
        CONFETTI_SVGS.map(
          (svg) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = svg.src;
              img.onload = () => {
                imagesRef.current.set(svg.src, img);
                resolve();
              };
              img.onerror = () => resolve();
            })
        )
      );
      setImagesLoaded(true);
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const Engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const { World, Bodies, Body, Events, Runner, Composite } = Matter;

    const width = canvas.width;
    const height = canvas.height;
    const wallThickness = 150;

    const walls = [
      Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, restitution: 0.8 }),
      Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, restitution: 0.8 }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, restitution: 0.8 }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, restitution: 0.8 }),
    ];
    World.add(Engine.world, walls);

    const confettiCount = Math.floor((width * height) / 50000);
    for (let i = 0; i < confettiCount; i++) {
      const totalWeight = CONFETTI_SVGS.reduce((sum, s) => sum + s.weight, 0);
      let random = Math.random() * totalWeight;
      let svgInfo = CONFETTI_SVGS[0];
      for (const s of CONFETTI_SVGS) {
        random -= s.weight;
        if (random <= 0) {
          svgInfo = s;
          break;
        }
      }
      const scale = 0.4 + Math.random() * 0.4;
      const w = svgInfo.w * scale;
      const h = svgInfo.h * scale;
      const x = Math.random() * width;
      const y = Math.random() * height;

      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.6,
        friction: 0.001,
        frictionAir: 0.02,
        angle: Math.random() * Math.PI * 2,
        density: 0.001,
      });

      Body.setVelocity(body, { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.005);

      (body as any).svgKey = svgInfo.src;
      (body as any).scale = scale;
      (body as any).driftPhase = Math.random() * Math.PI * 2;
      (body as any).driftFreq = 0.2 + Math.random() * 0.3;
      World.add(Engine.world, body);
    }

    let time = 0;
    Events.on(Engine, "beforeUpdate", () => {
      time += 0.016;
      const mouse = mouseRef.current;

      Composite.allBodies(Engine.world).forEach((body: Matter.Body) => {
        if (body.isStatic) return;

        const phase = (body as any).driftPhase || 0;
        const freq = (body as any).driftFreq || 0.3;

        // Each body has unique random drift direction
        const forceScale = 0.00002;
        Body.applyForce(body, body.position, {
          x: Math.sin(time * freq + phase) * forceScale,
          y: Math.cos(time * freq + phase * 1.5) * forceScale,
        });

        // Mouse push effect
        const dx = body.position.x - mouse.x;
        const dy = body.position.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const pushForce = 0.0003 * (1 - dist / 150);
          Body.applyForce(body, body.position, {
            x: (dx / dist) * pushForce,
            y: (dy / dist) * pushForce,
          });
        }
      });
    });

    const runner = Runner.create();
    Runner.run(runner, Engine);

    let frameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      Composite.allBodies(Engine.world).forEach((body: Matter.Body) => {
        if (body.isStatic) return;
        const svgKey = (body as any).svgKey as string;
        const img = imagesRef.current.get(svgKey);
        if (!img) return;
        const scale = (body as any).scale as number;

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.drawImage(img, -img.width * scale / 2, -img.height * scale / 2, img.width * scale, img.height * scale);
        ctx.restore();
      });

      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      Runner.stop(runner);
      Matter.Engine.clear(Engine);
      cancelAnimationFrame(frameId);
    };
  }, [imagesLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ cursor: "default" }}
    />
  );
}