import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Sport from '@/lib/models/Sport';
import Post from '@/lib/models/Post';
import Course from '@/lib/models/Course';
import { sportsData, forumPostsData, coursesData } from '@/data/sports';

export const dynamic = 'force-dynamic';

/**
 * Reseeds the content collections (sports, posts, courses).
 *
 * This is destructive, so it is POST-only and requires the SEED_SECRET.
 * A GET can be triggered by a browser prefetch or a crawler; a POST with a
 * secret cannot. The `users` collection is deliberately never touched here —
 * wiping it would delete real Google-authenticated accounts.
 */
export async function POST(request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'SEED_SECRET is not configured on the server. Seeding is disabled.' },
      { status: 503 }
    );
  }

  const provided =
    request.headers.get('x-seed-secret') ||
    new URL(request.url).searchParams.get('secret');

  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: 'MONGO_URI is missing in .env.local. Add MONGO_URI to connect to MongoDB.' },
        { status: 503 }
      );
    }

    await Sport.deleteMany({});
    await Sport.insertMany(sportsData);

    await Post.deleteMany({});
    await Post.insertMany(forumPostsData);

    await Course.deleteMany({});
    await Course.insertMany(coursesData);

    const drillCount = sportsData.reduce(
      (total, sport) =>
        total + sport.positions.reduce((sum, position) => sum + position.drills.length, 0),
      0
    );

    return NextResponse.json({
      message: 'Successfully reseeded content collections.',
      sportsCount: sportsData.length,
      positionsCount: sportsData.reduce((total, s) => total + s.positions.length, 0),
      drillsCount: drillCount,
      postsCount: forumPostsData.length,
      coursesCount: coursesData.length,
      note: 'The users collection was not modified.',
    });
  } catch (error) {
    console.error('MongoDB Seeding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error:
        'Seeding requires POST with the x-seed-secret header. GET is disabled because this operation is destructive.',
    },
    { status: 405 }
  );
}
