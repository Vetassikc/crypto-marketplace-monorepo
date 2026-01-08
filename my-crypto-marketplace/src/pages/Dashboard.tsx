import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useStore } from '../hooks/useStore';
import { apiClient, Product } from '../api/client';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Loading } from '../components/common/Loading';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { account, isConnected, connect } = useWallet();
  const { store, loading: storeLoading, createStore, updateCryptoWallet, refetch } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [cryptoWallet, setCryptoWallet] = useState('');

  // Fetch products when store is available
  const fetchProducts = useCallback(async () => {
    if (!store) return;
    
    try {
      const allProducts = await apiClient.getProducts();
      const myProducts = allProducts.filter(p => p.storeId === store.id);
      setProducts(myProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, [store]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Check Stripe status on return from onboarding
  useEffect(() => {
    const handleStripeReturn = async () => {
      if (searchParams.get('stripe') === 'success' && account) {
        try {
          await apiClient.checkStripeStatus(account);
          refetch();
        } catch (err) {
          console.error('Stripe status check failed:', err);
        }
      }
    };
    
    handleStripeReturn();
  }, [searchParams, account, refetch]);

  const handleConnectStripe = async () => {
    if (!account) return;
    
    try {
      const { url } = await apiClient.startStripeConnect(account);
      window.location.href = url;
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Failed to connect to Stripe');
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);
    
    try {
      await createStore(storeName, storeDescription);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to create store');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCryptoWallet = async () => {
    if (!cryptoWallet) return;
    
    try {
      await updateCryptoWallet(cryptoWallet);
      setCryptoWallet('');
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || 'Failed to update crypto wallet');
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Connect your wallet to access the seller dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={connect}>
          Connect Wallet
        </Button>
      </Box>
    );
  }

  // Loading state
  if (storeLoading) {
    return <Loading message="Loading your store..." />;
  }

  // No store - show create form
  if (!store) {
    return (
      <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Become a Seller
        </Typography>
        <Typography color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Create your store to start selling products
        </Typography>
        
        <Box component="form" onSubmit={handleCreateStore}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            label="Store Name"
            required
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={storeDescription}
            onChange={e => setStoreDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Store'}
          </Button>
        </Box>
      </Paper>
    );
  }

  // Store exists - show dashboard
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Store Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4">{store.name}</Typography>
            <Typography color="text.secondary">{store.description}</Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('/dashboard/add-product')}>
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Stripe Alert */}
      {!store.stripeOnboardingComplete ? (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          action={
            <Button color="inherit" size="small" onClick={handleConnectStripe}>
              Connect Stripe
            </Button>
          }
          sx={{ mb: 3 }}
        >
          <Typography fontWeight="bold">Action Required</Typography>
          To receive card payments, connect your bank account via Stripe.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
          <Typography fontWeight="bold">Card Payments Active</Typography>
          Your Stripe account is connected and ready to receive payments.
        </Alert>
      )}

      {/* Crypto Wallet Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccountBalanceWalletIcon color="primary" />
            <Typography variant="h6">Crypto Payments</Typography>
          </Box>
          
          {store.cryptoWalletAddress ? (
            <Box>
              <Chip 
                label={`${store.cryptoWalletAddress.slice(0, 10)}...${store.cryptoWalletAddress.slice(-8)}`}
                color="success"
                variant="outlined"
              />
              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                Customers can pay you in crypto to this address
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="0x..."
                value={cryptoWallet}
                onChange={e => setCryptoWallet(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="outlined" onClick={handleUpdateCryptoWallet}>
                Save Wallet
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1, textAlign: 'center', p: 2 }}>
          <Typography color="text.secondary">Total Products</Typography>
          <Typography variant="h4">{products.length}</Typography>
        </Card>
        <Card sx={{ flex: 1, textAlign: 'center', p: 2 }}>
          <Typography color="text.secondary">Total Sales</Typography>
          <Typography variant="h4">$0.00</Typography>
        </Card>
      </Box>

      {/* Products List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Your Products</Typography>
          <Divider sx={{ mb: 2 }} />
          
          {products.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">No products yet</Typography>
              <Button 
                variant="text" 
                onClick={() => navigate('/dashboard/add-product')}
                sx={{ mt: 1 }}
              >
                Add your first product
              </Button>
            </Box>
          ) : (
            <List>
              {products.map(p => (
                <ListItem 
                  key={p.id} 
                  sx={{ 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  secondaryAction={
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/edit/${p.id}`)}
                    >
                      Edit
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={p.imageUrls?.[0] ? `${API_BASE}${p.imageUrls[0]}` : undefined}
                      alt={p.name}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={p.name}
                    secondary={`$${p.price.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
