'use client';

import React from 'react';
import { PixelTrophy, PixelFlame, PixelCleat, PixelDumbbell } from './PixelSportsAnimations';

export default function PixelAchievementBadge({ title, type = 'trophy', level = 'Gold', unlocked = true }) {
  const isUnlocked = unlocked;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center space-y-3 ${
      isUnlocked
        ? 'bg-[#1C1917] border-[#4A4139]'
        : 'bg-[#1C1917] border-[#2B2723] opacity-50'
    }`}>
      <div className="p-2 rounded-xl bg-[#14120F] border border-[#3A332C]">
        {type === 'flame' ? (
          <PixelFlame size={36} animated={isUnlocked} />
        ) : type === 'cleat' ? (
          <PixelCleat size={36} animated={isUnlocked} />
        ) : type === 'dumbbell' ? (
          <PixelDumbbell size={36} animated={isUnlocked} />
        ) : (
          <PixelTrophy size={36} animated={isUnlocked} />
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-white tracking-wider uppercase">
          {level} BADGE
        </div>
        <h4 className="text-sm font-medium text-[#A89C8D] mt-1">{title}</h4>
      </div>

      <span className={`text-[10px] px-2 py-0.5 rounded border ${
        isUnlocked
          ? 'bg-[#2B2723] border-[#4A4139] text-white'
          : 'bg-[#1C1917] border-[#2B2723] text-[#7A6F62]'
      }`}>
        {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
      </span>
    </div>
  );
}

export function PixelAchievementShowcase({ userProfile = {}, completedDrillsCount = 0 }) {
  const xp = userProfile.xpPoints || 0;
  const streak = userProfile.streakDays || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PixelAchievementBadge
        title="Pro Striker"
        type="cleat"
        level="Gold"
        unlocked={true}
      />
      <PixelAchievementBadge
        title="Streak Master"
        type="flame"
        level="Platinum"
        unlocked={streak >= 1}
      />
      <PixelAchievementBadge
        title="XP Milestone"
        type="trophy"
        level="Diamond"
        unlocked={xp >= 100}
      />
      <PixelAchievementBadge
        title="Protocol Master"
        type="dumbbell"
        level="Master"
        unlocked={completedDrillsCount >= 1}
      />
    </div>
  );
}
