import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, List, ListItem, Box, Checkbox } from '@mui/material';

// Define the AlphaVantageResponse interface
interface StockData {
  '1. open': string;
}

interface AlphaVantageResponse {
  'Meta Data': {
    '2. Symbol': string;
  };
  'Time Series (1min)': {
    [key: string]: StockData;
  };
}

axios.defaults.baseURL = 'https://stock-monitoring-webapp.onrender.com';

const Dashboard: React.FC = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [stockData, setStockData] = useState<{ [key: string]: string }>({});
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ symbol: string; price: string }[]>([]);
  const token = localStorage.getItem('token');

  const fetchStockData = async () => {
    try {
      const response = await axios.get<AlphaVantageResponse[]>('/api/watchlist/stocks', {
        headers: { 'x-auth-token': token || '' }
      });
      console.log(`here it is the api response: ${response.data}`);
      const data = response.data.reduce((acc: { [key: string]: string }, stock: AlphaVantageResponse) => {
        const symbol = stock['Meta Data']['2. Symbol'];
        const timeSeries = stock['Time Series (1min)'];
        const latestTime = Object.keys(timeSeries)[0];
        acc[symbol] = timeSeries[latestTime]['1. open'];
        return acc;
      }, {});
      setStockData(data);
      localStorage.setItem('watchlist', JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get<string[]>('/api/watchlist', {
        headers: { 'x-auth-token': token || '' }
      });
      setSymbols(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setStockData(JSON.parse(storedWatchlist));
    } else {
      fetchStockData();
    }
    fetchWatchlist();
  }, []);

  const addSymbol = async () => {
    try {
      if (newSymbol) {
        const response = await axios.post<string[]>('/api/watchlist', { symbol: newSymbol }, {
          headers: { 'x-auth-token': token || '' }
        });
        setSymbols(response.data);
        setNewSymbol('');
        fetchStockData();
      } else {
        alert('Please enter a valid symbol');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedSymbols([]); // Clear selected symbols when toggling delete mode
  };

  const handleCheckboxChange = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter(item => item !== symbol));
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await axios.delete<string[]>('/api/watchlist', {
        data: { symbols: selectedSymbols },
        headers: { 'x-auth-token': token || '' }
      });
      setSymbols(response.data);
      setSelectedSymbols([]);
      fetchStockData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };
  
  // Function to handle signout
  const handleSignout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to the login page
  };


  return (
    <Container style={{ backgroundColor: '#e0f7fa', minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <Button 
        onClick={handleSignout} 
        variant="contained" 
        color="secondary" 
        style={{ position: 'absolute', top: '1rem', right: '1rem' }}
      >
        Sign Out
      </Button>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Dashboard</h2>
      
      <a href="https://stockanalysis.com/stocks/" target="_blank" rel="noopener noreferrer">Find Stock Symbols</a>
      
      <TextField
        label="Add Symbol"
        value={newSymbol}
        onChange={(e) => setNewSymbol(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={addSymbol} variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
        Add
      </Button>
      
      <Box 
        sx={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
          padding: '1rem', 
          marginTop: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ flex: 1, margin: 0 }}>Watchlist</h3>
          {!isDeleteMode ? (
            <Button onClick={handleDeleteModeToggle} variant="outlined" color="secondary">
              Delete
            </Button>
          ) : (
            <Button onClick={handleDeleteSelected} variant="contained" color="secondary">
              Confirm Delete
            </Button>
          )}
        </div>
        <List>
          {symbols.map((symbol) => (
            <ListItem key={symbol} style={{ display: 'flex', alignItems: 'center' }}>
              {isDeleteMode && (
                <Checkbox
                  checked={selectedSymbols.includes(symbol)}
                  onChange={() => handleCheckboxChange(symbol)}
                />
              )}
              <div style={{ flex: 1 }}>{symbol}: {stockData[symbol] ? stockData[symbol] : 'Loading...'}</div>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Dashboard;
