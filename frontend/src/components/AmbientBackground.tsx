import React, { useEffect, useRef, useState } from "react";
import { LeafParticle, FireflyParticle, RippleEffect } from "../types";
import { audioEngine } from "./AudioEngine";

interface AmbientBackgroundProps {
  onInteraction?: (x: number, y: number) => void;
  intensity?: "normal" | "blooming";
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  onInteraction,
  intensity = "normal",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Refs for particle animation loop to avoid state re-render lags
  const leavesRef = useRef<LeafParticle[]>([]);
  const firefliesRef = useRef<FireflyParticle[]>([]);
  const ripplesRef = useRef<RippleEffect[]>([]);
  const nextIdRef = useRef(1);

  // Initialize and spawn particles
  useEffect(() => {
    const width = dimensions.width;
    const height = dimensions.height;

    // Spawn 15 leaves
    const initialLeaves: LeafParticle[] = Array.from({ length: 18 }).map(() => ({
      id: nextIdRef.current++,
      x: Math.random() * width,
      y: Math.random() * height - 50,
      size: 8 + Math.random() * 12,
      speedY: 0.4 + Math.random() * 0.6,
      speedX: -0.2 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.01 + Math.random() * 0.02,
      opacity: 0.15 + Math.random() * 0.4,
    }));

    // Spawn 22 fireflies
    const initialFireflies: FireflyParticle[] = Array.from({ length: 25 }).map(() => ({
      id: nextIdRef.current++,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3,
      speedX: -0.3 + Math.random() * 0.6,
      speedY: -0.2 + Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    leavesRef.current = initialLeaves;
    firefliesRef.current = initialFireflies;
  }, [dimensions]);

  // Handle ResizeObserver as per Guidelines
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timer: NodeJS.Timeout;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        clearTimeout(timer);
        timer = setTimeout(() => {
          setDimensions({ width, height });
        }, 100); // debounced update
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Animation Loop (60 FPS Canvas rendering)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.01;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // 1. Draw subtle background rays
      drawSunRays(ctx, dimensions.width, dimensions.height, pulseTime);

      // 2. Draw & Update Ripples
      ripplesRef.current = ripplesRef.current.map((rip) => {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.scale * 60, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${rip.opacity * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.scale * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, ${rip.opacity * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        return {
          ...rip,
          scale: rip.scale + 0.02,
          opacity: rip.opacity - 0.015,
        };
      }).filter((rip) => rip.opacity > 0);

      // 3. Draw & Update Fireflies (Glowing bio-particles)
      firefliesRef.current.forEach((ff) => {
        // Shifting drift
        ff.x += ff.speedX + Math.sin(pulseTime + ff.id) * 0.15;
        ff.y += ff.speedY;

        // Pulse opacity
        ff.opacity += Math.sin(pulseTime * 5 * ff.pulseSpeed) * 0.015;
        if (ff.opacity < 0.1) ff.opacity = 0.1;
        if (ff.opacity > 0.95) ff.opacity = 0.95;

        // Reset off-screen bounds
        if (ff.x < -10) ff.x = dimensions.width + 10;
        if (ff.x > dimensions.width + 10) ff.x = -10;
        if (ff.y < -10) ff.y = dimensions.height + 10;
        if (ff.y > dimensions.height + 10) ff.y = -10;

        // Repel from mouse
        if (mouseRef.current.active) {
          const dx = ff.x - mouseRef.current.x;
          const dy = ff.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            ff.x += (dx / dist) * force * 3;
            ff.y += (dy / dist) * force * 3;
          }
        }

        // Draw glowing firefly
        const radial = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 3.5);
        const glowColor = intensity === "blooming" ? "16, 185, 129" : "34, 197, 94";
        radial.addColorStop(0, `rgba(${glowColor}, ${ff.opacity})`);
        radial.addColorStop(0.3, `rgba(${glowColor}, ${ff.opacity * 0.4})`);
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw & Update Leaves (Falling organic matter)
      leavesRef.current.forEach((leaf) => {
        // Physics drift
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(pulseTime * 0.8 + leaf.id) * 0.25;
        leaf.rotation += leaf.rotSpeed;

        // Reset off-screen
        if (leaf.y > dimensions.height + 20) {
          leaf.y = -20;
          leaf.x = Math.random() * dimensions.width;
        }
        if (leaf.x < -20) leaf.x = dimensions.width + 20;
        if (leaf.x > dimensions.width + 20) leaf.x = -20;

        // Mouse hover push
        if (mouseRef.current.active) {
          const dx = leaf.x - mouseRef.current.x;
          const dy = leaf.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            leaf.x += (dx / dist) * force * 2;
            leaf.y += (dy / dist) * force * 2;
            leaf.rotation += leaf.rotSpeed * force * 15;
          }
        }

        // Draw stylized organic leaf shape
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);

        ctx.beginPath();
        // Leaf curvature paths
        ctx.moveTo(0, -leaf.size / 2);
        ctx.quadraticCurveTo(leaf.size / 2.5, -leaf.size / 6, 0, leaf.size / 2);
        ctx.quadraticCurveTo(-leaf.size / 2.5, -leaf.size / 6, 0, -leaf.size / 2);

        // Emerald/Mint organic transition gradient
        const leafGrad = ctx.createLinearGradient(0, -leaf.size / 2, 0, leaf.size / 2);
        const col1 = intensity === "blooming" ? "rgba(16, 185, 129, " : "rgba(34, 197, 94, ";
        const col2 = intensity === "blooming" ? "rgba(5, 150, 105, " : "rgba(21, 128, 61, ";
        
        leafGrad.addColorStop(0, `${col1}${leaf.opacity})`);
        leafGrad.addColorStop(1, `${col2}${leaf.opacity * 0.7})`);

        ctx.fillStyle = leafGrad;
        ctx.fill();

        // Draw subtle leaf spine
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size / 2);
        ctx.lineTo(0, leaf.size / 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${leaf.opacity * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, intensity]);

  // Helper: Draw soft slow rotating rays representing filtered sun rays through forest canopy
  const drawSunRays = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number
  ) => {
    ctx.save();
    // Origin at center top
    const ox = w * 0.3;
    const oy = -50;

    const numRays = 4;
    const baseAngle = 0.25; // 45 degrees approx
    
    for (let i = 0; i < numRays; i++) {
      const angleOffset = Math.sin(time * 0.1 + i * 1.5) * 0.08;
      const angle = baseAngle + (i * 0.15) + angleOffset;
      
      const gradient = ctx.createRadialGradient(ox, oy, 10, ox + Math.cos(angle) * 300, oy + Math.sin(angle) * 300, w * 0.6);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.06)");
      gradient.addColorStop(0.3, "rgba(14, 165, 233, 0.03)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.arc(ox, oy, Math.max(w, h) * 1.5, angle - 0.04, angle + 0.04);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    ctx.restore();
  };

  // Canvas Interactions
  const handleInteraction = (clientX: number, clientY: number, triggerAudio = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mouseRef.current = { x, y, active: true };

    if (triggerAudio) {
      // Setup and audio play-triggered ripple
      const randomSound = Math.random() > 0.55;
      if (randomSound) {
        audioEngine.playWaterRipple();
      } else {
        audioEngine.playLeafRustle();
      }

      // Add ripple effect to array
      const newRipple: RippleEffect = {
        id: nextIdRef.current++,
        x,
        y,
        scale: 0.1,
        opacity: 0.8,
      };
      ripplesRef.current = [...ripplesRef.current, newRipple];

      // Spark callback
      if (onInteraction) {
        onInteraction(clientX, clientY);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleInteraction(e.clientX, e.clientY, false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY, false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handleInteraction(e.clientX, e.clientY, true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      id="ambient-container"
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0A0A]"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sophisticated Dark radial grid lines */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0" />

      {/* Aurora Northern Lights Blurs matching Sophisticated Dark specification */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Canvas backdrop */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full cursor-pointer z-10 block"
      />

      {/* Modern minimalist pine forests silhouettes at very bottom */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#090909] via-[#0d0d0f]/60 to-transparent pointer-events-none z-0">
        <svg
          className="absolute bottom-0 w-full h-24 text-emerald-950/20 fill-current opacity-40 translate-y-3"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,80 L30,50 L40,65 L70,30 L90,55 L130,10 L160,45 L190,20 L220,50 L250,15 L280,45 L310,25 L340,60 L380,10 L410,40 L450,20 L490,65 L520,35 L560,70 L600,15 L640,60 L680,25 L710,50 L750,10 L790,55 L830,20 L860,45 L900,15 L940,55 L980,20 L1020,60 L1050,30 L1090,55 L1130,10 L1170,45 L1200,30 L1200,120 L0,120 Z" />
        </svg>
        <svg
          className="absolute bottom-0 w-full h-20 text-[#09090a]/90 fill-current pointer-events-none"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,100 L40,75 L60,85 L110,50 L140,70 L200,25 L240,60 L280,35 L330,70 L370,45 L410,75 L470,30 L520,65 L570,40 L630,75 L680,35 L730,65 L780,25 L830,60 L880,30 L920,65 L980,25 L1030,60 L1080,35 L1140,65 L1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};

export default AmbientBackground;
