import Department from './models/Department.js';
import ClassBatch from './models/ClassBatch.js';
import User from './models/User.js';

export const departments = [
  ['Bharatanatyam', 'Indian Dance', 'classical.jpg', 'Heritage-rich classical dance with intricate footwork, expressive storytelling and graceful movements.'],
  ['Folk Dance', 'Indian Dance', 'classical.jpg', 'Joyous regional traditions including Garba, Bhangra and energetic community celebrations.'],
  ['Kathak', 'Indian Dance', 'classical.jpg', 'A storytelling dance of rhythmic footwork, spins and expressive gestures.'],
  ['Kuchipudi', 'Indian Dance', 'classical.jpg', 'Dynamic classical dance combining expressive movements and graceful storytelling.'],
  ['Ballet', 'Western Dance', 'ballet.jpg', 'A foundation of precision, poise and elegant technique.'],
  ['Contemporary', 'Western Dance', 'contemporary.jpg', 'Fluid movement and expressive choreography.'],
  ['Freestyle', 'Western Dance', 'hiphop.jpg', 'Personal movement, rhythm and creative performance.'],
  ['Hip-Hop', 'Western Dance', 'hiphop.jpg', 'Urban choreography with energy, musicality and style.'],
  ['Jazz', 'Western Dance', 'salsa.jpg', 'Dynamic choreography with rhythm, precision and flair.'],
  ['Western Dance Fitness', 'Western Dance', 'salsa.jpg', 'A lively way to build confidence, coordination and stamina.'],
];

export const classes = [
  ['Bharatanatyam Margam Series', 'Indian Dance', 'Intermediate', 'Priya Natarajan', 'Mon & Wed · 5:00 PM'],
  ['Bharatanatyam Beginner Batch', 'Indian Dance', 'Beginner', 'Priya Natarajan', 'Tue & Thu · 4:00 PM'],
  ['Kathak Rhythmic Footwork & Chakkars', 'Indian Dance', 'All Levels', 'Rohan Mishra', 'Sat · 10:00 AM'],
  ['Kuchipudi Repertoire & Paatra Dance', 'Indian Dance', 'Intermediate', 'Sunita Rao', 'Wed · 6:00 PM'],
  ['Folk Dance Masterclass: Garba & Bhangra', 'Indian Dance', 'All Levels', 'Sunita Rao', 'Sat · 5:00 PM'],
  ['Urban Hip-Hop & Street Grooves', 'Western Dance', 'Beginner', 'Kahir Sen', 'Mon & Wed · 6:00 PM'],
  ['Advanced Street Choreography', 'Western Dance', 'Advanced', 'Kahir Sen', 'Tue & Fri · 7:00 PM'],
  ['Contemporary Flowwork & Somatic Release', 'Western Dance', 'Intermediate', 'Natasha Daniels', 'Thu · 6:00 PM'],
  ['Classical Ballet Foundations', 'Western Dance', 'Beginner', 'Natasha Daniels', 'Mon & Thu · 5:00 PM'],
  ['Broadway Jazz & Dynamic Turns', 'Western Dance', 'Intermediate', 'Rhea Fernandes', 'Sat · 11:00 AM'],
  ['Western Dance Cardio & Toning', 'Western Dance', 'All Levels', 'Rhea Fernandes', 'Sun · 9:00 AM'],
];

// Fills the database with the academy catalogue + an admin and a demo instructor.
// Safe to call on every start: it only inserts what is missing.
export async function seedIfEmpty() {
  if ((await Department.countDocuments()) === 0) {
    await Department.insertMany(
      departments.map(([name, category, image, description], order) => ({ name, category, image, description, order }))
    );
    console.log('Seeded departments');
  }
  if ((await ClassBatch.countDocuments()) === 0) {
    await ClassBatch.insertMany(
      classes.map(([name, category, level, instructor, schedule], order) => ({ name, category, level, instructor, schedule, order }))
    );
    console.log('Seeded classes');
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rhythora.dance').toLowerCase();
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      firstName: 'Academy', lastName: 'Admin', email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@123', role: 'Admin',
    });
    console.log(`Created admin account: ${adminEmail}`);
  }
  if (!(await User.findOne({ email: 'priya@rhythora.dance' }))) {
    await User.create({
      firstName: 'Priya', lastName: 'Natarajan', email: 'priya@rhythora.dance',
      password: 'Instructor@123', role: 'Instructor',
    });
    console.log('Created demo instructor: priya@rhythora.dance');
  }
}
