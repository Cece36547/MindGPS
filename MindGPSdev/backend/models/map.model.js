import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  label:    { type: String, required: true },
  x:        { type: Number, required: true },
  y:        { type: Number, required: true },
  color:    { type: String, default: null },
  feelings: [{ type: String }],
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id:     { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  label:  { type: String, default: null },
}, { _id: false });

const mapSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, default: 'Untitled Map' },
  nodes:     [nodeSchema],
  edges:     [edgeSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mapSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Map = mongoose.model('Map', mapSchema);
