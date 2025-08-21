const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update a note (upsert by path)
router.post('/', async (req, res) => {
  try {
    const { title, content, path } = req.body;
    // Upsert: update if exists, else create
    const updatedNote = await Note.findOneAndUpdate(
      { path },
      { title, content, path, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.status(201).json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
