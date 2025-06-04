// src/components/TeamDetails.jsx
import React, { useState } from 'react';
import { FaTrash, FaUserPlus } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { fetchUserIdByEmail } from '../Api_integration/userApi';
import { addMemberToTeam, removeMemberFromTeam } from '../Api_integration/teamApi';

const TeamDetails = ({ teamDetails, onMemberAdded, onMemberRemoved, loading, error }) => {
  const [memberEmail, setMemberEmail] = useState('');
  
  const handleAddMember = async () => {
    if (!memberEmail.trim()) {
      onMemberAdded('Email is required');
      return;
    }
    onMemberAdded(null); // Clear previous error
    try {
      const userId = await fetchUserIdByEmail(memberEmail);
      await addMemberToTeam(teamDetails._id, userId);
      setMemberEmail('');
      onMemberAdded(null); // Clear error after success
    } catch (error) {
      onMemberAdded(error.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    onMemberAdded(null); // Clear previous error
    try {
      await removeMemberFromTeam(teamDetails._id, memberId);
      onMemberRemoved(); // Notify parent to refresh team details
    } catch (error) {
      onMemberAdded(error.message || 'Error removing member');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-semibold mb-4">Team Details</h3>
      <p className="mb-2 text-gray-800">Team Name: <strong>{teamDetails.name}</strong></p>
      <p className="mb-4 text-gray-800">Admin: <strong>{teamDetails.admin.name}</strong></p>

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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.user.name}</td>
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
  );
};

export default TeamDetails;
