import { Router } from 'express';
import Contact from '../models/Contact.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

// POST /api/contacts  (public enquiry form)
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject and message are required.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Thank you! Your message has been sent to our admissions team.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/contacts  (admin)
router.get('/', protect, requireRole('Admin'), async (_req, res, next) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contacts/:id  { status }  (admin)
router.patch('/:id', protect, requireRole('Admin'), async (req, res, next) => {
  try {
    const doc = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

export default router;
