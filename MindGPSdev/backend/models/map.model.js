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

/* WEEKLY MAP SCHEMA */
const mapSchema = new mongoose.Schema({
  // Firebase UID
  user: { type: String, required: true },

  // ⭐ THIS MAKES THE RESET WORK
  weekKey: { type: String, required: true },

  title: { type: String, default: "Weekly Mind Map" },

  nodes: [nodeSchema],
  edges: [edgeSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/* auto update timestamp */
mapSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Map = mongoose.model("Map", mapSchema);