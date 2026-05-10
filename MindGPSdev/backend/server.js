import './config/load-env.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import mapRoutes from './routes/map.routes.js';
import journalRoutes from './routes/journal.routes.js';
import { startWeeklyReset } from './cron/weeklyReset.js';
import communityRoutes from "./routes/community.routes.js";

const app = express();
// (Andy) Keep CORS explicit so local Vite can call the API with Firebase auth.
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.get("/", (req, res) => {
  res.send("MindGPS API is running 🚀");
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/community', communityRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = Number(process.env.PORT) || 5050;

// (Andy) Start listening before Mongo finishes so port 5050 is never hidden behind a slow DB connection.
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

connectDB()
  .then(() => {
    startWeeklyReset();
  })
  .catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`MongoDB connection failed: ${message}`);
  });
