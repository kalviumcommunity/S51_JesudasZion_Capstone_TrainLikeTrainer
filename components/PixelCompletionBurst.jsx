'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelTrophy, PixelFlame } from './PixelSportsAnimations';

export function PixelCompletionBurst({
  trigger = false,
  title = "DRILL COMPLETED!",
  subtitle = "Protocol Mastered",
  xpEarned = 150,
  colors = ['#FFFFFF', '#FFFFFF', '#A89C8D', '#7A6F62'],
  onFinish,
  showCard = true,
  className = ""
}) {
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const createParticles = useCallback((width, height) => {
    const particles = [];
    const count = 100;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const size = Math.floor(Math.random() * 5) + 3;

      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: Math.random() * 40 + 40,
        maxLife: 80,
        gravity: 0.15,
        drag: 0.96
      });
    }
    return particles;
  }, [colors]);

  const startBurst = useCallback(() => {
    setActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 400;

    particlesRef.current = createParticles(canvas.width, canvas.height);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;
      particlesRef.current.forEach((p) => {
        if (p.life > 0 && p.alpha > 0) {
          aliveCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.life--;
          p.alpha = Math.max(0, p.life / p.maxLife);

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setActive(false);
        if (onFinish) onFinish();
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [createParticles, onFinish]);

  useEffect(() => {
    if (trigger) {
      startBurst();
    }
  }, [trigger, startBurst]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center overflow-visible ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        style={{ imageRendering: 'pixelated' }}
      />

      {!trigger && (
        <button
          onClick={startBurst}
          className="mb-4 px-4 py-2 bg-[#1C1917] border border-[#3A332C] hover:bg-[#2B2723] text-white text-xs font-medium rounded-lg transition-all"
        >
          Trigger Drill Burst
        </button>
      )}

      <AnimatePresence>
        {active && showCard && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-20 p-6 bg-[#1C1917] border border-[#3A332C] rounded-2xl shadow-2xl max-w-sm text-center flex flex-col items-center space-y-3"
          >
            <div className="p-3 bg-[#14120F] border border-[#2B2723] rounded-xl">
              <PixelTrophy size={48} animated={true} />
            </div>

            <div>
              <div className="text-[10px] text-white uppercase font-bold tracking-widest">
                ★ DRILL COMPLETED ★
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide mt-0.5">
                {title}
              </h3>
              <p className="text-xs text-[#A89C8D] mt-1">
                {subtitle}
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#2B2723] border border-[#4A4139] text-white text-xs font-medium rounded-lg">
              <PixelFlame size={16} animated={true} />
              <span>+{xpEarned} XP GAINED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PixelCompletionBurst;
