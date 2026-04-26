import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { Journal } from '../models/journal.model.js';

const router = Router();

/* =============================
   GET all journal entries
============================= */
router.get('/', verifyToken, async (req, res) => {
  try {
    const entries = await Journal
      .find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(entries);
  } catch (err) {
    console.error('GET journals error:', err);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

/* =============================
   GET single journal entry
============================= */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry)
      return res.status(404).json({ error: 'Entry not found' });

    res.json(entry);
  } catch (err) {
    console.error('GET journal error:', err);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

/* =============================
   CREATE journal entry
============================= */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, feelings, mapId } = req.body;

    const entry = await Journal.create({
      user: req.user._id,
      title,
      content,
      feelings,
      mapId
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('POST journal error:', err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

/* =============================
   UPDATE journal entry
============================= */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, feelings, mapId } = req.body;

    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        content,
        feelings,
        mapId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!entry)
      return res.status(404).json({ error: 'Entry not found' });

    res.json(entry);
  } catch (err) {
    console.error('PUT journal error:', err);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

/* =============================
   DELETE journal entry
============================= */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry)
      return res.status(404).json({ error: 'Entry not found' });

    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('DELETE journal error:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;