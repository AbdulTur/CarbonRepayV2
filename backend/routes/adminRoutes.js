const express = require('express');
const Vehicle = require('../models/Vehicle');
const DistanceRecord = require('../models/DistanceRecord');
const User = require('../models/User');
const router = express.Router();
const calculateEmissionRate = require('../utils/calculateEmissionRate');
const calculateEmission = require('../utils/calculateEmission');

// Add a new vehicle to the company
router.post('/vehicles/add', async (req, res) => {
  const { make, model, year, engineType, fuelEfficiency, companyId, userId } = req.body;
  const emissionRate = calculateEmissionRate(engineType, year, fuelEfficiency);
  const vehicle = new Vehicle({ make, model, year, engineType, fuelEfficiency, emissionRate, company: companyId, user: userId });

  try {
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all vehicles for the company
router.get('/vehicles/company/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const vehicles = await Vehicle.find({ company: companyId });
    res.status(200).send(vehicles);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get total emissions and rebates for the company
router.get('/totals/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const users = await User.find({ company: companyId });
    const userIds = users.map(user => user._id);
    const records = await DistanceRecord.find({ user: { $in: userIds } });

    const totalEmissions = records.reduce((acc, record) => acc + record.emission, 0);
    const totalRebates = totalEmissions * 10.5; 

    res.status(200).send({ totalEmissions, totalRebates });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Reset all records for the company
router.post('/reset', async (req, res) => {
  const { companyId } = req.body;
  try {
    const users = await User.find({ company: companyId });
    const userIds = users.map(user => user._id);
    await DistanceRecord.deleteMany({ user: { $in: userIds } });
    res.status(200).send('All records reset');
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add a new distance record
router.post('/distances/add', async (req, res) => {
  const { userId, vehicleId, distance, cargoWeight, drivingCondition } = req.body;
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    const emissionRate = calculateEmissionRate(vehicle.engineType, vehicle.year, vehicle.fuelEfficiency, drivingCondition);
    const emission = calculateEmission({ emissionRate, loadCapacity: vehicle.loadCapacity }, distance, cargoWeight);

    const distanceRecord = new DistanceRecord({
      user: userId,
      vehicle: vehicleId,
      distance,
      emission,
      cargoWeight
    });

    await distanceRecord.save();

    // Update company's total emissions and rebates
    const users = await User.find({ company: vehicle.company });
    const userIds = users.map(user => user._id);
    const records = await DistanceRecord.find({ user: { $in: userIds } });

    const totalEmissions = records.reduce((acc, record) => acc + record.emission, 0);
    const totalRebates = totalEmissions * 10.5; 

    res.status(201).send({ distanceRecord, totalEmissions, totalRebates });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
