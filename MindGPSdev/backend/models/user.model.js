import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebase_uid: { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },
  displayName:  { type: String, default: null },
  createdAt:    { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);