import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import Conversation from '@/lib/models/Conversation';

export const dynamic = 'force-dynamic';

async function requireOwner(id) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'You must be signed in.' }, { status: 401 }) };
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: NextResponse.json({ error: 'Conversation not found' }, { status: 404 }) };
  }
  const conn = await connectToDatabase();
  if (!conn) {
    return { error: NextResponse.json({ error: 'Database unavailable' }, { status: 503 }) };
  }
  return { email: session.user.email };
}

/** Loads one thread. Scoped by userEmail so nobody can read another athlete's. */
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const { error, email } = await requireOwner(id);
    if (error) return error;

    const conversation = await Conversation.findOne({ _id: id, userEmail: email }).lean();
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ conversation });
  } catch (err) {
    console.error('Conversation fetch error:', err);
    return NextResponse.json({ error: 'Could not load conversation' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const { error, email } = await requireOwner(id);
    if (error) return error;

    const result = await Conversation.deleteOne({ _id: id, userEmail: email });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Conversation delete error:', err);
    return NextResponse.json({ error: 'Could not delete conversation' }, { status: 500 });
  }
}
