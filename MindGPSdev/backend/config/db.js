import './load-env.js';
import mongoose from 'mongoose';

export async function connectDB() {
  // (Andy) Fail clearly if the backend secret connection string is missing.
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}
