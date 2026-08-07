'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PixelCornerBrackets } from './PixelAccents';
import {
  SoccerKickSprite,
  BasketballDunkSprite,
  SprintRunnerSprite,
  DumbbellPressSprite
} from './PixelActionSprites';

/**
 * SVG Retro Pixel Icons with crispEdges rendering
 */
const pixelStyle = { shapeRendering: 'crispEdges', imageRendering: 'pixelated' };

/**
 * Helper to render animated 8-bit action sprite per sport
 */
const renderSportActionSprite = (sportId, size = 80) => {
  switch (sportId) {
    case 'soccer':
      return <SoccerKickSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" />;
    case 'basketball':
      return <BasketballDunkSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" />;
    case 'running':
      return <SprintRunnerSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" />;
    case 'gym':
      return <DumbbellPressSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" />;
    case 'football':
      return <SoccerKickSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" playerColor="#a855f7" trailColor="#a855f7" />;
    default:
      return <SprintRunnerSprite size={size} animated={true} className="border-none bg-transparent p-0 shadow-none" />;
  }
};

export const PixelSoccerCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#0f172a" d="M8 2h8v2h4v4h2v8h-2v4h-4v2H8v-2H4v-4H2V8h2V4h4V2z" />
    <path fill="#10b981" d="M9 3h6v2h4v4h2v6h-2v4h-4v2H9v-2H5v-4H3V9h2V5h4V3z" />
    <path fill="#ffffff" d="M9 6h6v12H9zM6 9h12v6H6z" />
    <path fill="#0f172a" d="M10 8h4v3h-4zm-3 4h3v3H7zm7 0h3v3h-3zm-3 4h4v2h-4z" />
  </svg>
);

export const PixelBasketballCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#0f172a" d="M8 2h8v2h4v4h2v8h-2v4h-4v2H8v-2H4v-4H2V8h2V4h4V2z" />
    <path fill="#f97316" d="M9 3h6v2h4v4h2v6h-2v4h-4v2H9v-2H5v-4H3V9h2V5h4V3z" />
    <path fill="#0f172a" d="M11 4h2v16h-2zM4 11h16v2H4z" />
    <path fill="#0f172a" d="M6 6h2v3H6zm10 0h2v3h-2zm-10 9h2v3H6zm10 0h2v3h-2z" />
  </svg>
);

export const PixelTennisCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#0f172a" d="M10 2h6v2h4v4h-2v4h-4V8h-2V6h-2V2z" />
    <path fill="#eab308" d="M11 3h4v2h3v3h-2v3h-3V9h-2V7h-1V3z" />
    <path fill="#ffffff" d="M12 4h1v6h-1zm2 1h1v5h-1z" />
    <path fill="#475569" d="M5 15h4v4H5zM2 18h4v4H2z" />
    <path fill="#a3e635" d="M16 14h5v5h-5z" />
    <path fill="#ffffff" d="M17 15h3v1h-3z" />
  </svg>
);

export const PixelGymCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#0f172a" d="M2 6h5v12H2zm15 0h5v12h-5z" />
    <path fill="#ef4444" d="M3 7h3v10H3zm15 0h3v10h-3z" />
    <path fill="#94a3b8" d="M7 11h10v2H7z" />
    <path fill="#ffffff" d="M8 11h2v2H8zm6 0h2v2h-2z" />
  </svg>
);

export const PixelRunningCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#4FA3A5" d="M2 14h4v2H2zm-1-4h6v2H1z" />
    <path fill="#a855f7" d="M8 6h6v4h4v4h4v6H6v-4h2V6z" />
    <path fill="#ffffff" d="M10 8h4v2h-4zm-2 6h12v2H8z" />
    <path fill="#0f172a" d="M6 18h16v3H6z" />
    <path fill="#facc15" d="M8 19h3v1H8zm5 0h3v1h-3zm5 0h3v1h-3z" />
  </svg>
);

export const PixelFootballCardIcon = ({ className = "" }) => (
  <svg width="48" height="48" viewBox="0 0 24 24" style={pixelStyle} className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#0f172a" d="M8 3h8v2h4v4h2v6h-2v4h-4v2H8v-2H4v-4H2V9h2V5h4V3z" />
    <path fill="#78350f" d="M9 4h6v2h3v3h2v4h-2v3h-3v2H9v-2H6v-3H4V9h2V6h3V4z" />
    <path fill="#ffffff" d="M6 8h2v8H6zm10 0h2v8h-2zM10 11h4v2h-4zm2-3h1v8h-1z" />
  </svg>
);

/**
 * Sample Sports Cards Data
 */
const SPORTS_DATA = [
  {
    id: 'soccer',
    name: 'SOCCER PRO',
    category: 'BALL SPORTS',
    tag: 'DYNAMIC DRILLS',
    icon: PixelSoccerCardIcon,
    accentColor: '#10b981',
    glowClass: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:border-emerald-500',
    badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
    stats: [
      { label: 'Ball Control', value: 96 },
      { label: 'Stamina', value: 92 },
      { label: 'Tactical Agility', value: 89 },
    ],
    drillsCount: 28,
    intensity: 'HIGH',
    description: 'Master 8-bit precision dribbling, cone slaloms, fast passing arcs, and wall-rebound striking techniques.',
  },
  {
    id: 'basketball',
    name: 'HOOP LEGEND',
    category: 'BALL SPORTS',
    tag: 'AIR VERTICAL',
    icon: PixelBasketballCardIcon,
    accentColor: '#f97316',
    glowClass: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] hover:border-orange-500',
    badgeBg: 'bg-orange-950/80 text-orange-400 border-orange-800',
    stats: [
      { label: 'Jump Vertical', value: 94 },
      { label: '3-Pt Accuracy', value: 95 },
      { label: 'Court Speed', value: 88 },
    ],
    drillsCount: 32,
    intensity: 'EXTREME',
    description: 'Elevate vertical bounce, crossover footwork, perimeter jumper mechanics, and high-tempo defensive slides.',
  },
  {
    id: 'tennis',
    name: 'COURT ACE',
    category: 'BALL SPORTS',
    tag: 'REACTION SPEED',
    icon: PixelTennisCardIcon,
    accentColor: '#eab308',
    glowClass: 'hover:shadow-[0_0_25px_rgba(234,179,8,0.35)] hover:border-yellow-500',
    badgeBg: 'bg-yellow-950/80 text-yellow-400 border-yellow-800',
    stats: [
      { label: 'Serve Velocity', value: 98 },
      { label: 'Reflex Speed', value: 93 },
      { label: 'Endurance', value: 87 },
    ],
    drillsCount: 24,
    intensity: 'HIGH',
    description: 'Sharpen top-spin forehands, split-step footwork, baseline stamina routines, and high-velocity serve power.',
  },
  {
    id: 'gym',
    name: 'IRON PUMP',
    category: 'STRENGTH & ENDURANCE',
    tag: 'HYPERTROPHY',
    icon: PixelGymCardIcon,
    accentColor: '#ef4444',
    glowClass: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:border-red-500',
    badgeBg: 'bg-red-950/80 text-red-400 border-red-800',
    stats: [
      { label: 'Max Power', value: 99 },
      { label: 'Core Stability', value: 91 },
      { label: 'Muscle Volume', value: 94 },
    ],
    drillsCount: 40,
    intensity: 'EXTREME',
    description: 'Build raw explosive power with progressive compound barbell lifts, kettlebell complexes, and core stability drills.',
  },
  {
    id: 'running',
    name: 'SPEED SPRINT',
    category: 'STRENGTH & ENDURANCE',
    tag: 'CARDIO BLAST',
    icon: PixelRunningCardIcon,
    accentColor: '#4FA3A5',
    glowClass: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:border-sky-500',
    badgeBg: 'bg-sky-950/80 text-sky-400 border-sky-800',
    stats: [
      { label: 'Sprint Speed', value: 97 },
      { label: 'VO2 Max Pace', value: 94 },
      { label: 'Recovery Rate', value: 90 },
    ],
    drillsCount: 22,
    intensity: 'MEDIUM',
    description: 'Optimize stride turnover rate, anaerobic threshold intervals, track sprints, and long-distance pacing strategies.',
  },
  {
    id: 'football',
    name: 'GRIDIRON MVPS',
    category: 'BALL SPORTS',
    tag: 'IMPACT DRILLS',
    icon: PixelFootballCardIcon,
    accentColor: '#a855f7',
    glowClass: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:border-purple-500',
    badgeBg: 'bg-purple-950/80 text-purple-400 border-purple-800',
    stats: [
      { label: '40-Yd Sprint', value: 96 },
      { label: 'Tackle Force', value: 95 },
      { label: 'Route Precision', value: 89 },
    ],
    drillsCount: 30,
    intensity: 'EXTREME',
    description: 'Execute explosive 40-yard dash starts, lateral agility ladder patterns, and quarterback spiral pass precision.',
  },
];

/**
 * PixelSportsCard - Single Sport Card Component
 */
export function PixelSportsCard({ sport, isRetroMode = true, onClick, className = "" }) {
  if (!sport) return null;

  const sportId = sport.id || sport.slug || 'soccer';
  const matchingPreset = SPORTS_DATA.find(d => d.id === sportId) || SPORTS_DATA[0];

  const name = (sport.name || matchingPreset.name).toUpperCase();
  const category = sport.category || matchingPreset.category;
  const tag = sport.tagline || sport.tag || matchingPreset.tag;
  const description = sport.description || matchingPreset.description;
  const drillsCount = sport.positions?.length ? sport.positions.length * 4 : (sport.drills?.length || matchingPreset.drillsCount);
  const IconComp = matchingPreset.icon || PixelSoccerCardIcon;
  const accentColor = matchingPreset.accentColor;
  const glowClass = matchingPreset.glowClass;
  const badgeBg = matchingPreset.badgeBg;
  const stats = matchingPreset.stats;

  const cardContent = (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-900 p-5 border-2 border-slate-800 transition-all duration-200 cursor-pointer transform hover:-translate-y-2.5 ${glowClass} ${className}`}
    >
      <PixelCornerBrackets color={accentColor || '#5BA860'} size={14} glow={true} />

      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.8) 50%)',
          backgroundSize: '100% 4px',
          imageRendering: 'pixelated'
        }}
      />

      <div>
        <div className="flex items-start justify-between mb-4 font-mono">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
              <IconComp />
            </div>
            <div className="hidden sm:block">
              {renderSportActionSprite(sportId, 60)}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded border ${badgeBg}`}>
              ★ {tag}
            </span>
            <span className="mt-1 text-[10px] text-slate-500 font-bold">{category}</span>
          </div>
        </div>

        <h3 className="text-xl font-black tracking-wider text-white group-hover:text-emerald-400 transition-colors font-mono">
          {name}
        </h3>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="my-5 space-y-2.5 border-t border-b border-slate-800/80 py-4 font-mono">
        {stats.map((st, i) => (
          <div key={i} className="text-xs">
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>{st.label}</span>
              <span className="font-bold" style={{ color: accentColor }}>{st.value}%</span>
            </div>
            <div className="h-2 w-full rounded bg-slate-950 p-0.5 border border-slate-800">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${st.value}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 font-mono">
        <span className="text-xs text-slate-400 font-bold">
          {drillsCount} ATHLETE DRILLS
        </span>
        <span className="rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors group-hover:bg-emerald-500 group-hover:text-slate-950 border border-slate-700 group-hover:border-emerald-400 shadow-[2px_2px_0px_#000]">
          EXPLORE →
        </span>
      </div>
    </div>
  );

  return <Link href={`/sports/${sportId}`}>{cardContent}</Link>;
}

export function PixelSportsCardsGrid({ sports, isRetroMode = false, onSelectSport, className = "" }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalCard, setActiveModalCard] = useState(null);

  const cardsToDisplay = (sports && sports.length > 0)
    ? sports.map((s, idx) => {
        const fallback = SPORTS_DATA[idx % SPORTS_DATA.length];
        return {
          id: s.id || s.slug || fallback.id,
          name: (s.name || fallback.name).toUpperCase(),
          category: s.category || fallback.category,
          tag: s.tagline || s.tag || fallback.tag,
          icon: fallback.icon,
          accentColor: fallback.accentColor,
          glowClass: fallback.glowClass,
          badgeBg: fallback.badgeBg,
          stats: fallback.stats,
          drillsCount: s.positions?.length ? s.positions.length * 4 : (s.drills?.length || fallback.drillsCount),
          intensity: s.intensity || fallback.intensity,
          description: s.description || fallback.description,
        };
      })
    : SPORTS_DATA;

  const filteredCards = cardsToDisplay.filter(card => {
    const matchesTab = activeTab === 'ALL' || card.category === activeTab;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className={`w-full font-mono ${className}`}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl bg-slate-900/80 p-4 border-2 border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'BALL SPORTS', 'STRENGTH & ENDURANCE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                activeTab === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-[3px_3px_0px_#064e3b]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              [{cat}]
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search sports or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 border border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
          <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const IconComp = card.icon || PixelSoccerCardIcon;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (onSelectSport) onSelectSport(card);
                setActiveModalCard(card);
              }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-900 p-5 border-2 border-slate-800 transition-all duration-200 cursor-pointer transform hover:-translate-y-2.5 ${card.glowClass}`}
            >
              <PixelCornerBrackets color={card.accentColor || '#5BA860'} size={14} glow={true} />

              <div 
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.8) 50%)',
                  backgroundSize: '100% 4px',
                  imageRendering: 'pixelated'
                }}
              />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                      <IconComp />
                    </div>
                    <div className="hidden sm:block">
                      {renderSportActionSprite(card.id, 56)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded border ${card.badgeBg}`}>
                      ★ {card.tag}
                    </span>
                    <span className="mt-1 text-[10px] text-slate-500">INTENSITY: {card.intensity}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                  {card.name}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="my-5 space-y-2.5 border-t border-b border-slate-800/80 py-4">
                {card.stats.map((st, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>{st.label}</span>
                      <span className="font-bold" style={{ color: card.accentColor }}>{st.value}%</span>
                    </div>
                    <div className="h-2 w-full rounded bg-slate-950 p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${st.value}%`,
                          backgroundColor: card.accentColor,
                          boxShadow: `0 0 8px ${card.accentColor}`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-bold">
                  {card.drillsCount} ATHLETE DRILLS
                </span>
                <button className="rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors group-hover:bg-emerald-500 group-hover:text-slate-950 border border-slate-700 group-hover:border-emerald-400 shadow-[2px_2px_0px_#000]">
                  SELECT →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 p-6 border-4 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-fade-in">
            <PixelCornerBrackets color="#5BA860" size={16} glow={true} />

            <button
              onClick={() => setActiveModalCard(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white font-bold border border-slate-700 transition-colors z-20"
            >
              ✕
            </button>

            <div className="flex items-center justify-between space-x-3 mb-4 pr-8">
              <div className="flex items-center space-x-3">
                {activeModalCard.icon && <activeModalCard.icon />}
                <div>
                  <h2 className="text-2xl font-black text-white">{activeModalCard.name}</h2>
                  <span className="text-xs text-emerald-400 font-bold">{activeModalCard.category} // {activeModalCard.tag}</span>
                </div>
              </div>
              <div>
                {renderSportActionSprite(activeModalCard.id, 80)}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeModalCard.description}
            </p>

            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 mb-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-400">TRAINING METRICS OVERVIEW</h4>
              {activeModalCard.stats.map((st, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-slate-200">
                  <span>{st.label}</span>
                  <span className="font-bold text-emerald-400">{st.value}/100 POINTS</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setActiveModalCard(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 border border-slate-700"
              >
                CLOSE
              </button>

              <Link href={`/sports/${activeModalCard.id}`}>
                <button className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-[3px_3px_0px_#064e3b]">
                  START DRILL WORKOUT 🚀
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PixelSportsCardsGrid;
