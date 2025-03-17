const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  location: { type: String, required: true },
  // ...other fields...
});

module.exports = mongoose.model('Event', eventSchema);
