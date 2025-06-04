import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000", // Ensure this environment variable is set
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export const createVaultFolder = async (data) => {
  try {
    const response = await api.post('/api/vault/folders', data);
    return response.data;
  } catch (error) {
    console.error('Error creating vault folder:', error);
    return null;
  }
};

export const getVaultFolders = async () => {
  try {
    const response = await api.get('/api/vault/folders');
    return response.data;
  } catch (error) {
    console.error('Error fetching vault folders:', error);
    return [];
  }
};

export const updateVaultFolder = async (folderId, data) => {
  try {
    const response = await api.put(`/api/vault/folders/${folderId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vault folder:', error);
    return null;
  }
};

export const deleteVaultFolder = async (folderId) => {
  try {
    await api.delete(`/api/vault/folders/${folderId}`);
  } catch (error) {
    console.error('Error deleting vault folder:', error);
  }
};

export const createVault = async (data) => {
  try {
    const response = await api.post('/api/vault/vaults', data);
    return response.data;
  } catch (error) {
    console.error('Error creating vault:', error);
    return null;
  }
};

export const getVaults = async (folderId) => {
    try {
      const response = await api.get(`/api/vault/vaults/${folderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vaults:', error);
      return [];
    }
  };

  export const updateVault = async (vaultId, data) => {
    try {
      const response = await api.put(`/api/vault/vaults/${vaultId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating vault:', error);
      return null;
    }
  };
  
  export const deleteVault = async (vaultId) => {
    try {
      await api.delete(`/api/vault/vaults/${vaultId}`);
    } catch (error) {
      console.error('Error deleting vault:', error);
    }
  };