const express = require('express');
const Vehicle = require('../models/Vehicle');
const router = express.Router();
const calculateEmissionRate = require('../utils/calculateEmissionRate');


router.post('/add', async (req, res) => {
  const { make, model, year, engineType, fuelEfficiency, loadCapacity, userId } = req.body;
  const emissionRate = calculateEmissionRate(engineType, year, fuelEfficiency);
  const vehicle = new Vehicle({ make, model, year, engineType, fuelEfficiency, emissionRate, loadCapacity, user: userId });

  try {
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const vehicles = await Vehicle.find({ user: userId });
    res.status(200).send(vehicles);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
