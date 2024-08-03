const express = require('express');
const User = require('../models/User');
const Company = require('../models/Company');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
  const { username, password, role, companyName } = req.body;

  try {
    let company;

    if (role === 'admin') {
      // Create new company if the user is an admin
      company = new Company({ name: companyName, admin: null });
      await company.save();
    } else if (role === 'driver') {
      // Find the company if the user is a driver
      company = await Company.findOne({ name: companyName });
      if (!company) return res.status(400).send('Company not found.');
    }

    const user = new User({ username, password, role, company: company ? company._id : null });
    await user.save();

    if (role === 'admin') {
      // Set the admin of the company
      company.admin = user._id;
      await company.save();
    } else if (role === 'driver') {
      // Add the driver to the company's drivers list
      company.drivers.push(user._id);
      await company.save();
    }

    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid username or password.');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).send('Invalid username or password.');

    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all companies (for selecting in the signup form for drivers)
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find({}).select('name');
    res.status(200).send(companies);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
