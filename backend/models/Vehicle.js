const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: String,
  emissionRate: Number, 
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
