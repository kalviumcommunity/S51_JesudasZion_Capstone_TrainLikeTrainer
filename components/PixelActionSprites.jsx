'use client';

import React, { useState, useEffect } from 'react';

const pixelStyle = {
  shapeRendering: 'crispEdges',
  imageRendering: 'pixelated'
};

export function SoccerKickSprite({
  size = 120,
  animated = true,
  className = '',
  speed = 1,
  ballColor = '#FFFFFF',
  trailColor = '#A89C8D',
  playerColor = '#FFFFFF'
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 6);
    }, 250 / speed);
    return () => clearInterval(interval);
  }, [animated, speed]);

  const ballPositions = [
    { x: 10, y: 22, visible: true, arc: false },
    { x: 12, y: 22, visible: true, arc: false },
    { x: 18, y: 14, visible: true, arc: true },
    { x: 26, y: 10, visible: true, arc: true },
    { x: 32, y: 16, visible: true, arc: true },
    { x: 36, y: 22, visible: true, arc: false }
  ];

  const ballPos = ballPositions[frame];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-3 bg-[#14120F] border border-[#2B2723] rounded-lg ${className}`}>
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 40 30"
        style={pixelStyle}
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <path
          d="M 12 22 Q 24 6, 36 22"
          fill="none"
          stroke={`${trailColor}44`}
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        <g opacity="0.8">
          <path fill="none" stroke="#444" strokeWidth="1" d="M34 10 h5 v14 h-5 z" />
          <path fill="none" stroke="#333" strokeWidth="0.5" d="M34 14 h5 M34 18 h5 M36 10 v14 M38 10 v14" />
        </g>

        <g id="player-sprite">
          <rect x={frame === 1 ? "6" : "5"} y="4" width="4" height="4" fill="#FFE0BD" />
          <rect x={frame === 1 ? "6" : "5"} y="4" width="4" height="1.5" fill={playerColor} />
          <rect x={frame === 1 ? "5" : "4"} y="8" width="5" height="7" fill={playerColor} />

          {frame === 0 && (
            <>
              <rect x="2" y="9" width="2" height="4" fill="#FFE0BD" />
              <rect x="10" y="9" width="2" height="4" fill="#FFE0BD" />
            </>
          )}
          {frame === 1 && (
            <>
              <rect x="1" y="8" width="4" height="2" fill="#FFE0BD" />
              <rect x="10" y="8" width="3" height="2" fill="#FFE0BD" />
            </>
          )}
          {frame >= 2 && (
            <>
              <rect x="1" y="9" width="3" height="2" fill="#FFE0BD" />
              <rect x="9" y="10" width="3" height="2" fill="#FFE0BD" />
            </>
          )}

          <rect x="4" y="15" width="2" height="7" fill="#1C1917" />
          <rect x="3" y="22" width="3" height="2" fill="#FFFFFF" />

          {frame === 0 && (
            <>
              <rect x="7" y="15" width="2" height="5" fill="#1C1917" />
              <rect x="8" y="20" width="3" height="2" fill="#FFFFFF" />
            </>
          )}
          {frame === 1 && (
            <>
              <rect x="7" y="16" width="5" height="2" fill="#1C1917" />
              <rect x="11" y="16" width="3" height="2" fill="#FFFFFF" />
            </>
          )}
          {frame >= 2 && (
            <>
              <rect x="7" y="15" width="3" height="5" fill="#1C1917" />
              <rect x="9" y="20" width="3" height="2" fill="#FFFFFF" />
            </>
          )}
        </g>

        {ballPos.arc && (
          <g>
            <rect x={ballPos.x - 4} y={ballPos.y + 2} width="2" height="2" fill={trailColor} opacity="0.4" />
            <rect x={ballPos.x - 7} y={ballPos.y + 4} width="1.5" height="1.5" fill={trailColor} opacity="0.2" />
          </g>
        )}

        <g transform={`translate(${ballPos.x}, ${ballPos.y})`}>
          <rect x="0" y="0" width="4" height="4" fill={ballColor} />
          <rect x="1" y="1" width="2" height="2" fill="#000000" />
        </g>
      </svg>
      <span className="mt-1 text-[10px] text-[#A89C8D] tracking-wider uppercase font-medium">
        KICK & ARC PASS
      </span>
    </div>
  );
}

export function BasketballDunkSprite({
  size = 120,
  animated = true,
  className = '',
  speed = 1,
  ballColor = '#FFFFFF',
  jerseyColor = '#A89C8D'
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 6);
    }, 280 / speed);
    return () => clearInterval(interval);
  }, [animated, speed]);

  const playerStates = [
    { y: 10, armUp: false, dunking: false },
    { y: 6,  armUp: true,  dunking: false },
    { y: 2,  armUp: true,  dunking: true  },
    { y: 3,  armUp: true,  dunking: true  },
    { y: 7,  armUp: false, dunking: false },
    { y: 11, armUp: false, dunking: false }
  ];

  const state = playerStates[frame];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-3 bg-[#14120F] border border-[#2B2723] rounded-lg ${className}`}>
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 40 30"
        style={pixelStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="hoop">
          <rect x="28" y="2" width="2" height="12" fill="#FFFFFF" />
          <rect x="28" y="5" width="2" height="5" fill="#A89C8D" />
          <rect x="23" y="10" width="5" height="1.5" fill="#FFFFFF" />
          <path fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" d="M23 11.5 L24.5 17 L26.5 17 L28 11.5" />
        </g>

        <g transform={`translate(14, ${state.y})`}>
          <rect x="2" y="0" width="4" height="4" fill="#8D5524" />
          <rect x="1" y="4" width="6" height="7" fill={jerseyColor} />
          <rect x="3" y="5" width="2" height="3" fill="#FFFFFF" />

          {state.armUp ? (
            <>
              <rect x="5" y="-3" width="3" height="7" fill="#8D5524" />
              <rect x="7" y="-5" width="4" height="4" fill={state.dunking ? "transparent" : ballColor} />
            </>
          ) : (
            <rect x="-1" y="4" width="2" height="6" fill="#8D5524" />
          )}

          <rect x="1" y="11" width="2" height="6" fill="#1C1917" />
          <rect x="5" y="11" width="2" height="6" fill="#1C1917" />
          <rect x="0" y="17" width="3" height="2" fill="#FFFFFF" />
          <rect x="5" y="17" width="3" height="2" fill="#FFFFFF" />
        </g>

        <line x1="2" y1="28" x2="38" y2="28" stroke="#3A332C" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
      <span className="mt-1 text-[10px] text-[#A89C8D] tracking-wider uppercase font-medium">
        SLAM DUNK & SWISH
      </span>
    </div>
  );
}

export function SprintRunnerSprite({
  size = 120,
  animated = true,
  className = '',
  speed = 1,
  accentColor = '#FFFFFF'
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 120 / speed);
    return () => clearInterval(interval);
  }, [animated, speed]);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-3 bg-[#14120F] border border-[#2B2723] rounded-lg ${className}`}>
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 36 28"
        style={pixelStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.6">
          <line x1="2" y1="8" x2="8" y2="8" stroke={accentColor} strokeWidth="1" strokeDasharray="1 1" />
          <line x1="0" y1="14" x2="10" y2="14" stroke={accentColor} strokeWidth="1" strokeDasharray="2 1" />
          <line x1="4" y1="20" x2="11" y2="20" stroke={accentColor} strokeWidth="1" strokeDasharray="1 1" />
        </g>

        <g transform="translate(12, 2)">
          <rect x="6" y="1" width="5" height="2" fill={accentColor} />
          <rect x="6" y="3" width="4" height="4" fill="#F1C40F" />
          <rect x="5" y="7" width="5" height="7" fill="#1C1917" />
          <rect x="6" y="8" width="3" height="5" fill={accentColor} />

          {frame === 0 && (
            <>
              <rect x="1" y="7" width="4" height="2" fill="#F1C40F" />
              <rect x="10" y="9" width="4" height="2" fill="#F1C40F" />
            </>
          )}
          {frame === 1 && (
            <>
              <rect x="3" y="6" width="3" height="3" fill="#F1C40F" />
              <rect x="9" y="8" width="3" height="3" fill="#F1C40F" />
            </>
          )}
          {frame === 2 && (
            <>
              <rect x="10" y="7" width="4" height="2" fill="#F1C40F" />
              <rect x="1" y="9" width="4" height="2" fill="#F1C40F" />
            </>
          )}
          {frame === 3 && (
            <>
              <rect x="9" y="6" width="3" height="3" fill="#F1C40F" />
              <rect x="3" y="8" width="3" height="3" fill="#F1C40F" />
            </>
          )}

          {frame === 0 && (
            <>
              <rect x="1" y="14" width="4" height="3" fill="#A89C8D" />
              <rect x="-1" y="17" width="3" height="4" fill="#FFFFFF" />
              <rect x="8" y="13" width="4" height="3" fill="#A89C8D" />
              <rect x="11" y="16" width="3" height="5" fill="#FFFFFF" />
            </>
          )}
          {frame === 1 && (
            <>
              <rect x="3" y="14" width="3" height="5" fill="#A89C8D" />
              <rect x="2" y="19" width="3" height="3" fill="#FFFFFF" />
              <rect x="7" y="14" width="3" height="5" fill="#A89C8D" />
              <rect x="9" y="18" width="4" height="3" fill="#FFFFFF" />
            </>
          )}
          {frame === 2 && (
            <>
              <rect x="8" y="14" width="4" height="3" fill="#A89C8D" />
              <rect x="11" y="17" width="3" height="4" fill="#FFFFFF" />
              <rect x="2" y="13" width="4" height="3" fill="#A89C8D" />
              <rect x="-1" y="16" width="3" height="5" fill="#FFFFFF" />
            </>
          )}
          {frame === 3 && (
            <>
              <rect x="6" y="14" width="3" height="5" fill="#A89C8D" />
              <rect x="7" y="19" width="4" height="3" fill="#FFFFFF" />
              <rect x="4" y="14" width="3" height="5" fill="#A89C8D" />
              <rect x="3" y="18" width="3" height="4" fill="#FFFFFF" />
            </>
          )}
        </g>
      </svg>
      <span className="mt-1 text-[10px] text-[#A89C8D] tracking-wider uppercase font-medium">
        SPRINT RUNNER
      </span>
    </div>
  );
}

export function DumbbellPressSprite({
  size = 120,
  animated = true,
  className = '',
  speed = 1,
  glowColor = '#FFFFFF'
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 350 / speed);
    return () => clearInterval(interval);
  }, [animated, speed]);

  const weightY = [12, 7, 2, 7][frame];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center p-3 bg-[#14120F] border border-[#2B2723] rounded-lg ${className}`}>
      <svg
        width={size}
        height={size * 0.75}
        viewBox="0 0 36 28"
        style={pixelStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(10, 6)">
          <rect x="6" y="2" width="4" height="4" fill="#FFE0BD" />
          <rect x="3" y="6" width="10" height="8" fill="#1C1917" />
          <rect x="4" y="7" width="8" height="6" fill="#3A332C" />
          <rect x="3" y="14" width="3" height="7" fill="#1C1917" />
          <rect x="10" y="14" width="3" height="7" fill="#1C1917" />
          <rect x="2" y="20" width="4" height="2" fill={glowColor} />
          <rect x="10" y="20" width="4" height="2" fill={glowColor} />
        </g>

        <g transform={`translate(7, ${weightY})`}>
          <rect x="0" y="0" width="5" height="4" fill="#A89C8D" />
          <rect x="1" y="1" width="3" height="2" fill="#CCCCCC" />
        </g>

        <g transform={`translate(24, ${weightY})`}>
          <rect x="0" y="0" width="5" height="4" fill="#A89C8D" />
          <rect x="1" y="1" width="3" height="2" fill="#CCCCCC" />
        </g>
      </svg>
      <span className="mt-1 text-[10px] text-[#A89C8D] tracking-wider uppercase font-medium">
        DUMBBELL PRESS
      </span>
    </div>
  );
}

export default function PixelActionSprites({ size = 120, className = '' }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#1C1917] border border-[#262626] rounded-xl ${className}`}>
      <SoccerKickSprite size={size} />
      <BasketballDunkSprite size={size} />
      <SprintRunnerSprite size={size} />
      <DumbbellPressSprite size={size} />
    </div>
  );
}

export const SoccerKick = SoccerKickSprite;
export const BasketballDunk = BasketballDunkSprite;
export const SprintRunner = SprintRunnerSprite;
export const DumbbellPress = DumbbellPressSprite;
