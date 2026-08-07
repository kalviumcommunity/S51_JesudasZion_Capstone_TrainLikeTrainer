import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/lib/models/Course';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    const course = await Course.findOne({ slug }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error('MongoDB Single Course GET error:', err);
    // Distinguish a genuine failure from a missing course rather than
    // reporting every error as a 404.
    return NextResponse.json({ error: 'Could not fetch course' }, { status: 500 });
  }
}
