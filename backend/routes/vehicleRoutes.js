const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();
const calculateEmissionRate = require('../utils/calculateEmissionRate');

// Add a new vehicle through direct input
router.post('/add', async (req, res) => {
  const { make, model, year, engineType, loadCapacity } = req.body;
  const emissionRate = calculateEmissionRate(engineType, year);
  const vehicle = new Vehicle({ make, model, year, engineType, emissionRate, loadCapacity });

  try {
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).send(vehicles);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
