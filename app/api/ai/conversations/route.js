import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import Conversation from '@/lib/models/Conversation';

export const dynamic = 'force-dynamic';

/** Lists the athlete's past coach conversations, newest first. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ conversations: [], guest: true });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ conversations: [], error: 'Database unavailable' }, { status: 503 });
    }

    const conversations = await Conversation.find({ userEmail: session.user.email })
      .sort({ updatedAt: -1 })
      .limit(50)
      .select('title sport updatedAt messages')
      .lean();

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        _id: c._id,
        title: c.title,
        sport: c.sport,
        updatedAt: c.updatedAt,
        messageCount: c.messages?.length || 0,
      })),
    });
  } catch (err) {
    console.error('Conversation list error:', err);
    return NextResponse.json(
      { conversations: [], error: 'Could not load conversations' },
      { status: 500 }
    );
  }
}

/** Clears the athlete's entire coach history. */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const { deletedCount } = await Conversation.deleteMany({ userEmail: session.user.email });
    return NextResponse.json({ success: true, deletedCount });
  } catch (err) {
    console.error('Conversation clear error:', err);
    return NextResponse.json({ error: 'Could not clear history' }, { status: 500 });
  }
}
