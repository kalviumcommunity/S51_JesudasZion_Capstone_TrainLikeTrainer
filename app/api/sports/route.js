import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Sport from '@/lib/models/Sport';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { sports: [], error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // An empty collection is a valid, successful result (an unseeded database),
    // not a server error. Returning 500 here made the UI unable to tell
    // "nothing seeded yet" apart from "the query blew up".
    const sports = await Sport.find({}).lean();
    return NextResponse.json({ sports, count: sports.length });
  } catch (err) {
    console.error('MongoDB Sports Fetch Error:', err);
    return NextResponse.json(
      { sports: [], error: 'Could not fetch sports from database' },
      { status: 500 }
    );
  }
}
