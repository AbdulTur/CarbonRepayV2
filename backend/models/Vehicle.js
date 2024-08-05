const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  engineType: { type: String, required: true },
  fuelEfficiency: { type: Number, required: true },
  emissionRate: { type: Number, required: true },
  loadCapacity: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' } // Make this field optional
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
