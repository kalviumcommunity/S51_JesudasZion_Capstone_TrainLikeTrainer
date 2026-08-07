import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Sport from '@/lib/models/Sport';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { sport: sportId } = params;

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const sport = await Sport.findOne({ id: sportId }).lean();
    if (!sport) {
      return NextResponse.json({ error: 'Sport not found' }, { status: 404 });
    }

    return NextResponse.json({ sport });
  } catch (err) {
    console.error('MongoDB Single Sport Fetch Error:', err);
    // Previously a connection failure also returned 404, which hid outages
    // behind a "sport not found" message.
    return NextResponse.json({ error: 'Could not fetch sport' }, { status: 500 });
  }
}
