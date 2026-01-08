import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWallet } from '../context/WalletContext';
import { apiClient } from '../api/client';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  InputAdornment,
} from '@mui/material';

export default function AddProduct() {
  const navigate = useNavigate();
  const { account, isConnected, connect } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Digital');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!name || !price || !description || !image) {
      setError('Please fill in all fields and upload an image.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('ownerAddress', account);
      formData.append('image', image);

      await apiClient.createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          You need to connect your wallet to add products
        </Typography>
        <Button variant="contained" onClick={connect}>
          Connect Wallet
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Product Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            required
            value={price}
            onChange={e => setPrice(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={e => setCategory(e.target.value)}
            >
              <MenuItem value="Digital">Digital Art</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Services">Services</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2, py: 1.5 }}
          >
            {image ? `Selected: ${image.name}` : 'Upload Product Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ flex: 1 }}
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
