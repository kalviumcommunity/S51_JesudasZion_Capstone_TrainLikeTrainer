'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { ArrowLeft } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const { status } = useSession();

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('General');
  const [content, setContent] = useState('');
  const [sports, setSports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (res.ok) setSports(data.sports || []);
      } catch (err) {
        console.error('Could not load sports:', err);
      }
    })();
  }, []);

  // This form previously called alert('Thread published successfully!') and
  // navigated away without ever sending the thread anywhere.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, sport }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not publish your thread.');
        return;
      }

      router.push(`/forum/${data.post._id}`);
    } catch (err) {
      console.error('Failed to publish thread:', err);
      setError('Network error — your thread was not published.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 space-y-6 text-center">
        <h1 className="text-3xl font-light text-white">Sign in to start a discussion</h1>
        <p className="text-base text-[#A89C8D]">
          Threads are posted under your name, so you&apos;ll need an account first.
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-white text-[#14120F] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#FFFFFF] transition"
        >
          Sign in with Google
        </button>
        <Link href="/forum" className="block text-sm text-[#7A6F62] hover:text-white transition">
          or browse the forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 space-y-8">
      <Link href="/forum" className="flex items-center gap-1.5 text-sm text-[#7A6F62] hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Forum</span>
      </Link>

      <div>
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#7A6F62]">NEW THREAD</div>
        <h1 className="text-4xl font-light text-white mt-2">Start a discussion.</h1>
        <p className="text-base text-[#A89C8D] mt-2">
          Share your thoughts, ask questions, or discuss tactics with the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-[#7A6F62] uppercase tracking-[0.1em] mb-2">Thread Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Tips to improve vertical jump"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#1C1917] border border-[#2B2723] text-white placeholder:text-[#7A6F62] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A4139] transition"
          />
        </div>

        <div>
          <label className="block text-xs text-[#7A6F62] uppercase tracking-[0.1em] mb-2">Sport Category</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full bg-[#1C1917] border border-[#2B2723] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A4139] transition appearance-none"
          >
            <option value="General" className="bg-[#14120F] text-white">General</option>
            {sports.map((s) => (
              <option key={s.id} value={s.name} className="bg-[#14120F] text-white">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#7A6F62] uppercase tracking-[0.1em] mb-2">Discussion Content</label>
          <textarea
            required
            rows={8}
            placeholder="Share your question, drill variation, or tactical analysis..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#1C1917] border border-[#2B2723] text-white placeholder:text-[#7A6F62] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A4139] transition"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-[#14120F] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#FFFFFF] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Publishing…' : 'Publish thread →'}
        </button>

        <Link href="/forum" className="block text-center text-sm text-[#7A6F62] hover:text-white transition mt-3">
          or cancel
        </Link>
      </form>
    </div>
  );
}
