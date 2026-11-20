import { Router } from 'express';
import User from '../models/User.js';
import { protect, signToken } from '../middleware/auth.js';

const router = Router();
const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v || '');

// POST /api/auth/register  -> creates a Student account
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }
    if (!emailOk(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const user = await User.create({ firstName, lastName, email, phone, password, role: 'Student' });
    res.status(201).json({ token: signToken(user), user: user.toSafe() });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login  { email, password, role }
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not registered as ${role}. Choose the correct role.` });
    }
    res.json({ token: signToken(user), user: user.toSafe() });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ user: req.user.toSafe() }));

export default router;
