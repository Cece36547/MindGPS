import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { Journal } from '../models/journal.model.js';

const router = Router(); // Initialize the router

/* =============================
   GET all journal entries
============================= */
router.get('/', verifyToken, async (req, res) => { // Get all journal entries
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
router.get('/:id', verifyToken, async (req, res) => { // Get a single journal entry by ID
  try {
    const entry = await Journal.findOne({ // Find a single journal entry by ID
      _id: req.params.id, // The ID of the entry to find
      user: req.user._id 
    });

    if (!entry) // If the entry is not found
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
    const { title, content, feelings, influences, mapId } = req.body; // i had to add influences to the backend (Andy)

    const entry = await Journal.create({
      user: req.user._id,
      title,
      content,
      feelings,
      influences,
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
router.put('/:id', verifyToken, async (req, res) => { // endpoint for updating a journal entry
  try {
    const { title, content, feelings, influences, mapId } = req.body;  // (Andy) i had to add influences to the backend

    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        content,
        feelings,
        influences,
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
    // (Andy) Delete only the signed-in user's matching MongoDB journal entry.
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry)
      return res.status(404).json({ error: 'Entry not found' });

    res.json({ message: 'Entry deleted' }); // i noticed cierra created a delete endpoint
  } catch (err) {
    console.error('DELETE journal error:', err);
    res.status(500).json({ error: 'Failed to delete entry' }); // so i need to reflect these backend changes in the frontend
  }
});

export default router;
