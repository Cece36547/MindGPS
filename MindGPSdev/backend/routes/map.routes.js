import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { Map } from "../models/map.model.js";
import { getWeekKey } from "../utils/getWeekKey.js";

const router = Router();

// (Andy) All map routes use Firebase auth first, then MongoDB stores the user's weekly map.

/* =========================================
   GET CURRENT WEEK MAP (AUTO CREATE)
========================================= */
router.get("/current/week", verifyToken, async (req, res) => {
  try {
    // (Andy) req.user is the Mongo user connected to the Firebase account.
    const uid = req.user._id;
    const weekKey = getWeekKey();

    let map = await Map.findOne({ user: uid, weekKey });

    // (Andy) If this user has no map for the week, start with an empty one.
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
    // (Andy) Save always targets the signed-in user's current week.
    const uid = req.user._id;
    const weekKey = getWeekKey();
    const { nodes, edges, title } = req.body;
    const now = new Date();

    // (Andy) Upsert means the frontend can save even if GET did not create the map first.
    const map = await Map.findOneAndUpdate(
      { user: uid, weekKey },
      {
        $set: {
          nodes: Array.isArray(nodes) ? nodes : [],
          edges: Array.isArray(edges) ? edges : [],
          title: title || "My Weekly Mind Map",
          updatedAt: now,
        },
        $setOnInsert: {
          user: uid,
          weekKey,
          createdAt: now,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save weekly map" });
  }
});

export default router;
