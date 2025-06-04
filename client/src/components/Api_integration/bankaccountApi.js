import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Bank Account Folder API
export const createFolder = async (folderName) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/bankaccounts/folders`, { folderName }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFolders = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/bankaccounts/folders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateFolder = async (id, folderName) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/bankaccounts/folders/${id}`, { folderName }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteFolder = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/bankaccounts/folders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Bank Account API
export const createAccount = async (accountData) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/bankaccounts/accounts`, accountData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAccounts = async (folderId) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/bankaccounts/accounts/${folderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAccount = async (id, accountData) => {
  const token = getToken();
  const response = await axios.put(`${API_URL}/bankaccounts/accounts/${id}`, accountData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteAccount = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${API_URL}/bankaccounts/accounts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
