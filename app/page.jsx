'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTraining } from '@/context/TrainingContext';
import SportCard from '@/components/SportCard';
import {
  PixelSoccerBall,
  PixelBasketball,
  PixelCleat,
  PixelTrophy,
  PixelDumbbell,
  PixelFlame
} from '@/components/PixelSportsAnimations';

// Three.js must not run on the server
const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-[#3A332C] animate-pulse" />
    </div>
  ),
});

export default function HomePage() {
  const { userProfile, completedDrills } = useTraining();
  const [recentPosts, setRecentPosts] = useState([]);
  const [postsState, setPostsState] = useState('loading');
  const [sports, setSports] = useState([]);

  useEffect(() => {
    async function fetchHomePosts() {
      try {
        const res = await fetch('/api/forum');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        setRecentPosts((data.posts || []).slice(0, 4));
        setPostsState('ready');
      } catch (err) {
        console.error('Error fetching home posts:', err);
        setPostsState('error');
      }
    }
    fetchHomePosts();
  }, []);

  // The programs grid used to render the static data/sports.js file, so it
  // could disagree with the database-backed /sports library.
  useEffect(() => {
    async function fetchSports() {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (res.ok) setSports(data.sports || []);
      } catch (err) {
        console.error('Error fetching sports:', err);
      }
    }
    fetchSports();
  }, []);

  const featuredSports = sports.slice(0, 4).map((sport) => ({
    ...sport,
    totalDrills: (sport.positions || []).reduce(
      (sum, position) => sum + (position.drills?.length || 0),
      0
    ),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-32">

      {/* ── HERO ── */}
      <section className="relative min-h-[540px]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[540px]">

          {/* Left: Text */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <PixelSoccerBall size={28} />
              <p className="label">Coached, not curated</p>
            </div>

            <div>
              <h1 className="font-display text-[76px] font-semibold text-white leading-[0.92] uppercase">
                Train like
                <br />
                <span className="text-[#A89C8D]">a trainer.</span>
              </h1>
            </div>

            {/* The purpose, stated plainly: most training content is a feed of
                clips. This is a library organised the way a coach thinks. */}
            <p className="text-lg text-[#A89C8D] leading-relaxed max-w-md">
              Most training content is a feed of clips you scroll past. This is a
              library organised the way a coach actually works — by your sport,
              your position, and the specific thing you&apos;re trying to fix.
            </p>

            <p className="text-sm text-[#7A6F62] leading-relaxed max-w-md">
              Every drill gives you the setup, the execution, the cues that matter
              and the mistakes to avoid. Then it gets out of your way.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/sports"
                className="bg-white text-[#14120F] px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#FFFFFF] transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wide"
              >
                Open the library →
              </Link>
              <Link
                href="/ai-coach"
                className="border border-[#4A4139] text-[#B5A99A] px-7 py-3.5 rounded-xl text-sm font-medium hover:border-[#8B8073] hover:text-white transition-all"
              >
                AI Coach
              </Link>
            </div>

            {/* Inline stats */}
            <div className="flex items-center gap-8 pt-4 border-t border-[#2B2723]">
              <div>
                <span className="stat block text-3xl font-semibold text-white">{sports.length || '—'}</span>
                <span
                  className="block text-[10px] uppercase tracking-[0.12em] text-[#7A6F62] mt-0.5"
                >Sports</span>
              </div>
              <div className="w-px h-10 bg-[#4A4139] flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="stat block text-3xl font-semibold text-white">{completedDrills.length}</span>
                  <PixelCleat size={32} />
                </div>
                <span
                  className="block text-[10px] uppercase tracking-[0.12em] text-[#7A6F62] mt-0.5"
                >Mastered</span>
              </div>
              <div className="w-px h-10 bg-[#4A4139] flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="stat block text-3xl font-semibold text-white">{userProfile?.streakDays ?? 0}</span>
                  <PixelFlame size={32} />
                </div>
                <span
                  className="block text-[10px] uppercase tracking-[0.12em] text-[#7A6F62] mt-0.5"
                >Day streak</span>
              </div>
              <div className="w-px h-10 bg-[#4A4139] flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="stat block text-3xl font-semibold text-white">{userProfile?.xpPoints ?? 0}</span>
                  <PixelTrophy size={32} />
                </div>
                <span
                  className="block text-[10px] uppercase tracking-[0.12em] text-[#7A6F62] mt-0.5"
                >XP Points</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Wireframe 3D Ball */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-3">
            <div className="w-[420px] h-[420px]">
              <Hero3D />
            </div>
            <p className="text-[10px] text-[#7A6F62] tracking-widest uppercase">
              Drag to spin
            </p>
          </div>

        </div>
      </section>

      {/* ── TRAINING PROGRAMS ── */}
      <section className="relative">
        <div className="relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3">
                <PixelBasketball size={32} />
                <p className="label">Programs</p>
              </div>
              <h2 className="touchline font-display text-5xl font-semibold text-white mt-2 uppercase text-[#5BA860]">
                <span className="text-white">Pick your sport.</span>
              </h2>
            </div>
            <Link href="/sports" className="text-sm text-[#A89C8D] hover:text-[#FFFFFF] transition mb-1">
              View all →
            </Link>
          </div>
          {featuredSports.length === 0 ? (
            <p className="text-sm text-[#A89C8D]">Training programs are loading…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {featuredSports.map((sport) => (
                <SportCard key={sport.id} sport={sport} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section>
        <div className="flex items-center gap-3">
          <PixelDumbbell size={32} />
          <p className="label">How a drill is written</p>
        </div>
        <h2 className="touchline font-display text-5xl font-semibold text-white mt-2 mb-12 uppercase text-[#C8722F]">
          <span className="text-white">Every drill, same four things.</span>
        </h2>
        {/* These are numbered because they genuinely are a sequence — it is the
            order you work through any drill on this site. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              num: '01',
              title: 'The setup',
              desc: 'Where to stand, what you need, how the drill is laid out before you start.',
            },
            {
              num: '02',
              title: 'The execution',
              desc: 'What your body actually does, broken into steps you can hold in your head.',
            },
            {
              num: '03',
              title: 'The cues',
              desc: 'The two or three things a coach would be shouting. Get these and the rest follows.',
            },
            {
              num: '04',
              title: 'The mistakes',
              desc: 'What goes wrong most often, so you can catch it before it becomes a habit.',
            },
          ].map((f) => (
            <div key={f.num} className="border-t-2 border-[#3A332C] pt-7">
              <p className="stat text-[11px] text-[#C8722F] font-medium tracking-[0.1em]">{f.num}</p>
              <h3 className="text-white text-lg font-semibold mt-3">{f.title}</h3>
              <p className="text-[#A89C8D] text-sm mt-3 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <PixelFlame size={32} />
            <p className="label">Community</p>
          </div>
          <h2 className="touchline font-display text-5xl font-semibold mt-2 mb-10 uppercase text-[#4FA3A5]">
            <span className="text-white">From the training ground.</span>
          </h2>
          {postsState === 'loading' && (
            <p className="text-sm text-[#A89C8D] animate-pulse">Loading recent discussions…</p>
          )}
          {postsState === 'error' && (
            <p className="text-sm text-[#A89C8D]">
              Community threads are unavailable right now.{' '}
              <Link href="/forum" className="text-white hover:underline">Open the forum</Link>
            </p>
          )}
          {postsState === 'ready' && recentPosts.length === 0 && (
            <p className="text-sm text-[#A89C8D]">
              No discussions yet.{' '}
              <Link href="/forum" className="text-white hover:underline">Start the first thread →</Link>
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentPosts.map((post) => (
              <Link
                href={`/forum/${post._id || post.id}`}
                key={post._id || post.id}
                className="bg-[#1C1917] border border-[#3A332C] p-7 rounded-2xl block group hover:border-[#4A4139] hover:bg-[#232019] transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <p className="label">{post.sport}</p>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#FFFFFF] transition mt-3 leading-snug tracking-[-0.01em]">
                  {post.title}
                </h3>
                <p className="text-sm text-[#A89C8D] line-clamp-2 mt-2 leading-relaxed font-normal">
                  {post.content}
                </p>
                <p className="text-xs text-[#7A6F62] mt-5 font-normal">
                  by {post.author} · {post.likes || 0} likes
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
