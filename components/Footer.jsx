import Link from 'next/link';
import { PixelDivider, PixelStatusBadge } from '@/components/PixelAccents';

export default function Footer() {
  return (
    <footer className="w-full bg-[#14120F] border-t border-[#232019] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <PixelDivider color="#5BA860" secondaryColor="#4FA3A5" variant="pulse" className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm tracking-wider">TLT</span>
              <span className="text-[10px] uppercase tracking-widest text-[#7A6F62]">Sports Platform</span>
              <PixelStatusBadge status="online" text="SYSTEM ONLINE" size="sm" />
            </div>
          <p className="text-[#8B8073] text-sm max-w-sm">
            Professional sports training, tactical drill protocols, and interactive AI coaching at your fingertips.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <h4 className="label">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-[#8B8073] hover:text-white transition-colors">Programs</Link>
              <Link href="/sports" className="text-[#8B8073] hover:text-white transition-colors">Library</Link>
              <Link href="/ai-coach" className="text-[#8B8073] hover:text-white transition-colors">AI Coach</Link>
              <Link href="/forum" className="text-[#8B8073] hover:text-white transition-colors">Community</Link>
              <Link href="/courses" className="text-[#8B8073] hover:text-white transition-colors">Courses</Link>
              <Link href="/about" className="text-[#8B8073] hover:text-white transition-colors">About</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="label">Sports Covered</h4>
            {/* These ids must match the `id` field on the sports documents.
                "soccer" used to be listed here and always rendered Sport Not Found. */}
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/sports/football" className="text-[#8B8073] hover:text-white transition-colors">Football</Link>
              <Link href="/sports/basketball" className="text-[#8B8073] hover:text-white transition-colors">Basketball</Link>
              <Link href="/sports/tennis" className="text-[#8B8073] hover:text-white transition-colors">Tennis</Link>
              <Link href="/sports/cricket" className="text-[#8B8073] hover:text-white transition-colors">Cricket</Link>
              <Link href="/sports/badminton" className="text-[#8B8073] hover:text-white transition-colors">Badminton</Link>
              <Link href="/sports/volleyball" className="text-[#8B8073] hover:text-white transition-colors">Volleyball</Link>
              <Link href="/sports/fitness" className="text-[#8B8073] hover:text-white transition-colors">Fitness &amp; Conditioning</Link>
            </div>
          </div>
        </div>

      </div>
      
        <div className="mt-12 pt-8 border-t border-[#232019] flex justify-between items-center text-xs text-[#7A6F62]">
          <div>
            <span>© {new Date().getFullYear()} Train Like A Trainer. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kalviumcommunity/S51_JesudasZion_Capstone_TrainLikeTrainer"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
