'use client';

import { useEffect, useRef } from 'react';

/**
 * SportsPixels — Canvas particle system with pixel-art sports shapes.
 * Draws tiny pixel-art icons: circles (balls), arcs (shoe soles),
 * plus (crosshairs), and ring shapes — all in visible grays.
 *
 * variant: 'dense' | 'default' | 'sparse'
 */

const SHAPES = ['ball', 'ball', 'ball', 'ring', 'cross', 'arc'];

const CFG = {
  dense:   { n: 55, minSz: 5,  maxSz: 14, minOp: 0.35, maxOp: 0.72, spd: 0.45, repulse: 120 },
  default: { n: 38, minSz: 4,  maxSz: 11, minOp: 0.28, maxOp: 0.60, spd: 0.35, repulse: 100 },
  sparse:  { n: 22, minSz: 3,  maxSz: 9,  minOp: 0.18, maxOp: 0.45, spd: 0.22, repulse: 0   },
};

// Gray shades clearly visible on #111 — range 80–180
const GRAYS = [80, 100, 120, 140, 160, 180];

function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function drawShape(ctx, p) {
  const { x, y, sz, shape, g, op } = p;
  const color = `rgba(${g},${g},${g},${op.toFixed(3)})`;
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = Math.max(1, sz * 0.18);

  switch (shape) {
    /* ⚽ Ball — circle with two curved seam lines */
    case 'ball': {
      const r = sz / 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      // seam line 1
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y, r * 0.8, -0.7, 0.7);
      ctx.stroke();
      // seam line 2
      ctx.beginPath();
      ctx.arc(x + r * 0.3, y, r * 0.8, Math.PI - 0.7, Math.PI + 0.7);
      ctx.stroke();
      break;
    }

    /* 🔴 Ring — clean hollow circle (basketball / hoop) */
    case 'ring': {
      const r = sz / 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    /* ✚ Cross — pixel crosshair (target / training marker) */
    case 'cross': {
      const h = sz / 2;
      ctx.beginPath();
      ctx.moveTo(x - h, y); ctx.lineTo(x + h, y);
      ctx.moveTo(x, y - h); ctx.lineTo(x, y + h);
      ctx.stroke();
      break;
    }

    /* 👟 Arc — curved arc shape (shoe sole / racket) */
    case 'arc': {
      const r = sz / 2;
      ctx.beginPath();
      ctx.arc(x, y, r, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.55, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      break;
    }

    default:
      break;
  }
}

export default function SportsPixels({ variant = 'default', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cfg = CFG[variant] ?? CFG.default;
    let raf;
    const mouse = { x: null, y: null };

    const resize = () => {
      const p = canvas.parentElement;
      const w = p ? p.offsetWidth  : window.innerWidth;
      const h = p ? p.offsetHeight : window.innerHeight;
      canvas.width  = w || window.innerWidth;
      canvas.height = h || window.innerHeight;
    };
    resize();

    // Generate particles
    const particles = Array.from({ length: cfg.n }, () => ({
      x:     rnd(0, canvas.width),
      y:     rnd(0, canvas.height),
      sz:    rnd(cfg.minSz, cfg.maxSz),
      op:    rnd(cfg.minOp, cfg.maxOp),
      opDir: Math.random() > 0.5 ? 1 : -1,
      vx:    rnd(-cfg.spd, cfg.spd),
      vy:    rnd(-cfg.spd, cfg.spd),
      shape: pick(SHAPES),
      g:     pick(GRAYS),
      rot:   rnd(0, Math.PI * 2),
      rotV:  rnd(-0.008, 0.008),
    }));

    const parent = canvas.parentElement;
    const onMove  = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = null; mouse.y = null; };

    if (parent) {
      parent.addEventListener('mousemove', onMove);
      parent.addEventListener('mouseleave', onLeave);
    }
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // repulse
        if (mouse.x !== null && cfg.repulse > 0) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < cfg.repulse && d > 0) {
            const f = ((cfg.repulse - d) / cfg.repulse) * 0.7;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // friction + speed cap
        p.vx *= 0.985; p.vy *= 0.985;
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd < 0.04) { p.vx = rnd(-cfg.spd, cfg.spd); p.vy = rnd(-cfg.spd, cfg.spd); }
        if (spd > cfg.spd * 4) { p.vx = (p.vx/spd)*cfg.spd*4; p.vy = (p.vy/spd)*cfg.spd*4; }

        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV;

        // opacity pulse
        p.op += p.opDir * 0.003;
        if (p.op >= cfg.maxOp) { p.op = cfg.maxOp; p.opDir = -1; }
        if (p.op <= cfg.minOp) { p.op = cfg.minOp; p.opDir = 1; }

        // wrap
        const pad = cfg.maxSz;
        if (p.x < -pad)              p.x = canvas.width  + pad;
        if (p.x > canvas.width  + pad) p.x = -pad;
        if (p.y < -pad)              p.y = canvas.height + pad;
        if (p.y > canvas.height + pad) p.y = -pad;

        // draw with rotation transform
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.translate(-p.x, -p.y);
        drawShape(ctx, p);
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      if (parent) {
        parent.removeEventListener('mousemove', onMove);
        parent.removeEventListener('mouseleave', onLeave);
      }
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
