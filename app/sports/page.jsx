'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import SportCard from '@/components/SportCard';
import { PixelSoccerBall } from '@/components/PixelSportsAnimations';

export default function SportsPage() {
  const [sportsData, setSportsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSportsFromBackend() {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (data.sports) {
          setSportsData(data.sports);
        }
      } catch (err) {
        console.error('Failed to fetch sports from backend API:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSportsFromBackend();
  }, []);

  const categories = ['All', 'Team Sports', 'Court Sports', 'Racket Sports', 'Conditioning'];

  const filteredSports = sportsData.filter((sport) => {
    const matchesSearch =
      sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sport.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sport.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      {/* Page Header */}
      <section className="relative min-h-[140px] flex flex-col justify-end pb-4 border-b border-[#2B2723]">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <PixelSoccerBall size={24} />
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">LIBRARY</div>
          </div>
          <h1 className="touchline font-display text-5xl font-semibold uppercase text-[#5BA860]"><span className="text-white">The drill library.</span></h1>
          <p className="text-base text-[#A89C8D] max-w-2xl font-normal">
            Browse our curated catalog of sports programs. Select any sport to view position breakdowns and tactical drill protocols.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A6F62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#1C1917] border border-[#3A332C] rounded-lg text-sm text-white placeholder:text-[#7A6F62] focus:outline-none focus:border-[#7A6F62] transition w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`border border-[#3A332C] text-xs rounded-md px-3 py-1.5 cursor-pointer transition ${
                selectedCategory === cat
                  ? 'bg-[#232019] border-[#7A6F62] text-white font-bold'
                  : 'bg-transparent text-[#A89C8D] hover:border-[#7A6F62] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-[#7A6F62] text-sm font-mono">Loading programs catalog...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
          {filteredSports.map((sport) => {
            const totalDrills = (sport.positions || []).reduce(
              (acc, p) => acc + (p.drills ? p.drills.length : 0),
              0
            );

            return (
              <SportCard key={sport.id} sport={{ ...sport, totalDrills }} />
            );
          })}
        </div>
      )}
    </div>
  );
}
