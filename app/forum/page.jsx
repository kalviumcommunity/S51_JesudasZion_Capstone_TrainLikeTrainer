'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, MessageCircle, X, Plus, ArrowRight } from 'lucide-react';
import {
  PixelSoccerBall,
  PixelBasketball,
  PixelCleat,
  PixelTrophy,
  PixelDumbbell,
  PixelFlame
} from '@/components/PixelSportsAnimations';
import { useSession } from 'next-auth/react';

export default function ForumPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSport, setNewSport] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [sportNames, setSportNames] = useState([]);

  // The filter list was hardcoded as ['All','Football','Basketball','Tennis',
  // 'Fitness'], so 'Fitness' never matched posts tagged 'Fitness &
  // Conditioning' and new sports never appeared at all.
  const sports = ['All', ...sportNames, 'General'];

  useEffect(() => {
    fetchPosts();

    (async () => {
      try {
        const res = await fetch('/api/sports');
        const data = await res.json();
        if (res.ok) setSportNames((data.sports || []).map((s) => s.name));
      } catch (err) {
        console.error('Could not load sports:', err);
      }
    })();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/forum');
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateThread(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    setFormError(null);
    try {
      // `author` is no longer sent: the server takes it from the session, so a
      // client can't post under someone else's name.
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          sport: newSport,
        }),
      });

      const data = await res.json();
      if (res.ok && data.post) {
        setPosts([data.post, ...posts]);
        setNewTitle('');
        setNewContent('');
        setIsModalOpen(false);
      } else {
        setFormError(data.error || 'Could not publish your thread.');
      }
    } catch (err) {
      setFormError('Network error — your thread was not published.');
      console.error('Error submitting thread:', err);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'All' || post.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-10">
      {/* Page Header */}
      <section className="relative min-h-[140px] flex flex-col justify-end pb-6 border-b border-[#2B2723]">
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2">
              <PixelTrophy size={28} />
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62]">COMMUNITY</div>
            </div>
            <h1 className="touchline font-display text-5xl font-semibold mt-1 uppercase text-[#4FA3A5]">
              <span className="text-white">Ask the training ground.</span>
            </h1>
            <p className="text-base text-[#A89C8D] mt-2">
              Discuss tactics, share routines, and get advice from peers.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border border-[#4A4139] bg-[#1C1917] hover:bg-[#2B2723] text-white px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
          >
            <Plus size={16} />
            <span>New thread</span>
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A6F62] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-[#1C1917] border border-[#3A332C] rounded-lg text-sm text-white placeholder:text-[#7A6F62] focus:outline-none focus:border-[#7A6F62] transition w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`border border-[#3A332C] text-xs rounded-md px-3 py-1.5 cursor-pointer transition ${
                selectedSport === sport
                  ? 'bg-[#232019] border-[#7A6F62] text-white'
                  : 'bg-transparent text-[#A89C8D] hover:border-[#7A6F62] hover:text-white'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      {loading ? (
        <div className="text-center py-12 text-[#7A6F62] text-sm font-mono">Loading discussions…</div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const threadId = post._id || post.id;
            const replyCount = post.replies?.length || post.commentsCount || 0;

            return (
              <Link
                key={threadId}
                href={`/forum/${threadId}`}
                className="bg-[#1C1917] border border-[#3A332C] rounded-xl px-6 py-5 block group hover:border-[#4A4139] hover:bg-[#232019] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.sport === 'Basketball' ? (
                      <PixelBasketball size={20} />
                    ) : post.sport === 'Football' ? (
                      <PixelCleat size={20} />
                    ) : (
                      <PixelSoccerBall size={20} />
                    )}
                    <span className="text-[11px] uppercase text-[#7A6F62] font-semibold">{post.sport || 'General'}</span>
                  </div>
                  <span className="text-[11px] text-[#7A6F62]">
                    by <strong className="text-[#A89C8D]">{post.author || 'Jesudas Zion'}</strong> · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-white group-hover:text-[#FFFFFF] transition mt-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-[#A89C8D] mt-1.5 line-clamp-2 leading-relaxed font-normal">
                  {post.content}
                </p>

                <div className="border-t border-[#2B2723] mt-4 pt-3 flex items-center justify-between text-xs text-[#7A6F62]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                      <Heart className="w-3.5 h-3.5 text-red-500/80" />
                      <span>{post.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{replyCount} replies</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#A89C8D] group-hover:text-[#FFFFFF] transition font-medium">
                    <span>Read Discussion & Replies</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-[#7A6F62] text-sm">
              No threads found. Be the first to start a conversation!
            </div>
          )}
        </div>
      )}

      {/* New Thread Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1C1917] border border-[#2B2723] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#2B2723] pb-4">
              <h3 className="text-lg font-bold text-white">Create New Discussion Thread</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A89C8D] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs text-[#A89C8D] mb-1.5 uppercase tracking-wider font-semibold">Sport Program</label>
                <select
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value)}
                  className="w-full bg-[#14120F] border border-[#2B2723] text-white text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4A4139]"
                >
                  <option value="General">General Discussion</option>
                  {sportNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#A89C8D] mb-1.5 uppercase tracking-wider font-semibold">Thread Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best footwork routine for point guards under pressure..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-[#14120F] border border-[#2B2723] text-white placeholder:text-[#7A6F62] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4A4139]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A89C8D] mb-1.5 uppercase tracking-wider font-semibold">Discussion Details</label>
                <textarea
                  rows={4}
                  placeholder="Share your tactical questions, training advice, or experience..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full bg-[#14120F] border border-[#2B2723] text-white placeholder:text-[#7A6F62] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4A4139] resize-none"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#A89C8D] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-white text-[#14120F] hover:bg-[#FFFFFF] rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Thread'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
