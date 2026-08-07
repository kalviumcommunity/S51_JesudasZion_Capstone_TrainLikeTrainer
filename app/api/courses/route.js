import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/lib/models/Course';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { courses: [], error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // An empty collection is a successful response, not a 500.
    const courses = await Course.find({}).lean();
    return NextResponse.json({ courses, count: courses.length });
  } catch (err) {
    console.error('MongoDB Courses GET error:', err);
    return NextResponse.json(
      { courses: [], error: 'Could not fetch courses from database' },
      { status: 500 }
    );
  }
}
