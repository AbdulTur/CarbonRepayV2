const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const User = require('../models/User');
const Company = require('../models/Company');
const router = express.Router();
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
  const { username, password, role, companyName } = req.body;
  console.log('Register request received:', req.body); // Log request body

  try {
    let company;

    if (role === 'admin') {
      console.log('Creating new company for admin...');
      company = new Company({ name: companyName, admin: new mongoose.Types.ObjectId() }); // Use 'new' keyword
      await company.save();
      console.log('Company created:', company);
    } else if (role === 'driver') {
      console.log('Finding company for driver...');
      company = await Company.findOne({ name: companyName });
      if (!company) {
        console.log('Company not found.');
        return res.status(400).send('Company not found.');
      }
      console.log('Company found:', company);
    }

    const user = new User({ username, password, role, company: company ? company._id : null });
    await user.save();
    console.log('User created:', user);

    if (role === 'admin') {
      company.admin = user._id;
      await company.save(); // Save the company with the admin set
      console.log('Admin set for company:', company);
    } else if (role === 'driver') {
      company.drivers.push(user._id);
      await company.save(); // Save the company with the driver added
      console.log('Driver added to company:', company);
    }

    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(400).send(error.message);
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request received:', req.body); // Log login request

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).send('Invalid username or password.');
    }

    console.log('Stored hash:', user.password); // Log stored hashed password
    console.log('Input password:', password); // Log input password

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).send('Invalid username or password.');
    }

    console.log('Password matched for user:', username); // Log success

    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).send(error.message);
  }
});

// Get all companies (for selecting in the signup form for drivers)
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find({}).select('name');
    res.status(200).send(companies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
