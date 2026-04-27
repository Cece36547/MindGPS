import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { Map } from "../models/map.model.js";
import { getWeekKey } from "../utils/getWeekKey.js";

const router = Router();

/* =========================================
   GET CURRENT WEEK MAP (AUTO CREATE)
========================================= */
router.get("/current/week", verifyToken, async (req, res) => {
  try {
    const uid = req.user._id;
    const weekKey = getWeekKey();

    let map = await Map.findOne({ user: uid, weekKey });

    // If no map exists for this week → create fresh one
    if (!map) {
      map = await Map.create({
        user: uid,
        weekKey,
        title: "My Weekly Mind Map",
        nodes: [],
        edges: [],
      });

      console.log("✨ Created NEW weekly map:", weekKey);
    } else {
      console.log("📂 Loaded existing weekly map:", weekKey);
    }

    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get weekly map" });
  }
});

/* =========================================
   SAVE / UPDATE CURRENT WEEK MAP
========================================= */
router.put("/current/week", verifyToken, async (req, res) => {
  try {
    const uid = req.user._id;
    const weekKey = getWeekKey();
    const { nodes, edges, title } = req.body;

    const map = await Map.findOneAndUpdate(
      { user: uid, weekKey },
      { nodes, edges, title, updatedAt: new Date() },
      { new: true }
    );

    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save weekly map" });
  }
});

export default router;