import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: String,
  data: String,
});

const characteristicSchema = new mongoose.Schema({
  name: String,
  content: [contentSchema],
});

const positionSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  summary: String,
  drills: Array,
  characteristics: [characteristicSchema],
});

const sportSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  tagline: String,
  icon: String,
  description: String,
  positions: [positionSchema],
});

export default mongoose.models.Sport || mongoose.model('Sport', sportSchema, 'sports_datas');
