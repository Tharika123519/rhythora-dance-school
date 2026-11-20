import { Router } from 'express';
import Department from '../models/Department.js';
import ClassBatch from '../models/ClassBatch.js';

export const departmentRouter = Router();
export const classRouter = Router();

// GET /api/departments?category=Indian%20Dance
departmentRouter.get('/', async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    res.json(await Department.find(filter).sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
});

// GET /api/classes?category=&level=&instructor=
classRouter.get('/', async (req, res, next) => {
  try {
    const { category, level, instructor } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;
    res.json(await ClassBatch.find(filter).sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
});
