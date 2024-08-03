const mongoose = require('mongoose');

const distanceRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  distance: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  emission: { type: Number, required: true },
  cargoWeight: { type: Number }
});

module.exports = mongoose.model('DistanceRecord', distanceRecordSchema);
