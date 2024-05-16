import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setLoading(false);
      navigate('/login');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Container style={{ backgroundColor: '#eceff1', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
          Register
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
          onClick={handleRegister}
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        <Typography variant="body1" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? 
        </Typography>
        <Button
          onClick={handleLoginRedirect}
          variant="outlined"
          color="primary"
          fullWidth
          style={{ marginTop: '0.5rem' }}
        >
          Login
        </Button>
      </div>
    </Container>
  );
};

export default Register;
