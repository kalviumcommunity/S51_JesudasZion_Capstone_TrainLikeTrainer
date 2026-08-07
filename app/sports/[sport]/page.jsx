'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSport } from '@/lib/useSport';
import { sportColor } from '@/lib/sportColors';

export default function SportPositionsPage({ params }) {
  const { sport: sportId } = params;
  const { sport, status } = useSport(sportId);

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-sm text-[#A89C8D] animate-pulse">Loading positions…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-light text-white">Couldn&apos;t load this sport</h1>
        <p className="text-sm text-[#A89C8D]">
          The training library is temporarily unavailable. Please try again in a moment.
        </p>
        <Link href="/sports" className="inline-block text-sm text-[#A89C8D] hover:text-white transition">
          Back to Sports Directory
        </Link>
      </div>
    );
  }

  if (status === 'notfound' || !sport) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-light text-white">Sport Not Found</h1>
        <Link href="/sports" className="inline-block text-sm text-[#A89C8D] hover:text-white transition">
          Back to Sports Directory
        </Link>
      </div>
    );
  }

  const positions = sport.positions || [];
  const line = sportColor(sport.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      <Link href="/sports" className="flex items-center gap-1.5 text-sm text-[#7A6F62] hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </Link>

      <div className="relative bg-[#1C1917] border border-[#3A332C] rounded-2xl p-8 space-y-4 overflow-hidden">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[3px]"
          style={{ backgroundColor: line }}
        />
        <div className="flex items-center gap-3">
          <span className="text-4xl">{sport.icon}</span>
          <div className="label" style={{ color: line }}>{sport.category}</div>
        </div>
        <h1 className="font-display text-5xl font-semibold text-white uppercase">{sport.name}</h1>
        <p className="text-base text-[#A89C8D] leading-relaxed max-w-2xl">{sport.description}</p>
      </div>

      <div>
        <div className="label mb-2">Positions</div>
        <h2 className="touchline font-display text-3xl font-semibold mb-8 uppercase" style={{ color: line }}>
          <span className="text-white">
            {positions.length} {positions.length === 1 ? 'position' : 'positions'} to train.
          </span>
        </h2>

        {positions.length === 0 ? (
          <p className="text-sm text-[#A89C8D]">No positions have been published for this sport yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {positions.map((pos) => (
              <Link
                href={`/sports/${sport.id}/${pos.id}`}
                key={pos.id}
                className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-6 group hover:border-[#4A4139] hover:bg-[#232019] transition cursor-pointer block"
              >
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#7A6F62]">{pos.role}</div>
                <h3 className="text-xl font-medium text-white mt-2 group-hover:text-[#FFFFFF] transition">{pos.name}</h3>
                <p className="text-sm text-[#A89C8D] leading-relaxed mt-2 line-clamp-3 font-normal">{pos.summary}</p>

                <div className="border-t border-[#2B2723] mt-5 pt-4 flex items-center justify-between text-xs text-[#7A6F62]">
                  <span>{pos.drills?.length || 0} drills</span>
                  <span className="text-sm text-[#A89C8D] group-hover:text-[#FFFFFF] transition">Explore drills &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
