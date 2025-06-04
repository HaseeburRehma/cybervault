import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create a new team
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${API_URL}/api/teamapi/create`, teamData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all teams created by the user
export const getTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/teamapi/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.teams;
  } catch (error) {
    throw error.response.data;
  }
};

// Add a member to a team
export const addMemberToTeam = async (teamId, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/teamapi/${teamId}/add-member`,
      { userId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Remove a member from a team
export const removeMemberFromTeam = async (teamId, memberId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/teamapi/${teamId}/remove-member/${memberId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get team details including members
export const getTeamDetails = async (teamId) => {
  try {
    const response = await axios.get(`${API_URL}/api/teamapi/${teamId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.team;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch user ID by email
export const fetchUserIdByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.user._id;
  } catch (error) {
    throw new Error('User not found');
  }
};
