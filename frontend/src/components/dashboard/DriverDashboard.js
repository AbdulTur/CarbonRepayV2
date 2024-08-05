import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/driverDashboard.css';
import { useAuth } from '../../contexts/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [distance, setDistance] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [drivingCondition, setDrivingCondition] = useState('city');
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalRebates, setTotalRebates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchVehicles = async () => {
        try {
          const response = await api.get(`/api/admin/vehicles/company/${user.company}`);
          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      };

      const fetchTotals = async () => {
        try {
          const response = await api.get(`/api/admin/totals/${user.company}`);
          setTotalEmissions(response.data.totalEmissions || 0);
          setTotalRebates(response.data.totalRebates || 0);
        } catch (error) {
          console.error('Error fetching totals:', error);
        }
      };

      fetchVehicles();
      fetchTotals();
      setLoading(false);
    } else {
      setLoading(false);
      setError('User not logged in.');
    }
  }, [user]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/admin/distances/add', {
        userId: user._id,
        vehicleId: selectedVehicle,
        distance,
        cargoWeight,
        drivingCondition,
      });
      setTotalEmissions(response.data.totalEmissions || 0);
      setTotalRebates(response.data.totalRebates || 0);
      setDistance('');
      setCargoWeight('');
    } catch (error) {
      console.error('Calculation failed', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="driver-dashboard container mt-5">
      <h2 className="text-center">Driver Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Current Totals</h4>
          <div className="card">
            <div className="card-body">
              <p><strong>Total Emissions:</strong> {totalEmissions} tons</p>
              <p><strong>Total Rebates:</strong> {totalRebates !== undefined ? `$${totalRebates.toFixed(2)}` : '$0.00'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Select Vehicle</h4>
          <select className="form-select" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} required>
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} ({vehicle.year})</option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleCalculate}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Distance (km)</label>
            <input type="number" className="form-control" value={distance} onChange={(e) => setDistance(e.target.value)} required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Cargo Weight (kg)</label>
            <input type="number" className="form-control" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Driving Condition</label>
            <select className="form-select" value={drivingCondition} onChange={(e) => setDrivingCondition(e.target.value)}>
              <option value="city">City</option>
              <option value="highway">Highway</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">Calculate</button>
      </form>
    </div>
  );
};

export default DriverDashboard;
