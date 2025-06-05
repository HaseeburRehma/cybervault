import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/cards';

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

// Card API Endpoints
export const createCard = async (data) => {
    try {
        const response = await api.post('/', data);
        return response.data;
    } catch (error) {
        console.error('Failed to create card:', error);
        throw error;
    }
};

export const getCards = async (folderId) => {
    try {
        const response = await api.get(`/?folder=${folderId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch cards:', error);
        throw error;
    }
};

export const updateCard = async (id, data) => {
    try {
        const response = await api.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update card:', error);
        throw error;
    }
};

export const deleteCard = async (id) => {
    try {
        await api.delete(`/${id}`);
    } catch (error) {
        console.error('Failed to delete card:', error);
        throw error;
    }
};

// Card Folder API Endpoints
export const createCardFolder = async (data) => {
    try {
        const response = await api.post('/folders', data);
        return response.data;
    } catch (error) {
        console.error('Failed to create card folder:', error);
        throw error;
    }
};

export const updateCardFolder = async (id, data) => {
    try {
        const response = await api.put(`/folders/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Failed to update card folder:', error);
        throw error;
    }
};

export const getCardFolders = async () => {
    try {
        const response = await api.get('/folders');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch card folders:', error);
        throw error;
    }
};

export const deleteCardFolder = async (id) => {
    try {
        await api.delete(`/folders/${id}`);
    } catch (error) {
        console.error('Failed to delete card folder:', error);
        throw error;
    }
};
