/**
 * Seeds the content collections from data/sports.js.
 *
 * Run with: npm run seed
 *
 * This script used to carry its own inline copy of the sports data plus a
 * hardcoded Atlas connection string (username and password in a committed
 * file). It now reads the single source of truth and takes MONGO_URI from
 * .env.local like the rest of the app.
 *
 * The `users` collection is deliberately never touched — it holds real
 * Google-authenticated accounts.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mongoose = require('mongoose');

const ROOT = path.join(__dirname, '..');

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

/**
 * data/sports.js is an ES module (Next.js consumes it directly), but this
 * script runs as CommonJS. Rather than keeping a duplicate CJS copy that can
 * drift, evaluate the module's exports in a sandbox.
 */
function loadSportsData() {
  const source = fs.readFileSync(path.join(ROOT, 'data', 'sports.js'), 'utf8');
  const transformed =
    source.replace(/export const /g, 'const ') +
    '\nmodule.exports = { sportsData, coursesData, forumPostsData };';

  const sandbox = { module: { exports: {} }, Date };
  sandbox.exports = sandbox.module.exports;
  vm.createContext(sandbox);
  vm.runInContext(transformed, sandbox, { filename: 'data/sports.js' });

  return sandbox.module.exports;
}

async function seed() {
  loadEnv();

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to .env.local before seeding.');
    process.exit(1);
  }

  const { sportsData, coursesData, forumPostsData } = loadSportsData();

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.\n');

    const db = mongoose.connection.db;

    await db.collection('sports_datas').deleteMany({});
    await db.collection('sports_datas').insertMany(sportsData);
    const positions = sportsData.reduce((n, s) => n + s.positions.length, 0);
    const drills = sportsData.reduce(
      (n, s) => n + s.positions.reduce((m, p) => m + p.drills.length, 0),
      0
    );
    console.log(`sports_datas : ${sportsData.length} sports, ${positions} positions, ${drills} drills`);

    await db.collection('courses').deleteMany({});
    await db.collection('courses').insertMany(coursesData);
    const lessons = coursesData.reduce(
      (n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0),
      0
    );
    console.log(`courses      : ${coursesData.length} courses, ${lessons} lessons`);

    await db.collection('posts').deleteMany({});
    await db.collection('posts').insertMany(forumPostsData);
    console.log(`posts        : ${forumPostsData.length} threads`);

    const userCount = await db.collection('users').countDocuments();
    console.log(`users        : ${userCount} left untouched\n`);

    console.log('Seed complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
