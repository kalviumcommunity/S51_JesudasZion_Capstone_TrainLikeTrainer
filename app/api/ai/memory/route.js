import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';
import { normalizeMemory, MAX_FACTS, MAX_FACT_LENGTH } from '@/lib/coachMemory';

export const dynamic = 'force-dynamic';

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'You must be signed in.' }, { status: 401 }) };
  }
  const conn = await connectToDatabase();
  if (!conn) {
    return { error: NextResponse.json({ error: 'Database unavailable' }, { status: 503 }) };
  }
  return { email: session.user.email };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ memory: [], guest: true });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ memory: [], error: 'Database unavailable' }, { status: 503 });
    }

    const user = await User.findOne({ email: session.user.email }).select('coachMemory').lean();
    return NextResponse.json({ memory: normalizeMemory(user?.coachMemory) });
  } catch (err) {
    console.error('Memory read error:', err);
    return NextResponse.json({ memory: [], error: 'Could not load memory' }, { status: 500 });
  }
}

/** Adds a fact the athlete has explicitly told the coach to remember. */
export async function POST(request) {
  try {
    const { error, email } = await requireUser();
    if (error) return error;

    const { fact } = await request.json();
    const trimmed = (fact || '').trim();

    if (!trimmed) {
      return NextResponse.json({ error: 'Write something for the coach to remember.' }, { status: 400 });
    }
    if (trimmed.length > MAX_FACT_LENGTH) {
      return NextResponse.json(
        { error: `Keep it under ${MAX_FACT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('coachMemory');
    if (!user) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const existing = normalizeMemory(user.coachMemory);

    if (existing.some((e) => e.text.toLowerCase() === trimmed.toLowerCase())) {
      return NextResponse.json({ memory: existing });
    }
    if (existing.length >= MAX_FACTS) {
      return NextResponse.json(
        { error: `The coach remembers ${MAX_FACTS} things at a time. Remove one first.` },
        { status: 400 }
      );
    }

    const memory = [...existing, { text: trimmed, source: 'you', createdAt: new Date() }];
    await User.updateOne({ email }, { $set: { coachMemory: memory } });

    return NextResponse.json({ success: true, memory });
  } catch (err) {
    console.error('Memory write error:', err);
    return NextResponse.json({ error: 'Could not save that' }, { status: 500 });
  }
}

/** Forgets one fact, whoever added it. */
export async function DELETE(request) {
  try {
    const { error, email } = await requireUser();
    if (error) return error;

    const { fact } = await request.json();
    if (!fact) return NextResponse.json({ error: 'Nothing specified' }, { status: 400 });

    const user = await User.findOne({ email }).select('coachMemory');
    if (!user) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const memory = normalizeMemory(user.coachMemory).filter((e) => e.text !== fact);
    await User.updateOne({ email }, { $set: { coachMemory: memory } });

    return NextResponse.json({ success: true, memory });
  } catch (err) {
    console.error('Memory delete error:', err);
    return NextResponse.json({ error: 'Could not remove that' }, { status: 500 });
  }
}
