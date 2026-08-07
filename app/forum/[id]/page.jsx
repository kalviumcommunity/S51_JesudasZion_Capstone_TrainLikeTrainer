'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  PixelSoccerBall,
  PixelBasketball,
  PixelCleat,
  PixelTrophy
} from '@/components/PixelSportsAnimations';

export default function ForumDetailPage({ params }) {
  const { id } = params;
  const { data: session } = useSession();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReplyText, setNewReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  async function fetchPostDetail() {
    try {
      const res = await fetch(`/api/forum/${id}`);
      const data = await res.json();
      if (data.post) {
        setPost(data.post);
      }
    } catch (err) {
      console.error('Error fetching post detail from MongoDB API:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    if (!post) return;

    const previous = post;
    // Optimistic UI update, rolled back below if the server rejects it.
    setPost((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));

    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPost(previous);
        setActionError(data.error || 'Could not register your like.');
        return;
      }

      if (data.post) setPost(data.post);
      setActionError(null);
    } catch (err) {
      setPost(previous);
      setActionError('Network error — your like was not saved.');
      console.error('Failed to like post:', err);
    }
  }

  async function handleAddReply(e) {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    setSubmittingReply(true);
    setActionError(null);
    try {
      // `author` is no longer sent — the server derives it from the session.
      const res = await fetch(`/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          replyText: newReplyText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || 'Could not post your reply.');
        return;
      }

      if (data.post) {
        setPost(data.post);
        setNewReplyText('');
      }
    } catch (err) {
      setActionError('Network error — your reply was not posted.');
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-[#7A6F62] font-mono text-sm">
        Loading thread…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Thread Not Found</h1>
        <Link href="/forum" className="text-sm text-[#A89C8D] hover:text-white underline">
          Back to Community Forum
        </Link>
      </div>
    );
  }

  const repliesList = post.replies || [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <Link href="/forum" className="inline-flex items-center gap-2 text-xs text-[#A89C8D] hover:text-white transition font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Forum Threads</span>
      </Link>

      {/* Main Post Card */}
      <div className="bg-[#1C1917] border border-[#3A332C] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.sport === 'Basketball' ? (
              <PixelBasketball size={24} />
            ) : post.sport === 'Football' ? (
              <PixelCleat size={24} />
            ) : (
              <PixelSoccerBall size={24} />
            )}
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6F62] font-semibold">{post.sport || 'General'}</div>
          </div>
          <PixelTrophy size={20} />
        </div>

        <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="text-xs text-[#7A6F62]">
          Posted by <span className="text-[#A89C8D] font-semibold">{post.author}</span> · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
        </div>

        <hr className="border-[#2B2723]" />

        <p className="text-sm text-[#A89C8D] leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        <div className="flex items-center gap-6 pt-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-xs text-[#A89C8D] hover:text-white bg-[#14120F] hover:bg-[#2B2723] border border-[#3A332C] px-4 py-2 rounded-xl transition-all font-medium"
          >
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
            <span>{post.likes || 0} Likes</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[#7A6F62] font-medium">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{repliesList.length} Replies</span>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-[#2B2723] pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">Replies ({repliesList.length})</h2>
        </div>

        <div className="space-y-3">
          {repliesList.map((reply, idx) => (
            <div key={reply._id || idx} className="bg-[#1C1917] border border-[#3A332C] rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{reply.author}</span>
                <span className="text-[#7A6F62] font-mono">
                  {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <p className="text-sm text-[#A89C8D] leading-relaxed font-normal">{reply.text}</p>
            </div>
          ))}

          {repliesList.length === 0 && (
            <div className="text-center py-8 text-[#7A6F62] text-xs font-mono">
              No replies yet. Add the first one.
            </div>
          )}
        </div>

        {/* Add Reply Form */}
        <div className="pt-4 space-y-2">
          <label className="block text-xs uppercase tracking-wider text-[#7A6F62] font-semibold">Leave a Reply</label>
          <form onSubmit={handleAddReply} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Write your tactical response..."
              value={newReplyText}
              onChange={(e) => setNewReplyText(e.target.value)}
              required
              className="flex-grow bg-[#1C1917] border border-[#3A332C] text-white placeholder:text-[#7A6F62] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7A6F62] transition"
            />
            <button
              type="submit"
              disabled={submittingReply}
              className="bg-white text-[#14120F] hover:bg-[#FFFFFF] px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Send size={13} />
              <span>{submittingReply ? 'Sending...' : 'Reply'}</span>
            </button>
          </form>

          {actionError && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
              {actionError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
