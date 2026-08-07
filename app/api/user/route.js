import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Only these fields may be written through this endpoint. Previously the raw
// request body was spread into $set, which let any client award itself XP or
// set role: 'admin'.
const WRITABLE_FIELDS = ['primarySport', 'position', 'level', 'completedDrills', 'savedDrills', 'xpPoints'];

function pickWritable(body) {
  const update = {};
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) update[field] = body[field];
  }
  return update;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  // Not signed in: report that honestly rather than returning a fake profile
  // with progress the visitor has not earned.
  if (!session?.user?.email) {
    return NextResponse.json({ user: null, guest: true });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: 'Database unavailable', user: null },
        { status: 503 }
      );
    }

    let user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      const created = await User.create({
        name: session.user.name || 'Athlete',
        email: session.user.email,
        image: session.user.image,
        level: 'Beginner',
        streakDays: 1,
        xpPoints: 0,
        completedDrills: [],
        savedDrills: [],
      });
      user = created.toObject();
    }

    return NextResponse.json({ user, guest: false });
  } catch (err) {
    console.error('MongoDB User GET error:', err);
    return NextResponse.json(
      { error: 'Failed to load user profile', user: null },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'You must be signed in to save progress.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const update = pickWritable(body);

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No writable fields provided' }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      // Do not echo the body back as if it saved — the client must know the
      // write did not persist.
      return NextResponse.json(
        { error: 'Database unavailable, progress was not saved.' },
        { status: 503 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('MongoDB User PUT error:', err);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
