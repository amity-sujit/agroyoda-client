import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Login() {
  const [username, setUsername] = useState('testuser1');
  const [password, setPassword] = useState('testpass123');
  const [error, setError] = useState('');
  const { setToken, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://agro-node-api-centralcanada.azurewebsites.net/api/auth/login', {
        username,
        password,
      });
      const newToken = response.data.token;
      setToken(newToken);
      setIsAuthenticated(true);
      navigate('/'); // Redirect to Map
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;