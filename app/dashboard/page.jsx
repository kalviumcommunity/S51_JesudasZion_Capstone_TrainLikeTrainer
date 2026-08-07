'use client';

import React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTraining } from '@/context/TrainingContext';
import { useDrillIndex } from '@/lib/useSport';
import { sportColor } from '@/lib/sportColors';
import {
  PixelCleat,
  PixelTrophy,
  PixelDumbbell,
  PixelFlame
} from '@/components/PixelSportsAnimations';
import { PixelWorkoutTimer } from '@/components/PixelWorkoutTimer';
import { PixelCornerBrackets, PixelStatusBadge } from '@/components/PixelAccents';

export default function DashboardPage() {
  const { userProfile, completedDrills, savedDrills, isSignedIn, isLoadingProfile } = useTraining();
  const { index: drillIndex } = useDrillIndex();
  const hasDrills = completedDrills && completedDrills.length > 0;

  // What to train next: prefer the positions this athlete has already worked
  // on, then their stated sport, then anything. Bookmarked drills jump the
  // queue — they asked for those.
  const { suggestions, nextUpReason } = React.useMemo(() => {
    const all = Object.values(drillIndex);
    if (all.length === 0) return { suggestions: [], nextUpReason: '' };

    const done = new Set(completedDrills || []);
    const saved = new Set(savedDrills || []);
    const remaining = all.filter((d) => !done.has(d.id));
    if (remaining.length === 0) return { suggestions: [], nextUpReason: '' };

    const workedPositions = new Set(
      all.filter((d) => done.has(d.id)).map((d) => `${d.sportId}/${d.positionId}`)
    );

    const bookmarked = remaining.filter((d) => saved.has(d.id));
    const sameRole = remaining.filter(
      (d) => !saved.has(d.id) && workedPositions.has(`${d.sportId}/${d.positionId}`)
    );
    const sameSport = remaining.filter(
      (d) =>
        !saved.has(d.id) &&
        !workedPositions.has(`${d.sportId}/${d.positionId}`) &&
        userProfile?.primarySport &&
        d.sportName === userProfile.primarySport
    );

    const ordered = [...bookmarked, ...sameRole, ...sameSport, ...remaining];
    const picked = [];
    const seen = new Set();
    for (const drill of ordered) {
      if (seen.has(drill.id)) continue;
      seen.add(drill.id);
      picked.push(drill);
      if (picked.length === 3) break;
    }

    let reason = 'Three drills you have not done yet.';
    if (bookmarked.length > 0) reason = 'Starting with the drills you bookmarked.';
    else if (sameRole.length > 0) reason = 'More work for the positions you have been training.';
    else if (sameSport.length > 0) reason = `Next up in ${userProfile.primarySport}.`;

    return { suggestions: picked, nextUpReason: reason };
  }, [drillIndex, completedDrills, savedDrills, userProfile?.primarySport]);

  if (!isSignedIn && !isLoadingProfile) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">ATHLETE DASHBOARD</div>
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-white">Sign in to see your progress</h1>
        <p className="text-base text-[#A89C8D] max-w-md mx-auto">
          Your completed drills, bookmarks, streak and XP are tied to your account.
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-white text-[#14120F] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#FFFFFF] transition"
        >
          Sign in with Google
        </button>
        <Link href="/sports" className="block text-sm text-[#7A6F62] hover:text-white transition">
          or browse the drill library
        </Link>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-sm text-[#A89C8D] animate-pulse font-mono">Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
      {/* Profile Area */}
      <section className="relative min-h-[120px] flex flex-col justify-center border-b border-[#2B2723] pb-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="label">Athlete</p>
            <h1 className="font-display text-6xl font-semibold text-white mt-2 uppercase">
              {userProfile?.name || 'Athlete'}
            </h1>
            <p className="stat text-sm text-[#A89C8D] mt-2">
              {userProfile?.primarySport || 'No sport set'}
              {userProfile?.position ? ` · ${userProfile.position}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1C1917] border border-[#3A332C] text-white text-sm font-medium flex items-center justify-center">
              {userProfile?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </section>

      {/* Stats row with Corner Brackets */}
      <div className="p-6 bg-[#1C1917] border border-[#3A332C] rounded-2xl flex flex-wrap items-center justify-around gap-6">
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="stat text-4xl font-light text-white">{completedDrills?.length || 0}</span>
            <PixelCleat size={28} />
          </div>
          <span className="label mt-1">COMPLETED DRILLS</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#3A332C] flex-shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="stat text-4xl font-light text-white">{savedDrills?.length || 0}</span>
            <PixelDumbbell size={28} />
          </div>
          <span className="label mt-1">SAVED DRILLS</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#3A332C] flex-shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="stat text-4xl font-light text-white">{userProfile?.streakDays || 0}</span>
            <PixelFlame size={28} />
          </div>
          <span className="label mt-1">STREAK DAYS</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[#3A332C] flex-shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="stat text-4xl font-light text-white">{userProfile?.xpPoints || 0}</span>
            <PixelTrophy size={28} />
          </div>
          <span className="label mt-1">XP POINTS</span>
        </div>
      </div>

      {/* Time a drill, and know what to do next. This panel used to restate
          the totals already shown above it; it now answers the only question
          a dashboard should answer — what do I train today? */}
      <section className="space-y-6">
        <div>
          <p className="label">Today</p>
          <h2 className="touchline font-display text-3xl font-semibold text-white mt-1 uppercase text-[#5BA860]">
            <span className="text-white">Get to work.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center md:items-start">
            <PixelWorkoutTimer title="DRILL STOPWATCH" />
          </div>

          <div className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                {suggestions.length > 0 ? 'Pick up where you left off' : 'Nothing left to do'}
              </h3>
              <p className="text-xs text-[#7A6F62] mt-1 leading-relaxed">
                {suggestions.length > 0
                  ? nextUpReason
                  : 'You have completed every drill in the library. Go again on the ones that felt weakest.'}
              </p>
            </div>

            {suggestions.length > 0 && (
              <ul className="space-y-2">
                {suggestions.map((drill) => (
                  <li key={drill.id}>
                    <Link
                      href={drill.href}
                      className="group flex items-center gap-3 bg-[#14120F] border border-[#2B2723] rounded-xl px-4 py-3 hover:border-[#4A4139] transition"
                    >
                      <span
                        aria-hidden="true"
                        className="w-[3px] self-stretch rounded-full flex-shrink-0"
                        style={{ backgroundColor: sportColor(drill.sportId) }}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-white truncate group-hover:text-white">
                          {drill.title}
                        </span>
                        <span className="stat block text-[11px] text-[#7A6F62] mt-0.5 truncate">
                          {drill.sportName} · {drill.positionName} · {drill.duration}
                        </span>
                      </span>
                      <span className="text-[#7A6F62] group-hover:text-white transition flex-shrink-0">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/sports"
              className="block text-center text-xs text-[#A89C8D] hover:text-white transition pt-1"
            >
              Browse the full library →
            </Link>
          </div>
        </div>
      </section>

      {/* Mastered Drills Section */}
      <section className="relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="label">Progress</p>
              <h2 className="touchline font-display text-4xl font-semibold text-white mt-1 uppercase text-[#C8722F]">
                <span className="text-white">Drills you have banked.</span>
              </h2>
            </div>
          </div>

          {!hasDrills ? (
            <div className="relative bg-[#1C1917] border border-[#3A332C] p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <PixelCornerBrackets color="#444" size={12} animated={false} />
              <span className="text-4xl mb-4">🏆</span>
              <p className="text-[#A89C8D] text-sm">Nothing banked yet. Your first drill is worth 150 XP.</p>
              <Link href="/sports" className="text-white hover:text-[#14120F] hover:bg-white transition mt-4 border border-[#3A332C] px-4 py-2 rounded-lg text-xs font-medium">
                Browse programs →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Each card used to print the literal strings "SPORT · POSITION"
                  and "15 mins". The drill index resolves the stored id into the
                  real drill so these show actual data and link somewhere. */}
              {completedDrills.map((drillId) => {
                const drill = drillIndex[drillId];

                const card = (
                  <>
                    <PixelCornerBrackets color="#5BA860" size={10} animated={false} />
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#7A6F62] font-mono">
                        {drill ? `${drill.sportName} · ${drill.positionName}` : 'Archived drill'}
                      </div>
                      <div className="text-sm font-medium text-white mt-1 font-mono">
                        {drill?.title || drillId}
                      </div>
                      <div className="text-xs text-[#7A6F62] mt-1 font-mono">
                        {drill?.duration || 'Duration unavailable'}
                      </div>
                    </div>
                    <PixelStatusBadge status="online" text="MASTERED" size="sm" />
                  </>
                );

                const className =
                  'relative bg-[#1C1917] border border-[#3A332C] hover:border-[#5BA860] transition p-5 rounded-2xl flex items-center justify-between';

                return drill ? (
                  <Link key={drillId} href={drill.href} className={className}>
                    {card}
                  </Link>
                ) : (
                  <div key={drillId} className={className}>
                    {card}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
