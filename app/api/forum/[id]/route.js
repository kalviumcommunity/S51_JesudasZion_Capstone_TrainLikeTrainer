import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import Post from '@/lib/models/Post';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('MongoDB Single Post GET error:', err);
    // This route used to fall back to a fabricated post with invented replies.
    // A failure is now reported as a failure.
    return NextResponse.json({ error: 'Could not fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'You must be signed in to like or reply.' },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  try {
    const { action, replyText } = await request.json();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    if (action === 'like') {
      const post = await Post.findById(id);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      // Toggle, so the same user clicking twice does not inflate the count.
      const email = session.user.email;
      const hasLiked = post.likedBy.includes(email);
      const updated = await Post.findByIdAndUpdate(
        id,
        hasLiked
          ? { $pull: { likedBy: email }, $inc: { likes: -1 } }
          : { $addToSet: { likedBy: email }, $inc: { likes: 1 } },
        { new: true }
      ).lean();

      return NextResponse.json({ success: true, post: updated, liked: !hasLiked });
    }

    if (action === 'reply') {
      if (!replyText || !replyText.trim()) {
        return NextResponse.json({ error: 'Reply text required' }, { status: 400 });
      }

      const updated = await Post.findByIdAndUpdate(
        id,
        {
          $push: {
            replies: {
              author: session.user.name || session.user.email,
              authorEmail: session.user.email,
              text: replyText.trim(),
              createdAt: new Date(),
            },
          },
          $inc: { commentsCount: 1 },
        },
        { new: true }
      ).lean();

      if (!updated) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, post: updated });
    }

    return NextResponse.json(
      { error: `Unknown action "${action}". Expected "like" or "reply".` },
      { status: 400 }
    );
  } catch (err) {
    console.error('MongoDB Post PUT error:', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
