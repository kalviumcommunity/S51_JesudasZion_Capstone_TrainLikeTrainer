'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Clock } from 'lucide-react';

const PIXEL_DIGITS = {
  '0': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1]
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0]
  ],
  '2': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  '3': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1]
  ],
  '4': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1]
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1]
  ],
  '6': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1]
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0]
  ],
  '8': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1]
  ],
  '9': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1]
  ],
  ':': [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0]
  ],
  '.': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,1,1,0,0]
  ]
};

function PixelChar({ char, color = '#FFFFFF', size = 4 }) {
  const matrix = PIXEL_DIGITS[char] || PIXEL_DIGITS['0'];
  const width = matrix[0].length * size;
  const height = matrix.length * size;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${matrix[0].length} ${matrix.length}`}
      style={{ shapeRendering: 'crispEdges' }}
      className="inline-block"
    >
      {matrix.map((row, y) =>
        row.map((val, x) => (
          val === 1 ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={color}
            />
          ) : null
        ))
      )}
    </svg>
  );
}

export function PixelWorkoutTimer({
  title = "WORKOUT TIMER",
  initialTime = 0,
  onTimeUpdate,
  className = ""
}) {
  const [timeMs, setTimeMs] = useState(initialTime * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - timeMs;
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setTimeMs(elapsed);
        if (onTimeUpdate) onTimeUpdate(Math.floor(elapsed / 1000));
      }, 30);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (timeMs === 0) return;
    setLaps((prev) => [timeMs, ...prev]);
  };

  const formatTime = (totalMs) => {
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    const pad = (n) => n.toString().padStart(2, '0');
    return {
      minStr: pad(minutes),
      secStr: pad(seconds),
      msStr: pad(ms)
    };
  };

  const currentFormatted = formatTime(timeMs);

  return (
    <div className={`relative p-5 bg-[#1C1917] border border-[#2B2723] rounded-2xl max-w-sm w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2B2723] mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-white" />
          <span className="text-xs font-medium tracking-widest text-white uppercase">
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-white animate-pulse' : 'bg-[#4A4139]'}`} />
          <span className="text-[10px] text-[#A89C8D]">
            {isRunning ? 'RUNNING' : 'PAUSED'}
          </span>
        </div>
      </div>

      {/* Digital Display Screen */}
      <div 
        className={`relative p-4 bg-[#0A0A0A] border ${
          isRunning 
            ? 'border-[#7A6F62]' 
            : 'border-[#2B2723]'
        } rounded-xl flex flex-col items-center justify-center transition-all duration-300`}
      >
        <div className="flex items-center justify-center space-x-1 z-20 my-2">
          <PixelChar char={currentFormatted.minStr[0]} color={isRunning ? "#FFFFFF" : "#A89C8D"} size={5} />
          <PixelChar char={currentFormatted.minStr[1]} color={isRunning ? "#FFFFFF" : "#A89C8D"} size={5} />
          
          <PixelChar char=":" color={isRunning ? "#FFFFFF" : "#A89C8D"} size={5} />
          
          <PixelChar char={currentFormatted.secStr[0]} color={isRunning ? "#FFFFFF" : "#A89C8D"} size={5} />
          <PixelChar char={currentFormatted.secStr[1]} color={isRunning ? "#FFFFFF" : "#A89C8D"} size={5} />
          
          <PixelChar char="." color={isRunning ? "#A89C8D" : "#7A6F62"} size={4} />

          <PixelChar char={currentFormatted.msStr[0]} color={isRunning ? "#A89C8D" : "#7A6F62"} size={4} />
          <PixelChar char={currentFormatted.msStr[1]} color={isRunning ? "#A89C8D" : "#7A6F62"} size={4} />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={handleToggle}
          className="col-span-1 flex items-center justify-center space-x-1 py-2 bg-white text-[#14120F] hover:bg-[#FFFFFF] rounded-lg text-xs font-medium transition-all"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'PAUSE' : 'START'}</span>
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning && timeMs === 0}
          className="col-span-1 flex items-center justify-center space-x-1 py-2 bg-[#1C1917] border border-[#3A332C] hover:border-[#7A6F62] text-[#A89C8D] hover:text-white rounded-lg text-xs font-medium transition-all disabled:opacity-40"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>LAP</span>
        </button>

        <button
          onClick={handleReset}
          className="col-span-1 flex items-center justify-center space-x-1 py-2 bg-[#1C1917] border border-[#3A332C] hover:border-[#7A6F62] text-[#A89C8D] hover:text-white rounded-lg text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* Lap Counter List */}
      {laps.length > 0 && (
        <div className="mt-4 border-t border-[#2B2723] pt-3 max-h-32 overflow-y-auto space-y-1 pr-1 text-xs">
          <div className="text-[10px] text-[#7A6F62] tracking-wider uppercase font-medium mb-1">
            SPLIT LAPS ({laps.length})
          </div>
          {laps.map((lapMs, idx) => {
            const formatted = formatTime(lapMs);
            return (
              <div key={idx} className="flex justify-between items-center bg-[#0D0D0D] px-2.5 py-1.5 rounded border border-[#2B2723]">
                <span className="text-[#A89C8D]">LAP {laps.length - idx}</span>
                <span className="text-white font-mono">
                  {formatted.minStr}:{formatted.secStr}.{formatted.msStr}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PixelWorkoutTimer;
