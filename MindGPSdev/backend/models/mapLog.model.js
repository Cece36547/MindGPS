import mongoose from "mongoose";

const mapLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  weekKey: { type: String, required: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
  archivedAt: { type: Date, default: Date.now }
});

export const MapLog = mongoose.model("MapLog", mapLogSchema);