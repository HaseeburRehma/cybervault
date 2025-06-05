import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/notes';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Create a new Note Folder
export const createNoteFolder = async (name) => {
  setAuthToken(); // Ensure this sets the correct auth token in headers
  try {
      const response = await api.post('/folders', { name });
      return response.data;
  } catch (error) {
      console.error('Error creating note folder:', error);
      throw error;
  }
};



// Get all Note Folders for the user
export const getNoteFolders = async () => {
    setAuthToken(); // Ensure token is set
    try {
        const response = await api.get('/folders');
        return response.data;
    } catch (error) {
        console.error('Error fetching note folders:', error);
        throw error;
    }
};



// Update a Note Folder by ID
export const updateNoteFolder = async (folderId, name) => {
    setAuthToken();
    try {
        const response = await api.put(`/folders/${folderId}`, { name });
        return response.data;
    } catch (error) {
        console.error('Error updating note folder:', error);
        throw error;
    }
};

// Delete a Note Folder by ID
export const deleteNoteFolder = async (folderId) => {
    setAuthToken();
    try {
        const response = await api.delete(`/folders/${folderId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting note folder:', error);
        throw error;
    }
};

// Note API Endpoints
// Create a new Note in a specific folder
export const createNote = async (folderId, title, content) => {
    setAuthToken();
    try {
        const response = await api.post('/notes', { folder: folderId, title, content });
        return response.data;
    } catch (error) {
        console.error('Error creating note:', error);
        throw error;
    }
};

// Get all Notes in a specific folder
export const getNotesInFolder = async (folderId) => {
  try {
      const response = await api.get(`/notes/folder/${folderId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
  }
};


// Update a Note by ID
export const updateNote = async (noteId, title, content) => {
    setAuthToken();
    try {
        const response = await api.put(`/notes/${noteId}`, { title, content });
        return response.data;
    } catch (error) {
        console.error('Error updating note:', error);
        throw error;
    }
};

// Delete a Note by ID
export const deleteNote = async (noteId) => {
    setAuthToken();
    try {
        const response = await api.delete(`/notes/${noteId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};
