import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// GET /api/auth/me - get current user profile
router.get('/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// DELETE /api/auth/me - delete account
router.delete('/me', verifyToken, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
