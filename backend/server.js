import 'dotenv/config'; // must stay the first import so env vars exist for the modules below
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { seedIfEmpty } from './seedData.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import contactRoutes from './routes/contacts.js';
import { departmentRouter, classRouter } from './routes/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowed = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : true;
app.use(cors({ origin: allowed }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRouter);
app.use('/api/classes', classRouter);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found.' }));

// In production the built React app (frontend/dist) is served by this same server,
// so the whole project lives at ONE url.
const dist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
try {
  await connectDB();
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`Rhythora server running on http://localhost:${PORT}`));
} catch (err) {
  console.error('Failed to start:', err.message);
  process.exit(1);
}
