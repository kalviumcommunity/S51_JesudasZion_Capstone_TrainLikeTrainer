import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI missing in .env.local');
    return null;
  }

  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
      console.log('Connected to MongoDB ClusterGames successfully!');
      return mongooseInstance;
    });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    console.error('MongoDB Connection Error:', e);
    throw e;
  }

  return global.mongooseCache.conn;
}
