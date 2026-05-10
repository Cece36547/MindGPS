import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mapId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Map', default: null },
  title:     { type: String, default: 'Untitled Entry' },
  content:   { type: String, default: '' },
  feelings:  [{ type: String }],
  influences: [{ type: String }], // List of influences on the journal entry 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

journalSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Journal = mongoose.model('Journal', journalSchema);
