const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const distanceRoutes = require('./routes/distanceRoutes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/carbon-repay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/distances', distanceRoutes);

module.exports = app;
