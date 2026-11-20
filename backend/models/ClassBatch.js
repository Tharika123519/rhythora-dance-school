import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Indian Dance', 'Western Dance'], required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], required: true },
    instructor: { type: String, required: true, trim: true },
    schedule: { type: String, required: true },
    duration: { type: String, default: '60 Mins / Session' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('ClassBatch', classSchema);
