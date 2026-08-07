'use client';

import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

/**
 * ParticleField — sports-themed floating emoji particles.
 * variant: 'hero' | 'subtle' | 'tech'
 */
export default function ParticleField({ variant = 'subtle', className = '' }) {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Sports emojis as floating particles
  const sportEmojis = ['⚽', '🏀', '🎾', '🏆', '🏋️', '🥊', '🏃', '⚡'];
  const subtleEmojis = ['⚽', '🏀', '🎾', '🏋️'];
  const techEmojis = ['⚡', '🏆', '🏃', '🥊'];

  const configs = {
    // Homepage hero — sport emojis drifting slowly, repulse on hover
    hero: {
      particles: {
        number: { value: 18, density: { enable: true, area: 900 } },
        color: { value: '#ffffff' },
        shape: {
          type: 'char',
          character: {
            value: sportEmojis,
            font: '14px serif',
            style: '',
            weight: '400',
          },
        },
        opacity: {
          value: { min: 0.25, max: 0.55 },
          animation: { enable: true, speed: 0.4, minimumValue: 0.1 },
        },
        size: { value: { min: 10, max: 18 } },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 3, sync: false },
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: { enable: false },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: false },
        },
        modes: {
          repulse: { distance: 100, duration: 0.8 },
        },
      },
      detectRetina: true,
      background: { color: 'transparent' },
    },

    // Sports Library — gentle floating, no interaction
    subtle: {
      particles: {
        number: { value: 12, density: { enable: true, area: 1000 } },
        color: { value: '#ffffff' },
        shape: {
          type: 'char',
          character: {
            value: subtleEmojis,
            font: '12px serif',
            style: '',
            weight: '400',
          },
        },
        opacity: {
          value: { min: 0.15, max: 0.35 },
          animation: { enable: true, speed: 0.3, minimumValue: 0.08 },
        },
        size: { value: { min: 8, max: 14 } },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 2, sync: false },
        },
        move: {
          enable: true,
          speed: 0.3,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: { enable: false },
      },
      interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      detectRetina: true,
      background: { color: 'transparent' },
    },

    // AI Coach page — tech feel with lightning + trophy + sprint emojis, grab on hover
    tech: {
      particles: {
        number: { value: 14, density: { enable: true, area: 800 } },
        color: { value: '#ffffff' },
        shape: {
          type: 'char',
          character: {
            value: techEmojis,
            font: '13px serif',
            style: '',
            weight: '400',
          },
        },
        opacity: {
          value: { min: 0.2, max: 0.45 },
          animation: { enable: true, speed: 0.5, minimumValue: 0.1 },
        },
        size: { value: { min: 10, max: 16 } },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 4, sync: false },
        },
        move: {
          enable: true,
          speed: 0.6,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: { enable: false },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          onClick: { enable: false },
        },
        modes: {
          grab: { distance: 140, links: { opacity: 0 } },
        },
      },
      detectRetina: true,
      background: { color: 'transparent' },
    },
  };

  return (
    <Particles
      id={`particles-${variant}-${Math.random().toString(36).slice(2, 7)}`}
      init={particlesInit}
      options={configs[variant] ?? configs.subtle}
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
}
