import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { Map } from '../models/map.model.js';

const router = Router();

// GET /api/maps - get all maps for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const maps = await Map.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(maps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch maps' });
  }
});

// GET /api/maps/:id - get a single map
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const map = await Map.findOne({ _id: req.params.id, user: req.user._id });
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch map' });
  }
});

// POST /api/maps - save a new map
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;
    const map = await Map.create({ user: req.user._id, title, nodes, edges });
    res.status(201).json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save map' });
  }
});

// PUT /api/maps/:id - update an existing map
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;
    const map = await Map.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, nodes, edges, updatedAt: new Date() },
      { new: true }
    );
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update map' });
  }
});

// DELETE /api/maps/:id - delete a map
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const map = await Map.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json({ message: 'Map deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete map' });
  }
});

export default router;
