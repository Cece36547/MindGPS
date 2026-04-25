import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { Journal } from '../models/journal.model.js';

const router = Router();

// GET /api/journals - get all journal entries for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// GET /api/journals/:id - get a single entry
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// POST /api/journals - create a new entry
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, feelings, mapId } = req.body;
    const entry = await Journal.create({ user: req.user._id, title, content, feelings, mapId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PUT /api/journals/:id - update an entry
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, feelings, mapId } = req.body;
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, feelings, mapId, updatedAt: new Date() },
      { new: true }
    );
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// DELETE /api/journals/:id - delete an entry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;
