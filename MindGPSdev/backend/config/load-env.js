import dotenv from 'dotenv';

// Load .env file locally, but don't fail on Render (uses dashboard env vars)
try {
  dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
} catch (e) {
  // Render doesn't have .env files, uses dashboard env vars
}
