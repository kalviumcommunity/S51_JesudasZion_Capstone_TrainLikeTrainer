import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    // Recorded so a canned fallback is never replayed later as if it were a
    // real model answer.
    isFallback: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  title: { type: String, default: 'New conversation' },
  sport: { type: String, default: 'All' },
  messages: { type: [messageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

conversationSchema.index({ userEmail: 1, updatedAt: -1 });

export default mongoose.models.Conversation ||
  mongoose.model('Conversation', conversationSchema, 'conversations');
