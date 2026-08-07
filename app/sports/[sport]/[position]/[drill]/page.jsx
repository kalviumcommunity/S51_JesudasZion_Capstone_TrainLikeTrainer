'use client';

import React from 'react';
import Link from 'next/link';
import { useTraining } from '@/context/TrainingContext';
import { useSport } from '@/lib/useSport';
import { sportColor } from '@/lib/sportColors';
import { ArrowLeft, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DrillReaderPage({ params }) {
  const { sport: sportId, position: positionId, drill: drillId } = params;
  const { completedDrills, savedDrills, toggleCompleteDrill, toggleSaveDrill } = useTraining();

  const { sport, status } = useSport(sportId);

  if (status === 'loading') {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center text-[#7A6F62] font-mono text-sm">
        Loading drill protocol…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Couldn&apos;t load this drill</h1>
        <p className="text-sm text-[#A89C8D]">
          The training library is temporarily unavailable. Please try again in a moment.
        </p>
        <Link href="/sports" className="text-white underline">Back to Library</Link>
      </div>
    );
  }

  const position = sport?.positions?.find((p) => p.id === positionId);
  const drill = position?.drills?.find((d) => d.id === drillId);

  if (!sport || !position || !drill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Drill Guide Not Found</h1>
        <Link href="/sports" className="text-white underline">Back to Library</Link>
      </div>
    );
  }

  const allDrills = position.drills || [];
  const currentIndex = allDrills.findIndex((d) => d.id === drillId);
  // Previously this wrapped with `% length`, so the last drill's "Next Drill"
  // silently sent you back to the first one.
  const nextDrill = currentIndex >= 0 ? allDrills[currentIndex + 1] : undefined;

  const isCompleted = completedDrills.includes(drill.id);
  const line = sportColor(sport.id);

  const handleToggleComplete = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#7A6F62', '#A89C8D'],
      });
    }
    toggleCompleteDrill(drill.id);
  };

  // No generic stand-in video: showing an unrelated clip under a drill's title
  // is worse than showing nothing.
  const embedUrl = drill.videoUrl || null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Top Bar with Back & Bookmark */}
      <div className="flex items-center justify-between text-xs text-[#7A6F62]">
        <Link href={`/sports/${sport.id}/${position.id}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {position.name} Drills</span>
        </Link>

        <button
          onClick={() => toggleSaveDrill(drill.id)}
          className="hover:text-white transition-colors flex items-center gap-1 text-[#A89C8D]"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{savedDrills.includes(drill.id) ? 'Saved' : 'Save Drill'}</span>
        </button>
      </div>

      {/* Main Single Card Container - Matching Reference UI */}
      <div className="bg-[#1C1917] border border-[#2B2723] rounded-[20px] p-8 space-y-8 shadow-2xl">
        {/* Header Section: Title & Details on Left, Video on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Header Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="label" style={{ color: line }}>{position.name} drill</div>
            <h1 className="font-display text-4xl font-semibold text-white uppercase">{drill.title}</h1>

            <p className="text-sm text-[#A89C8D] leading-relaxed">
              {drill.overview}
            </p>

            <div className="stat text-xs text-[#7A6F62] pt-2 flex items-center gap-2 flex-wrap">
              <span style={{ color: line }}>{drill.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{drill.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{sport.name}</span>
            </div>
          </div>

          {/* Right Embedded Video Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2B2723] shadow-lg">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={drill.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-4">
                  <span className="text-2xl">🎬</span>
                  <p className="text-xs text-[#8B8073]">
                    No demonstration video for this drill yet — follow the written steps below.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#2B2723]" />

        {/* Middle Instructions Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          {/* Left column: how to run the drill.
              The headings used to carry invented video timestamps ("0:14",
              "1:30") and both columns rendered keyTips, so Key Focus appeared
              twice side by side and the numbering repeated 3 and 4. */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-white mb-2">1. The Set Up</h3>
              <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                {(drill.steps || []).slice(0, 2).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">2. Execution</h3>
              <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                {(drill.steps || []).slice(2).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {drill.equipment?.length > 0 && (
              <div>
                <h3 className="font-medium text-white mb-2">3. Equipment</h3>
                <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                  {drill.equipment.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column: what to focus on and what to avoid. */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-white mb-2">Key Focus Points</h3>
              <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                {(drill.keyTips || []).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-white mb-2">Common Mistakes</h3>
              <ul className="list-disc list-inside space-y-1 text-[#A89C8D]">
                {(drill.commonMistakes || []).map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>

            {drill.calories && (
              <div>
                <h3 className="font-medium text-white mb-2">Estimated Burn</h3>
                <p className="text-[#A89C8D]">{drill.calories}</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#2B2723]" />

        {/* Bottom Bar inside card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Reps & Duration */}
          <div className="stat text-xs text-[#A89C8D] space-y-1 w-full sm:w-auto text-left">
            <div>
              <span className="font-medium text-white">Reps</span> {drill.reps}
            </div>
            <div>
              <span className="font-medium text-white">Duration</span> {drill.duration}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleToggleComplete}
              className={`px-5 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                isCompleted
                  ? 'bg-[#2B2723] text-white border-[#7A6F62]'
                  : 'bg-transparent hover:bg-[#2B2723] text-[#A89C8D] hover:text-white border-[#2B2723]'
              }`}
            >
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>

            {nextDrill && (
              <Link
                href={`/sports/${sport.id}/${position.id}/${nextDrill.id}`}
                className="px-5 py-2.5 rounded-lg text-xs font-medium bg-white text-[#14120F] hover:bg-[#FFFFFF] transition-colors"
              >
                Next Drill →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
