import Link from 'next/link';
import { sportColor } from '@/lib/sportColors';

export default function SportCard({ sport }) {
  if (!sport) return null;
  const { id, name, icon, category, tagline, positions = [], totalDrills = 0 } = sport;

  const line = sportColor(id);

  return (
    <Link href={`/sports/${id}`} className="group block">
      <div
        className="relative bg-[#1C1917] border border-[#3A332C] rounded-[20px] p-8 overflow-hidden transition-all duration-200 group-hover:bg-[#232019] group-hover:border-[#4A4139]"
      >
        {/* The sport's own marking, run down the edge of its card. */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[3px] transition-all duration-200 group-hover:w-[5px]"
          style={{ backgroundColor: line }}
        />

        <div className="text-4xl">{icon}</div>

        <h3 className="font-display text-white text-2xl font-semibold mt-5 uppercase tracking-wide">
          {name}
        </h3>
        <p className="font-mono uppercase tracking-[0.14em] text-[10px] mt-1" style={{ color: line }}>
          {category}
        </p>

        <p className="text-sm text-[#A89C8D] mt-3 leading-relaxed line-clamp-2">{tagline}</p>

        <div className="border-t border-[#3A332C] mt-6 pt-5 flex items-end justify-between">
          <p className="stat text-xs text-[#7A6F62]">
            {positions.length} positions · {totalDrills} drills
          </p>
          <span className="text-sm text-[#A89C8D] group-hover:text-white transition-colors">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
