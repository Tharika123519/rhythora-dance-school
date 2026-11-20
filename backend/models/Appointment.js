import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, default: '' },
    preferredDate: { type: String, required: true },
    timeSlot: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], default: 'Morning' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
