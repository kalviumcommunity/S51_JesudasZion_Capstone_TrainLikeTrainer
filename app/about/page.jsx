import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Why this exists — Train Like A Trainer',
  description:
    'A drill library organised by sport and position, written the way a coach would explain it.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-14">
      <header className="space-y-5">
        <p className="label">Why this exists</p>
        <h1 className="touchline font-display text-5xl font-semibold uppercase text-[#5BA860]">
          <span className="text-white">Coaching, not a content feed.</span>
        </h1>
      </header>

      <div className="space-y-6 text-base text-[#A89C8D] leading-relaxed">
        <p>
          If you want to get better at a sport and you don&apos;t have a coach, the internet gives
          you an endless scroll of clips. Some are good. Most are filmed by people selling
          something. Almost none tell you what you&apos;re supposed to feel, what to fix first, or
          whether a drill is even meant for the position you play.
        </p>
        <p>
          So this is built the other way round. Pick your sport, pick your position, and you get the
          drills that actually apply to your role — a striker&apos;s finishing work is not a
          centre-back&apos;s, and a libero&apos;s platform is not a setter&apos;s hands.
        </p>
        <p>
          Every drill is written to the same four-part structure: how to set it up, what your body
          does, the two or three cues a coach would be shouting, and the mistakes that show up most
          often. Each one is paired with a real demonstration video, and you can mark drills complete
          so you know what you&apos;ve actually put reps into.
        </p>
      </div>

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-semibold text-white uppercase">
          What it is not
        </h2>
        <ul className="space-y-3 text-base text-[#A89C8D] leading-relaxed">
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-[#7A6F62]">—</span>
            <span>
              A replacement for a coach who can watch you move. Nothing online can see your knee
              collapsing on a landing.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-[#7A6F62]">—</span>
            <span>
              Medical or rehab advice. If something hurts in a way that isn&apos;t effort, stop and
              see a physio.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-[#7A6F62]">—</span>
            <span>
              A shortcut. The drills are the easy part. Doing them on the days you don&apos;t feel
              like it is the whole thing.
            </span>
          </li>
        </ul>
      </section>

      <section className="border-t border-[#2B2723] pt-8 space-y-2">
        <p className="label">Built by</p>
        <p className="text-base text-white">Jesudas Zion</p>
        <p className="text-sm text-[#A89C8D]">
          <a href="mailto:jesudaszion203@gmail.com" className="hover:text-white transition underline">
            jesudaszion203@gmail.com
          </a>
        </p>
      </section>

      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/sports"
          className="bg-white text-[#14120F] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#FFFFFF] transition"
        >
          Open the library →
        </Link>
        <Link href="/courses" className="text-sm text-[#A89C8D] hover:text-white transition">
          Or start a full course
        </Link>
      </div>
    </div>
  );
}
