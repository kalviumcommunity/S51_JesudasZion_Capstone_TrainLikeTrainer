/**
 * Prints a document count for each content collection.
 *
 * Run with: npm run check-db
 *
 * The connection string used to be hardcoded here, password and all, in a file
 * destined for a public repository. It now comes from .env.local like
 * everything else.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

async function check() {
  loadEnv();

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to .env.local.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const collections = ['courses', 'sports_datas', 'posts', 'users', 'user_progress', 'conversations'];
    console.log('--- DATABASE AUDIT ---');

    for (const coll of collections) {
      const count = await db.collection(coll).countDocuments();
      console.log(`Collection '${coll}': ${count} documents`);

      if (count > 0) {
        const sample = await db.collection(coll).findOne({});
        if (coll === 'sports_datas') {
          console.log(`  - Sample sport:`, sample.name, `(${sample.positions?.length || 0} positions)`);
        } else if (coll === 'courses') {
          console.log(`  - Sample course:`, sample.title, `(${sample.modules?.length || 0} modules)`);
        }
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('DB check error:', err);
    process.exit(1);
  }
}

check();
