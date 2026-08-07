'use client';

import React from 'react';
import { PixelSoccerBall, PixelBasketball, PixelFlame } from './PixelSportsAnimations';

export default function PixelLoader({ size = 'md', text = 'LOADING...', variant = 'soccer' }) {
  const iconSizes = { sm: 24, md: 36, lg: 48 };
  const iconSize = iconSizes[size] || 36;

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 select-none">
      <div className="relative flex items-center justify-center">
        {variant === 'basketball' ? (
          <PixelBasketball size={iconSize} animated={true} />
        ) : variant === 'flame' ? (
          <PixelFlame size={iconSize} animated={true} />
        ) : (
          <PixelSoccerBall size={iconSize} animated={true} />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span className="text-xs tracking-widest text-[#A89C8D] uppercase">
          {text}
        </span>
      </div>
    </div>
  );
}
