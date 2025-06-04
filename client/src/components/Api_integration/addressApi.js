import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/address';

// Create an Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Attach token to request headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // or wherever you store your token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Address Folders API
export const createAddressFolder = async (data) => {
    try {
        const response = await api.post('/folder', data);
        return response.data;
    } catch (error) {
        console.error('Failed to create address folder:', error);
        throw error;
    }
};

export const getAddressFolders = async () => {
    try {
        const response = await api.get('/folders');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch address folders:', error);
        throw error;
    }
};

export const updateAddressFolder = async (id, data) => {
    try {
        const response = await api.put(`/folder/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update address folder:', error);
        throw error;
    }
};

export const deleteAddressFolder = async (id) => {
    try {
        await api.delete(`/folders/${id}`);
    } catch (error) {
        console.error('Failed to delete address folder:', error);
        throw error;
    }
};

// Addresses API
export const createAddress = async (folderId, data) => {
    try {
        const response = await api.post(`/${folderId}/address`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to create address:', error);
        throw error;
    }
};

export const getAddresses = async (folderId) => {
    try {
        const response = await api.get(`/${folderId}/addresses`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch addresses:', error);
        throw error;
    }
};

export const updateAddress = async (id, data) => {
    try {
        const response = await api.put(`/address/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update address:', error);
        throw error;
    }
};

export const deleteAddress = async (id) => {
    try {
        await api.delete(`/address/${id}`);
    } catch (error) {
        console.error('Failed to delete address:', error);
        throw error;
    }
};
