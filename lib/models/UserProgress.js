import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lessonId: { type: String, required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'completed' },
  completedAt: { type: Date, default: Date.now },
  notes: String,
});

export default mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema, 'user_progress');
