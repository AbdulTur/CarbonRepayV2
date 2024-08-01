const mongoose = require('mongoose');

const distanceRecordSchema = new mongoose.Schema({
  driver: String,
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  distance: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DistanceRecord', distanceRecordSchema);
