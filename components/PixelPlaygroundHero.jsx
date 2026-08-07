'use client';

import React from 'react';
import { PixelSoccerBall, PixelBasketball, PixelFlame, PixelTrophy, PixelCleat, PixelDumbbell } from './PixelSportsAnimations';

export default function PixelPlaygroundHero({ onToggleMode }) {
  return (
    <div className="w-[420px] h-[420px] bg-[#1C1917] border border-[#3A332C] rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl select-none">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#2B2723] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs text-white font-medium tracking-widest">TACTICAL ARENA</span>
        </div>
        <span className="text-[10px] text-[#7A6F62]">PRO CANVAS</span>
      </div>

      {/* Interactive Arena */}
      <div className="relative flex-1 flex flex-col items-center justify-center space-y-6 py-6">
        <div className="flex items-center justify-center gap-8">
          <div className="animate-bounce" style={{ animationDuration: '2s' }}>
            <PixelSoccerBall size={56} />
          </div>
          <div className="animate-bounce" style={{ animationDuration: '2.4s' }}>
            <PixelBasketball size={56} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <PixelCleat size={40} />
          <PixelTrophy size={48} />
          <PixelDumbbell size={40} />
        </div>

        <div className="text-center space-y-1 pt-2">
          <p className="text-xs text-white font-medium">TACTICAL SPORTS DRILLS</p>
          <p className="text-[11px] text-[#A89C8D]">Position-specific protocols & athletics</p>
        </div>
      </div>

      {/* Footer controls */}
      <div className="pt-3 border-t border-[#2B2723] flex items-center justify-between">
        <span className="text-[10px] text-[#7A6F62]">ACTIVE CANVAS</span>
        {onToggleMode && (
          <button
            onClick={onToggleMode}
            className="text-[10px] bg-white text-black font-medium px-3 py-1 rounded hover:bg-[#FFFFFF] transition"
          >
            SWITCH TO 3D →
          </button>
        )}
      </div>

    </div>
  );
}
