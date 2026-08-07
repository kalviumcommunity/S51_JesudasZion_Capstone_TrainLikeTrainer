import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db';
import Post from '@/lib/models/Post';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ posts: [], error: 'Database unavailable' }, { status: 503 });
    }

    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ posts, count: posts.length });
  } catch (err) {
    console.error('MongoDB Forum GET error:', err);
    return NextResponse.json(
      { posts: [], error: 'Could not fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // The author used to be taken from the request body, so any client could
  // post under someone else's name. It now comes from the session only.
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'You must be signed in to start a thread.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, content, sport } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      sport: sport || 'General',
      author: session.user.name || session.user.email,
      authorEmail: session.user.email,
      likes: 0,
      commentsCount: 0,
      replies: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err) {
    console.error('MongoDB Forum POST error:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
