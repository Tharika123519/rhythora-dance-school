import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: ['Indian Dance', 'Western Dance'], required: true },
    image: { type: String, default: 'classical.jpg' },
    description: { type: String, default: '' },
    faculty: { type: String, default: 'Master Instructor Team' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Department', departmentSchema);
