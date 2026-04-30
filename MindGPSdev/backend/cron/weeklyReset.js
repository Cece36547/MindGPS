/*IMPORTANT FOR TEAM MEMBERS PLEASE RUN "npm install node-cron" to download info to run!!!! -AYANNA */
// thank you Ayanna (Andy)
import cron from 'node-cron';
import { Map } from '../models/map.model.js';
import { getWeekKey } from '../utils/getWeekKey.js';

export function startWeeklyReset() {

  // Runs every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
    console.log('⏰ Running weekly mind map reset...');

    try {
      const currentWeek = getWeekKey();
      const maps = await Map.find();

      for (const map of maps) {
        if (map.weekKey !== currentWeek) {

          // Move current data → logs
          map.logs.push({
            weekKey: map.weekKey,
            nodes: map.nodes,
            edges: map.edges,
            archivedAt: new Date()
          });

          // Clear for new week
          map.nodes = [];
          map.edges = [];
          map.weekKey = currentWeek;

          await map.save();
        }
      }

      console.log('✅ Weekly reset complete');
    } catch (err) {
      console.error('❌ Weekly reset failed:', err);
    }
  });

}