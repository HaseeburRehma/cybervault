import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './form.css';
import { loginUser } from '../Api_integration/authApi';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const loginData = { email, password };
      await loginUser(loginData);
      // Redirect to the dashboard or home page

      navigate('/userProfile'); // Redirect to home page or login page after logout
      window.location.reload(); // Refresh the screen


    } catch (error) {
      setError(error.response ? error.response.data.msg : 'Login failed');
    }
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold mb-4 text-blue-800'>Login</h1>
        {error && <p className="error">{error}</p>}
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
        <Link to="/forgot-password">Forgot Password?</Link>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
