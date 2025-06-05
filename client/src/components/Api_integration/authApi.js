import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/auth';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error in registration:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Error in login:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const changePassword = async (token, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};