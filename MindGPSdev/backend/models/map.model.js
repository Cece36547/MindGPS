import mongoose from "mongoose";

/* NODE SCHEMA */
const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, default: null },
    feelings: [{ type: String }],
  },
  { _id: false }
);

/* EDGE SCHEMA */
const edgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    label: { type: String, default: null },
  },
  { _id: false }
);

/* =========================
   MAP SCHEMA (WEEKLY MAP)
========================= */
const mapSchema = new mongoose.Schema({
  // Firebase UID (NOT Mongo ObjectId)
  user: { type: String, required: true },

  // identifies the week this map belongs to (ex: 2026-W17)
  weekKey: { type: String, required: true },

  title: { type: String, default: "Untitled Map" },

  nodes: [nodeSchema],
  edges: [edgeSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/* Automatically update updatedAt on every save */
mapSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Map = mongoose.model("Map", mapSchema);