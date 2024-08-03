const express = require('express');
const DistanceRecord = require('../models/DistanceRecord');
const Vehicle = require('../models/Vehicle');
const router = express.Router();
const calculateEmission = require('../utils/calculateEmission');

// Add a new distance record
router.post('/add', async (req, res) => {
  const { userId, vehicleId, distance, cargoWeight } = req.body;
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    const emission = calculateEmission(vehicle, distance, cargoWeight);
    const distanceRecord = new DistanceRecord({
      user: userId,
      vehicle: vehicleId,
      distance,
      emission,
      cargoWeight
    });
    await distanceRecord.save();
    res.status(201).send(distanceRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all distance records for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const records = await DistanceRecord.find({ user: userId }).populate('vehicle');
    res.status(200).send(records);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
