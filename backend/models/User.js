const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'driver', 'individual'], required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, 
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }]
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(`Hashed password (pre-save): ${this.password}`); 
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  console.log(`Input password: ${inputPassword}`);
  console.log(`Stored hash: ${this.password}`);
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  console.log(`Comparing input password: ${inputPassword} with stored hash: ${this.password}. Match: ${isMatch}`);
  return isMatch;
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role, company: this.company }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  return token;
};

module.exports = mongoose.model('User', userSchema);
