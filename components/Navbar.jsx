'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { useTraining } from '@/context/TrainingContext';


export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { userProfile } = useTraining();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const navLinks = [
    { name: 'Programs', path: '/' },
    { name: 'Library', path: '/sports' },
    { name: 'Courses', path: '/courses' },
    { name: 'AI Coach', path: '/ai-coach' },
    { name: 'Community', path: '/forum' },
  ];

  const displayName = session?.user?.name || userProfile?.name || 'Athlete';
  const displayImage = session?.user?.image;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="w-full bg-[#14120F] border-b border-[#2B2723] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Train Like A Trainer — home">
          {/* Served at 2x the rendered size so the monogram stays sharp. */}
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 rounded-md"
          />
          <span className="font-display text-base font-semibold tracking-wide text-white uppercase hidden sm:inline group-hover:text-[#A89C8D] transition-colors">
            Train Like A Trainer
          </span>
        </Link>

        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 h-14">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm h-full flex items-center transition-colors border-b ${
                  isActive
                    ? 'text-white border-[#4A4139]'
                    : 'text-[#A89C8D] hover:text-white border-transparent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Auth / Profile */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden md:flex items-center gap-2 group">
                {displayImage && !avatarFailed ? (
                  // Google's avatar CDN rejects requests that carry a referrer
                  // from an unknown origin, which is why this was rendering
                  // blank. no-referrer makes it load; onError falls back to
                  // initials if it still doesn't.
                  <img
                    src={displayImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="w-7 h-7 rounded-full border border-[#2B2723] object-cover bg-[#1C1917]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1C1917] border border-[#2B2723] flex items-center justify-center text-white text-xs font-medium">
                    {initials}
                  </div>
                )}
                <span className="text-[#A89C8D] text-xs group-hover:text-[#FFFFFF] transition-colors">
                  {displayName}
                </span>
              </Link>

              <button
                onClick={() => signOut()}
                className="hidden md:flex items-center gap-1 text-xs text-[#7A6F62] hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#2B2723] border border-[#2B2723] text-white text-xs px-3.5 py-1.5 rounded-lg transition-colors"
            >
              <LogIn size={13} className="text-[#A89C8D]" />
              <span>Google Login</span>
            </button>
          )}

          <button
            className="md:hidden text-[#A89C8D] hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#14120F] border-t border-[#232019] px-6 py-4 space-y-4">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/' ? pathname === '/' : pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm py-1 transition-colors ${
                  isActive ? 'text-white' : 'text-[#A89C8D] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#232019]">
            {session ? (
              <button
                onClick={() => signOut()}
                className="text-sm text-[#A89C8D] hover:text-white transition-colors"
              >
                Sign Out ({displayName})
              </button>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-sm text-[#A89C8D] hover:text-white transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
