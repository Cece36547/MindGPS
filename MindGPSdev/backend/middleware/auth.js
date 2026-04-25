import admin from '../config/firebase-admin.js';
import { User } from '../models/user.model.js';

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebase_uid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebase_uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name ?? null,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}