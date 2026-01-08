import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWallet } from './context/WalletContext';
import { apiClient, Product, Category } from './api/client';

// MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, isConnected, connect } = useWallet();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [product, cats] = await Promise.all([
        apiClient.getProduct(parseInt(id)),
        apiClient.getCategories(),
      ]);

      // Populate form
      setName(product.name);
      setPrice(String(product.price));
      setSelectedCategoryId(product.categoryId || '');
      setDescription(product.description || '');
      setExistingImages(product.imageUrls || []);
      setCategories(cats);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !id) {
      toast.error('Please connect your wallet');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('ownerAddress', account);

      if (selectedCategoryId) {
        formData.append('categoryId', String(selectedCategoryId));
      }

      // Add existing images that weren't removed
      existingImages.forEach(url => formData.append('existingImageUrls', url));

      // Add new files
      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append('image', newImages[i]);
        }
      }

      await apiClient.updateProduct(parseInt(id), formData);
      toast.success('Product updated successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!account || !id) return;
    
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.deleteProduct(parseInt(id), account);
      toast.success('Product deleted successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to delete product');
    }
  };

  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          You need to connect your wallet to edit products
        </Typography>
        <Button variant="contained" onClick={connect}>
          Connect Wallet
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product
        </Typography>
        
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Price (USD)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              label="Category"
              onChange={(e) => setSelectedCategoryId(e.target.value as number)}
            >
              {categories.map((category) => [
                <ListSubheader key={`header-${category.id}`}>{category.name}</ListSubheader>,
                ...(category.children || []).map((subCat) => (
                  <MenuItem key={subCat.id} value={subCat.id} sx={{ pl: 4 }}>
                    {subCat.name}
                  </MenuItem>
                ))
              ])}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Existing Images */}
          <Typography variant="h6" sx={{ mt: 2 }}>Images</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {existingImages.map((url, index) => (
              <Grid key={index}>
                <Box sx={{ position: 'relative', width: 100 }}>
                  <CardMedia
                    component="img"
                    image={`${API_BASE}${url}`}
                    sx={{ aspectRatio: '1 / 1', borderRadius: 1 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onClick={() => handleRemoveExistingImage(url)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" component="label" sx={{ mt: 2, mb: 1 }}>
            Add New Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(e.target.files)}
            />
          </Button>
          
          {newImages && newImages.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {`Selected ${newImages.length} new file(s)`}
            </Typography>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete Product
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
