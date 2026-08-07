import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorEmail: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous Athlete' },
  authorEmail: { type: String },
  sport: { type: String, default: 'General' },
  likes: { type: Number, default: 0 },
  // Emails of users who have liked this post, so a like can be toggled and
  // cannot be spammed by repeat clicks.
  likedBy: { type: [String], default: [] },
  commentsCount: { type: Number, default: 0 },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model('Post', postSchema, 'posts');
