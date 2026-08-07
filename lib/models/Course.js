import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true },
  title: { type: String, required: true },
  duration: String,
  calories: String,
  reps: String,
  videoUrl: String,
  overview: String,
  setupSteps: [String],
  executionSteps: [String],
  keyTips: [String],
  commonMistakes: [String],
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  moduleTitle: { type: String, required: true },
  summary: String,
  lessons: [lessonSchema],
});

const trainerSchema = new mongoose.Schema({
  name: String,
  role: String,
  avatar: String,
});

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  sport: { type: String, required: true },
  category: { type: String, required: true },
  thumbnailUrl: String,
  icon: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  durationWeeks: Number,
  totalLessons: Number,
  trainer: trainerSchema,
  modules: [moduleSchema],
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.9 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema, 'courses');
