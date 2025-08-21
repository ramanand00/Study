const express = require('express');
const Structure = require('../models/Structure');

const router = express.Router();

// Get the structure (only one document expected)
router.get('/', async (req, res) => {
  try {
    let structure = await Structure.findOne();
    if (!structure) {
      structure = new Structure({ courses: [] });
      await structure.save();
    }
    res.json(structure);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update the structure (replace the whole structure)
router.put('/', async (req, res) => {
  try {
    const { courses } = req.body;
    let structure = await Structure.findOne();
    if (!structure) {
      structure = new Structure({ courses });
    } else {
      structure.courses = courses;
    }
    await structure.save();
    res.json(structure);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
