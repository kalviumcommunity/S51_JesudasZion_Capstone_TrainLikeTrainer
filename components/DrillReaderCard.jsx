'use client';

import Link from 'next/link';
import { Bookmark, Check, ArrowUpRight } from 'lucide-react';
import { useTraining } from '@/context/TrainingContext';

export default function DrillReaderCard({ drill, sportId, positionId }) {
  const { completedDrills, savedDrills, toggleCompleteDrill, toggleSaveDrill } = useTraining();

  const isCompleted = completedDrills.includes(drill.id);
  const isSaved = savedDrills.includes(drill.id);
  const href = `/sports/${sportId}/${positionId}/${drill.id}`;

  return (
    <div className={`bg-[#1C1917] border ${isCompleted ? 'border-[#3A332C]' : 'border-[#2B2723]'} rounded-[20px] p-6 transition-all duration-200 hover:bg-[#232019] group`}>

      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-1 rounded-md border border-[#2B2723] text-[11px] text-[#7A6F62] bg-transparent">
            {drill.difficulty}
          </span>
          <span className="text-xs text-[#7A6F62]">{drill.duration}</span>
          <span className="text-xs text-[#7A6F62]">{drill.calories}</span>
          {isCompleted && (
            <span className="text-[11px] text-[#7A6F62]">✓ Done</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleSaveDrill(drill.id)}
            className="p-1.5 group/btn"
            aria-label={isSaved ? 'Remove from saved' : 'Save drill'}
          >
            <Bookmark
              size={15}
              className={`${isSaved ? 'text-white fill-white' : 'text-[#7A6F62]'} group-hover/btn:text-white transition-colors`}
            />
          </button>
          <button
            onClick={() => toggleCompleteDrill(drill.id)}
            className="p-1.5 group/btn"
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check
              size={15}
              className={`${isCompleted ? 'text-white' : 'text-[#7A6F62]'} group-hover/btn:text-white transition-colors`}
            />
          </button>
        </div>
      </div>

      {/* Title + Overview */}
      <Link href={href} className="block mt-4 group/link">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base font-medium text-white group-hover/link:text-[#FFFFFF] transition-colors leading-snug">
            {drill.title}
          </h3>
          <ArrowUpRight
            size={15}
            className="text-[#7A6F62] group-hover/link:text-[#FFFFFF] mt-0.5 transition-colors flex-shrink-0"
          />
        </div>
        <p className="text-sm text-[#A89C8D] leading-relaxed mt-2 line-clamp-2">
          {drill.overview}
        </p>
      </Link>

      {/* Bottom Row */}
      <div className="border-t border-[#2B2723] pt-4 mt-4 flex justify-between items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {drill.equipment?.map((item, idx) => (
            <span key={idx} className="border border-[#2B2723] px-2 py-0.5 rounded text-[11px] text-[#7A6F62]">
              {item}
            </span>
          ))}
        </div>
        <Link
          href={href}
          className="text-sm text-[#A89C8D] hover:text-[#FFFFFF] transition-colors flex-shrink-0 whitespace-nowrap"
        >
          Read guide →
        </Link>
      </div>

    </div>
  );
}
