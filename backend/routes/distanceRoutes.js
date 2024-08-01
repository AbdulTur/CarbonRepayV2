const express = require('express');
const DistanceRecord = require('../models/DistanceRecord');
const router = express.Router();

// Add a new distance record
router.post('/add', async (req, res) => {
  const distanceRecord = new DistanceRecord(req.body);
  try {
    await distanceRecord.save();
    res.status(201).send(distanceRecord);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all distance records
router.get('/', async (req, res) => {
  try {
    const records = await DistanceRecord.find({}).populate('vehicle');
    res.status(200).send(records);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
