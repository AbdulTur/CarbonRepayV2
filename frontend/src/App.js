import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DriverDashboard from './components/dashboard/DriverDashboard';
import IndividualDashboard from './components/dashboard/IndividualDashboard';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/driver"
          element={
            <PrivateRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/individual"
          element={
            <PrivateRoute allowedRoles={['individual']}>
              <IndividualDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
