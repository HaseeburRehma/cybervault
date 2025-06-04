import React, { useState, useEffect } from 'react';
import { createTeam, getTeams, addMemberToTeam, removeMemberFromTeam, getTeamDetails } from '../Api_integration/teamApi';
import { fetchUserIdByEmail, fetchUserDetailsById } from '../Api_integration/userApi';
import { FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Team = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [teamDetails, setTeamDetails] = useState(null);
  const [userDetails, setUserDetails] = useState({}); // New state for storing user details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const fetchedTeams = await getTeams();
      setTeams(fetchedTeams);
    } catch (error) {
      setError(error.message || 'Error fetching teams');
    }
  };

  const fetchUserDetails = async (userIds) => {
    try {
      const token = localStorage.getItem('token');
      const details = await Promise.all(
        userIds.map(userId => fetchUserDetailsById(userId, token))
      );
      const userDetailMap = details.reduce((acc, user) => {
        if (user) acc[user._id] = user.username; // Correctly map _id to username
        return acc;
      }, {});
      setUserDetails(userDetailMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newTeam = await createTeam({ name: teamName });
      setTeams([...teams, newTeam.team]);
      setTeamName('');
    } catch (error) {
      setError(error.message || 'Error creating team');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const details = await getTeamDetails(teamId);
      setSelectedTeam(teamId);
      setTeamDetails(details);
      await fetchUserDetails(details.members.map(member => member.user));
    } catch (error) {
      setError(error.message || 'Error fetching team details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userId = await fetchUserIdByEmail(memberEmail);
      if (userId) {
        // User exists, add them to the team
        await addMemberToTeam(selectedTeam, userId);
      } else {
        // User does not exist, send an invitation
        await sendInvitation(memberEmail, selectedTeam);
      }
      handleSelectTeam(selectedTeam);
      setMemberEmail('');
    } catch (error) {
      setError(error.message || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };

  // Define a new API call to send an invitation
  const sendInvitation = async (email, teamId) => {
    try {
      const response = await fetch('http://localhost:8000/api/teamapi/invite-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email, teamId })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error sending invitation');
      }
      console.log('Invitation sent successfully');
    } catch (error) {
      throw new Error(error.message || 'Error sending invitation');
    }
  };


  const handleRemoveMember = async (memberId) => {
    setLoading(true);
    setError(null);
    try {
      await removeMemberFromTeam(selectedTeam, memberId);
      handleSelectTeam(selectedTeam);
    } catch (error) {
      setError(error.message || 'Error removing member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 h-96 p-4 mb-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Team Management</h2>

      {/* Create Team Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">Create Team</h3>
        <div className="flex items-center">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="border border-gray-300 p-3 rounded-lg flex-grow mr-4"
          />
          <button
            onClick={handleCreateTeam}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaPlus />}
            <span className="ml-2">Create Team</span>
          </button>
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      {/* Team List Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">My Teams</h3>
        <ul className="space-y-2">
          {teams.map((team) => (
            <li key={team._id}>
              <button
                onClick={() => handleSelectTeam(team._id)}
                className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 text-left text-gray-700"
              >
                {team.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Team Details and Member Management Section */}
      {teamDetails && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">Team Details</h3>
          <p className="mb-2 text-gray-800">Team Name: <strong>{teamDetails.name}</strong></p>
          <p className="mb-4 text-gray-800">Admin: <strong>{teamDetails.admin.username}</strong></p>

          {/* Add Member Section */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-4">Add Member</h4>
            <div className="flex items-center">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter member email"
                className="border border-gray-300 p-3 rounded-lg flex-grow mr-4"
              />
              <button
                onClick={handleAddMember}
                className={`bg-green-600 text-white px-6 py-3 rounded-lg flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaUserPlus />}
                <span className="ml-2">Add Member</span>
              </button>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          {/* Members List */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Team Members</h4>
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamDetails.members.map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userDetails[member.user] || 'Loading...'} {/* Use member.user here */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
