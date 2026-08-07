import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  googleId: String,
  role: { type: String, enum: ['athlete', 'trainer', 'admin'], default: 'athlete' },

  // These previously defaulted to 'Basketball' / 'Point Guard' / streak 5 /
  // 1450 XP, so every brand-new account was created already looking like it
  // had a training history.
  primarySport: { type: String, default: '' },
  position: { type: String, default: '' },
  level: { type: String, default: 'Beginner' },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  xpPoints: { type: Number, default: 0 },

  completedDrills: [String],
  savedDrills: [String],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

  /**
   * Short facts the AI coach knows about this athlete — injuries, equipment,
   * goals, schedule constraints. Some are added deliberately by the athlete,
   * others are picked up by the coach from what the athlete says in chat.
   *
   * `source` records which, so the UI can show it. Either way the athlete can
   * see and delete every entry: nothing is remembered invisibly.
   */
  coachMemory: {
    type: [
      new mongoose.Schema(
        {
          text: { type: String, required: true },
          source: { type: String, enum: ['you', 'coach'], default: 'you' },
          createdAt: { type: Date, default: Date.now },
        },
        { _id: false }
      ),
    ],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema, 'users');
