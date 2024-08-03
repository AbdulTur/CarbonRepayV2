const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  engineType: { type: String, required: true },
  emissionRate: { type: Number, required: true }, 
  loadCapacity: { type: Number } 
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
