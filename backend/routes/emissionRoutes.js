const express = require('express');
const router = express.Router();
const calculateEmission = require('../utils/calculateEmission');
const calculateEmissionRate = require('../utils/calculateEmissionRate');

// Calculate emissions for a given vehicle parameters
router.post('/calculate', async (req, res) => {
  const { engineType, year, distance, cargoWeight } = req.body;
  const emissionRate = calculateEmissionRate(engineType, year);
  const emission = calculateEmission({ emissionRate, loadCapacity: 0 }, distance, cargoWeight);
  const donation = emission * 10.5;

  res.status(200).send({ emission, donation });
});

module.exports = router;
