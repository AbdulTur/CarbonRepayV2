import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login({ username, password });
      const user = authService.getCurrentUser();
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'driver') {
        navigate('/dashboard/driver');
      } else {
        navigate('/dashboard/individual');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
