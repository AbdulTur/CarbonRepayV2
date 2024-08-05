require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const distanceRoutes = require('./routes/distanceRoutes');
const emissionRoutes = require('./routes/emissionRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Ensure this is correctly imported

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Ensure this is used correctly
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/distances', distanceRoutes);
app.use('/api/emissions', emissionRoutes);

module.exports = app;
