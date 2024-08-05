import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/individualDashboard.css';
import { useAuth } from '../../contexts/AuthContext';

const IndividualDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [distance, setDistance] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalRebates, setTotalRebates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engineType, setEngineType] = useState('petrol');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [drivingCondition, setDrivingCondition] = useState('city');

  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    setVehicles(storedVehicles);
    if (user) {
      const fetchTotals = async () => {
        try {
          const response = await api.get(`/api/distances/totals/${user._id}`);
          setTotalEmissions(response.data.totalEmissions || 0);
          setTotalRebates(response.data.totalRebates || 0);
        } catch (error) {
          console.error('Error fetching totals:', error);
        }
      };
      fetchTotals();
    }
    setLoading(false);
  }, [user]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/vehicles/add', {
        make,
        model,
        year,
        engineType,
        fuelEfficiency,
        userId: user._id,
      });

      const newVehicle = response.data;
      const storedVehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      localStorage.setItem('vehicles', JSON.stringify([...storedVehicles, newVehicle]));

      setVehicles([...vehicles, newVehicle]);
      setMake('');
      setModel('');
      setYear('');
      setEngineType('petrol');
      setFuelEfficiency('');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/distances/add', {
        userId: user._id,
        vehicleId: selectedVehicle,
        distance,
        cargoWeight,
        drivingCondition,
      });
      setTotalEmissions(response.data.totalEmissions || 0);
      setTotalRebates(response.data.totalRebates || 0);
    } catch (error) {
      console.error('Calculation failed', error);
    }
  };

  const handleReset = async () => {
    try {
      await api.post('/api/distances/reset', { userId: user._id });
      setTotalEmissions(0);
      setTotalRebates(0);
    } catch (error) {
      console.error('Reset failed', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="individual-dashboard container mt-5">
      <h2 className="text-center">Individual Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h4>Current Totals</h4>
              <p><strong>Total Emissions:</strong> {totalEmissions} tons</p>
              <p><strong>Total Rebates:</strong> {totalRebates !== undefined ? `$${totalRebates.toFixed(2)}` : '$0.00'}</p>
              <button onClick={handleReset} className="btn btn-danger w-100 mt-2">Repay</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h4>Add New Vehicle</h4>
              <form onSubmit={handleAddVehicle}>
                <div className="mb-3">
                  <label className="form-label">Make</label>
                  <input type="text" className="form-control" value={make} onChange={(e) => setMake(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Model</label>
                  <input type="text" className="form-control" value={model} onChange={(e) => setModel(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Year</label>
                  <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Engine Type</label>
                  <select className="form-select" value={engineType} onChange={(e) => setEngineType(e.target.value)} required>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Fuel Efficiency (L/100km)</label>
                  <input type="number" className="form-control" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Vehicle</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 mb-5 bg-white rounded">
            <div className="card-body">
              <h4>Select Vehicle</h4>
              <select className="form-select" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} ({vehicle.year})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleCalculate}>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-5 bg-white rounded">
              <div className="card-body">
                <h4>Calculate Emissions</h4>
                <div className="mb-3">
                  <label className="form-label">Distance (km)</label>
                  <input type="number" className="form-control" value={distance} onChange={(e) => setDistance(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cargo Weight (kg)</label>
                  <input type="number" className="form-control" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Driving Condition</label>
                  <select className="form-select" value={drivingCondition} onChange={(e) => setDrivingCondition(e.target.value)}>
                    <option value="city">City</option>
                    <option value="highway">Highway</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Calculate</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IndividualDashboard;
