// Manual re-seed:  npm run seed   (inside /backend)
// Wipes departments + classes and reloads them. Users, appointments and enquiries are kept.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Department from './models/Department.js';
import ClassBatch from './models/ClassBatch.js';
import { seedIfEmpty } from './seedData.js';

try {
  await connectDB();
  await Department.deleteMany({});
  await ClassBatch.deleteMany({});
  await seedIfEmpty();
  console.log('Seeding complete.');
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
