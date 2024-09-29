import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://stock-monitoring-webapp.onrender.com/api/auth/login', { username, password });
      
      localStorage.setItem('token', response.data.token);
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container style={{ backgroundColor: '#eceff1', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Login
        </Typography>
        {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>

        <Typography variant="body1" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? 
        </Typography>
        
        <Button
          onClick={handleRegister}
          variant="outlined"
          color="primary"
          fullWidth
          style={{ marginTop: '0.5rem' }}
        >
          Register
        </Button>
      </div>
    </Container>
  );
};

export default Login;
