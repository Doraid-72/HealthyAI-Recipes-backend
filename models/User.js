const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  subscriptionType: { type: String, default: 'free' }, // free, monthly, yearly
  languagePreference: { type: String, default: 'ar' }
});

module.exports = mongoose.model('User', UserSchema);