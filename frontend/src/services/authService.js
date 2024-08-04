import api from './api';
import {jwtDecode} from 'jwt-decode';

const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

const getCompanies = () => {
  return api.get('/api/auth/companies');
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getCompanies
};

export default authService;
