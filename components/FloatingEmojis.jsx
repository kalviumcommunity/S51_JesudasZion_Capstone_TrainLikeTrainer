'use client';

import { useEffect, useState } from 'react';

const PRESETS = {
  // Full sports set — homepage hero
  hero: {
    emojis: ['⚽', '🏀', '🎾', '🏆', '🏋️', '🥊', '🏃', '⚡', '🎯', '🏅', '🤸', '🏈'],
    count: 20,
    minSize: 16,
    maxSize: 28,
    minOpacity: 0.18,
    maxOpacity: 0.42,
    minDuration: 7,
    maxDuration: 14,
  },
  // Subtle ambient — sports library, forum, dashboard
  subtle: {
    emojis: ['⚽', '🏀', '🎾', '🏋️', '🏆', '🏅'],
    count: 12,
    minSize: 13,
    maxSize: 20,
    minOpacity: 0.12,
    maxOpacity: 0.28,
    minDuration: 9,
    maxDuration: 16,
  },
  // Tech/AI themed — AI coach page
  tech: {
    emojis: ['⚡', '🏆', '🏃', '🥊', '🎯', '🔥', '💪', '🏅'],
    count: 14,
    minSize: 14,
    maxSize: 22,
    minOpacity: 0.15,
    maxOpacity: 0.35,
    minDuration: 8,
    maxDuration: 13,
  },
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * FloatingEmojis — pure CSS floating sports emoji animation.
 * Renders client-side only to avoid SSR hydration mismatches.
 *
 * Props:
 *   variant: 'hero' | 'subtle' | 'tech'
 *   className: extra classes on the wrapper
 */
export default function FloatingEmojis({ variant = 'subtle', className = '' }) {
  const [items, setItems] = useState([]);
  const cfg = PRESETS[variant] ?? PRESETS.subtle;

  // Generate positions only on the client (avoids SSR mismatch)
  useEffect(() => {
    const generated = Array.from({ length: cfg.count }, (_, i) => ({
      key: i,
      emoji: cfg.emojis[i % cfg.emojis.length],
      left: rand(2, 94),         // % across width
      top: rand(5, 88),          // % down height
      size: rand(cfg.minSize, cfg.maxSize),
      opacityLo: rand(cfg.minOpacity, cfg.minOpacity + 0.06),
      opacityHi: rand(cfg.minOpacity + 0.08, cfg.maxOpacity),
      duration: rand(cfg.minDuration, cfg.maxDuration),
      delay: rand(0, 5),
    }));
    setItems(generated);
  }, [variant]); // eslint-disable-line

  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {items.map((item) => (
        <span
          key={item.key}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            lineHeight: 1,
            '--emoji-opacity-lo': item.opacityLo,
            '--emoji-opacity-hi': item.opacityHi,
            opacity: item.opacityLo,
            animation: `floatUp ${item.duration}s ease-in-out ${item.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
