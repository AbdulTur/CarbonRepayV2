import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('individual');
  const [companyName, setCompanyName] = useState('');
  const [companies, setCompanies] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await authService.getCompanies();
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    try {
      await authService.register({ username, password, role, companyName });
      const user = authService.getCurrentUser();
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'driver') {
        navigate('/dashboard/driver');
      } else {
        navigate('/dashboard/individual');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="individual">Individual</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {(role === 'driver' || role === 'admin') && (
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            {role === 'driver' ? (
              <select className="form-select" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required>
                <option value="">Select a Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            )}
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
