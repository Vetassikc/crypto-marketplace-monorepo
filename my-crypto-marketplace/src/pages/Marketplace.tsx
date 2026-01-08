import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useProducts } from '../hooks/useProducts';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

type SortOption = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc';

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { products, loading, error } = useProducts({
    search: debouncedSearch,
    sortBy,
  });

  const handleBuyClick = (productId: number) => {
    navigate(`/checkout/${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and purchase products using crypto or card
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <MenuItem value="date_desc">Newest First</MenuItem>
            <MenuItem value="date_asc">Oldest First</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton width="80%" />
                    <Skeleton width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      product.imageUrls?.[0]
                        ? `${API_BASE}${product.imageUrls[0]}`
                        : 'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    alt={product.name}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleViewProduct(product.id)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      noWrap
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleViewProduct(product.id)}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                      }}
                    >
                      {product.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(product.price)}
                      </Typography>
                      {product.store?.cryptoWalletAddress && (
                        <Chip label="Crypto" size="small" color="success" />
                      )}
                    </Box>
                    {product.store?.name && (
                      <Typography variant="caption" color="text.secondary">
                        by {product.store.name}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleBuyClick(product.id)}
                    >
                      Buy Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Box>
  );
}
