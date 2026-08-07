'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DrillReaderCard from '@/components/DrillReaderCard';
import { useSport } from '@/lib/useSport';
import { sportColor } from '@/lib/sportColors';

export default function PositionDrillsPage({ params }) {
  const { sport: sportId, position: positionId } = params;
  const { sport, status } = useSport(sportId);

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-sm text-[#A89C8D] animate-pulse">Loading drills…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-light text-white">Couldn&apos;t load these drills</h1>
        <p className="text-sm text-[#A89C8D]">
          The training library is temporarily unavailable. Please try again in a moment.
        </p>
        <Link href="/sports" className="inline-block text-sm text-[#A89C8D] hover:text-white transition">
          Back to Sports Directory
        </Link>
      </div>
    );
  }

  const position = sport?.positions?.find((p) => p.id === positionId);

  if (!sport || !position) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-light text-white">Position Not Found</h1>
        <Link href="/sports" className="inline-block text-sm text-[#A89C8D] hover:text-white transition">
          Back to Sports Directory
        </Link>
      </div>
    );
  }

  const drills = position.drills || [];
  const line = sportColor(sport.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-12">
      <Link href={`/sports/${sport.id}`} className="flex items-center gap-1.5 text-sm text-[#7A6F62] hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {sport.name} positions</span>
      </Link>

      <div>
        <div className="label" style={{ color: line }}>{sport.name} / {position.role}</div>
        <h1 className="font-display text-5xl font-semibold text-white mt-3 uppercase">{position.name}</h1>
        <p className="text-base text-[#A89C8D] leading-relaxed mt-3 max-w-2xl">{position.summary}</p>
      </div>

      <div>
        <div className="label">Drills</div>
        <h2 className="touchline font-display text-3xl font-semibold mt-2 mb-8 uppercase" style={{ color: line }}>
          <span className="text-white">
            {drills.length} {drills.length === 1 ? 'drill' : 'drills'} for this role.
          </span>
        </h2>

        {drills.length === 0 ? (
          <p className="text-sm text-[#A89C8D]">No drills have been published for this position yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drills.map((drill) => (
              <DrillReaderCard
                key={drill.id}
                drill={drill}
                sportId={sport.id}
                positionId={position.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
