import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/adminDashboard.css';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engineType, setEngineType] = useState('diesel');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
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

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/admin/vehicles/add', {
        make,
        model,
        year,
        engineType,
        fuelEfficiency,
        companyId: user.company,
        userId: user._id 
      });
      setVehicles([...vehicles, response.data]);
      setMake('');
      setModel('');
      setYear('');
      setEngineType('diesel');
      setFuelEfficiency('');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleReset = async () => {
    try {
      await api.post('/api/admin/reset', { companyId: user.company });
      setTotalEmissions(0);
      setTotalRebates(0);
    } catch (error) {
      console.error('Reset failed', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard container mt-5">
      <h2 className="text-center">Admin Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Current Totals</h4>
          <div className="card">
            <div className="card-body">
              <p><strong>Total Emissions:</strong> {totalEmissions} tons</p>
              <p><strong>Total Rebates:</strong> {totalRebates !== undefined ? `$${totalRebates.toFixed(2)}` : '$0.00'}</p>
              <button onClick={handleReset} className="btn btn-danger w-100 mt-2">Repay</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
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
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
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
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Company Vehicles</h4>
          <ul className="list-group">
            {vehicles.map((vehicle) => (
              <li key={vehicle._id} className="list-group-item">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
