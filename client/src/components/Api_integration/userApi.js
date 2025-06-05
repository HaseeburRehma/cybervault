// src/apiService.js
import axios from 'axios';
const API_URL = 'http://localhost:8000/api/userdetail';

export const getUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};


export const fetchUserDetailsById = async (userId, token) => {

  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// Fetch user ID by email
export const fetchUserIdByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/userByEmail`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      params: {
        email,
      },
    });
    return response.data.userId; // Assuming response contains userId field
  } catch (error) {
    console.error('Error fetching user ID by email:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};
