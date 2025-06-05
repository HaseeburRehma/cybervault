import React, { useState } from 'react';
import './form.css';
import { registerUser } from '../Api_integration/authApi';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invitationToken, setInvitationToken] = useState(''); // New state for invitation token
  const [teamId, setTeamId] = useState(''); // New state for team ID
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userData = { 
      username, 
      email, 
      password,
      token: invitationToken, // Include token if provided
      teamId: teamId // Include teamId if provided
    };

    try {
      await registerUser(userData);
      // Redirect to login or show a success message
    } catch (error) {
      setError(error.response ? error.response.data.msg : 'Registration failed');
    }
  };

  return (
    <div className="form-container sign-up">
      <form onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold mb-4 text-blue-800'>Registration</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Master Key"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          name="invitationToken"
          placeholder="Invitation Token (if any)"
          value={invitationToken}
          onChange={(e) => setInvitationToken(e.target.value)}
        />
        <input
          type="text"
          name="teamId"
          placeholder="Team ID (if any)"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
