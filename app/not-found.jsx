import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center space-y-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">404</div>
      <h1 className="text-4xl font-bold text-white tracking-[-0.03em]">This page doesn&apos;t exist.</h1>
      <p className="text-base text-[#A89C8D] max-w-md mx-auto">
        The link may be out of date, or the drill you were after has moved.
      </p>
      <div className="flex items-center justify-center gap-4 pt-2">
        <Link
          href="/sports"
          className="bg-white text-[#14120F] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#FFFFFF] transition"
        >
          Browse the library
        </Link>
        <Link href="/" className="text-sm text-[#A89C8D] hover:text-white transition">
          Go home
        </Link>
      </div>
    </div>
  );
}
