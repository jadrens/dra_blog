"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const AVATAR_SIZE = 35;
const DRAG_RADIUS_MULTIPLIER = 3;

export default function BouncingAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const hasStarted = useRef(false);
  const avatarRef = useRef<any>(null);
  const startPosRef = useRef<{ x: number; y: number; size: number } | null>(null);

  // Start when user clicks footer avatar
  useEffect(() => {
    const avatarEl = document.querySelector('footer img[alt="dragonren"]');
    const handleClick = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      // 保存位置后再删除
      if (avatarEl) {
        const rect = avatarEl.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        startPosRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top - 50,
          size: size / 2,
        };
      }

      setVisible(true);
      avatarEl?.remove();
    };

    avatarEl?.addEventListener("click", handleClick);
    return () => avatarEl?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!visible) return;

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

    const Engine = Matter.Engine.create({ gravity: { x: 0, y: 0.8 } });
    const { World, Bodies, Body, Runner } = Matter;

    const width = canvas.width;
    const height = canvas.height;
    const wallThickness = 100;

    // Use saved position and size
    const startX = startPosRef.current?.x ?? width / 2;
    const startY = startPosRef.current?.y ?? height / 2;
    const radius = startPosRef.current?.size ?? AVATAR_SIZE;

    // Create walls
    const walls = [
      Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, { isStatic: true, restitution: 0.85 }),
      Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, { isStatic: true, restitution: 0.85 }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, restitution: 0.85 }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, restitution: 0.85 }),
    ];
    World.add(Engine.world, walls);

    // Create avatar ball above the footer avatar
    const avatar = Bodies.circle(startX, startY, radius, {
      restitution: 0.7,
      friction: 0.005,
      frictionAir: 0.01,
      density: 0.001,
    });
    avatarRef.current = avatar;
    World.add(Engine.world, avatar);

    // Initial drop velocity with spin
    Body.setVelocity(avatar, { x: (Math.random() - 0.5) * 4, y: 2 });
    Body.setAngularVelocity(avatar, (Math.random() - 0.5) * 0.1);

    const runner = Runner.create();
    Runner.run(runner, Engine);

    // Click - apply force towards mouse position (on document level)
    const handleClick = (e: MouseEvent) => {
      const dx = e.clientX - avatar.position.x;
      const dy = e.clientY - avatar.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const dragRadius = radius * DRAG_RADIUS_MULTIPLIER;

      if (dist <= dragRadius && dist > 1) {
        const forceMagnitude = 0.58;
        const torqueMagnitude = (dx / dist) * 0.02;
        Body.applyForce(avatar, avatar.position, {
          x: (dx / dist) * forceMagnitude,
          y: (dy / dist) * forceMagnitude,
        });
        Body.setAngularVelocity(avatar, avatar.angularVelocity + torqueMagnitude);
      }
    };

    document.addEventListener("click", handleClick);

    // Load avatar image
    const avatarImg = new Image();
    avatarImg.src = "/avatar.png";

    let frameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const body = avatar;
      const x = body.position.x;
      const y = body.position.y;

      ctx.save();

      // Shadow
      ctx.beginPath();
      ctx.arc(x + 3, y + 3, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fill();

      // Circle background
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Avatar image clipped to circle
      ctx.beginPath();
      ctx.arc(x, y, radius - 1, 0, Math.PI * 2);
      ctx.clip();

      if (avatarImg.complete) {
        ctx.drawImage(avatarImg, x - radius + 1, y - radius + 1, (radius - 1) * 2, (radius - 1) * 2);
      }

      ctx.restore();

      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", handleClick);
      Runner.stop(runner);
      Matter.Engine.clear(Engine);
      cancelAnimationFrame(frameId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }} />
  );
}