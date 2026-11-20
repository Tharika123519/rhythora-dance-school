import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import { optionalAuth, protect, requireRole } from '../middleware/auth.js';

const router = Router();

// POST /api/appointments  (public; links to the account if logged in)
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { name, email, phone, department, preferredDate, timeSlot, notes } = req.body;
    if (!name || !email || !phone || !preferredDate) {
      return res.status(400).json({ message: 'Name, email, phone and preferred date are required.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    const appt = await Appointment.create({
      user: req.user ? req.user._id : null,
      name, email, phone, department, preferredDate, timeSlot, notes,
    });
    res.status(201).json({ message: 'Appointment request received. Our team will contact you soon.', appointment: appt });
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments/mine  (logged-in user's own requests)
router.get('/mine', protect, async (req, res, next) => {
  try {
    res.json(await Appointment.find({ $or: [{ user: req.user._id }, { email: req.user.email }] }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments  (admin)
router.get('/', protect, requireRole('Admin'), async (_req, res, next) => {
  try {
    res.json(await Appointment.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id  { status }  (admin)
router.patch('/:id', protect, requireRole('Admin'), async (req, res, next) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!appt) return res.status(404).json({ message: 'Appointment not found.' });
    res.json(appt);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/appointments/:id  (admin)
router.delete('/:id', protect, requireRole('Admin'), async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
