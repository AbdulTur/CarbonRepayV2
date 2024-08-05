import React, { useState } from 'react';
import api from '../services/api'; // Import the central Axios instance
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [engineType, setEngineType] = useState('petrol');
  const [year, setYear] = useState('');
  const [distance, setDistance] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [drivingCondition, setDrivingCondition] = useState('city');
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/emissions/calculate', {
        engineType,
        year,
        fuelEfficiency,
        drivingCondition,
        distance,
        cargoWeight,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Calculation failed', error);
    }
  };

  return (
    <div className="home-container container mt-5">
      <div className="text-center mb-4">
        <h2>Welcome to Carbon Repay</h2>
        <p>
          Our app helps you calculate your vehicle's carbon emissions and provides rebates to encourage eco-friendly driving. 
          Whether you are an individual, a driver, or a business, our platform offers tailored features to meet your needs.
        </p>
      </div>
      <div className="benefits-section mt-5">
        <h4 className="text-center">Benefits of Signing Up</h4>
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Individuals</h5>
                <p className="card-text">Save your vehicle data and track your carbon emissions over time.</p>
                <Link to="/register" className="btn btn-outline-primary">Sign Up</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Drivers</h5>
                <p className="card-text">Record your trips, calculate emissions for each trip, and get rebates.</p>
                <Link to="/register" className="btn btn-outline-primary">Sign Up</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Businesses</h5>
                <p className="card-text">Manage fleet emissions, track vehicle usage, and optimize operations for better sustainability.</p>
                <Link to="/register" className="btn btn-outline-primary">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <h3 className="text-center">Carbon Emission Calculator</h3>
          <form onSubmit={handleCalculate} className="home-form mt-4">
            <div className="mb-3">
              <label className="form-label">Engine Type</label>
              <select className="form-select" value={engineType} onChange={(e) => setEngineType(e.target.value)}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Year</label>
              <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Fuel Efficiency (L/100km)</label>
              <input type="number" className="form-control" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Driving Condition</label>
              <select className="form-select" value={drivingCondition} onChange={(e) => setDrivingCondition(e.target.value)}>
                <option value="city">City</option>
                <option value="highway">Highway</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Distance (km)</label>
              <input type="number" className="form-control" value={distance} onChange={(e) => setDistance(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Cargo Weight (kg)</label>
              <input type="number" className="form-control" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Calculate</button>
          </form>
          {result && (
            <div className="result mt-4">
              <h4>Emission Info</h4>
              <p><strong>Total Emission (tons):</strong> {result.emission}</p>
              <p><strong>Rebate Amount:</strong> ${result.donation.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
