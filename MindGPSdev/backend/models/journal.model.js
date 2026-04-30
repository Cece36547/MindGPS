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

journalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  //next(); ( Andy I am commenting this out to see if it fixes the issue with the journal entries not saving to MongoDB. I think the problem might be that the next() function is not being called, which means that the save operation is never completed. By commenting this out, I am allowing the save operation to complete without any issues. )
});

export const Journal = mongoose.model('Journal', journalSchema);
