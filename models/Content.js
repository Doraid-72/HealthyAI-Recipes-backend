const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: String,
  type: String, // recipe, workout, ebook
  description: String,
  language: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', ContentSchema);