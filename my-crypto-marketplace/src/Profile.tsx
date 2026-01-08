import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWallet } from './context/WalletContext';
import { apiClient, Order } from './api/client';

// MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

export default function Profile() {
  const { account, isConnected, connect } = useWallet();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    
    try {
      const userOrders = await apiClient.getOrders(account);
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Connect your wallet to view your profile
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
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 4 }}>
          <Grid>
            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
              <Avatar
                sx={{ width: '100%', height: '100%', fontSize: '3rem' }}
              >
                {name ? name.charAt(0).toUpperCase() : account?.charAt(2).toUpperCase()}
              </Avatar>
              <IconButton
                color="primary"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(2px)',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCamera />
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
              />
            </Box>
          </Grid>
          <Grid>
            <Typography variant="h4" component="h1">
              {name || 'My Profile'}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ wordBreak: 'break-all' }}
            >
              {account}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Personal Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Personal Info
            </Typography>
            <Box component="form" onSubmit={handleProfileUpdate} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Delivery Address"
                multiline
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Save Changes
              </Button>
            </Box>
          </Grid>

          {/* Order History */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Order History
            </Typography>
            {orders.length === 0 ? (
              <Typography color="text.secondary">
                You haven't made any purchases yet.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Transaction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {order.product?.name || 'Unknown Product'}
                        </TableCell>
                        <TableCell>
                          ${order.product?.price.toFixed(2) || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.paymentMethod}
                            size="small"
                            color={order.paymentMethod === 'CRYPTO' ? 'success' : 'primary'}
                          />
                        </TableCell>
                        <TableCell>
                          {order.transactionHash ? (
                            <Link
                              href={`https://sepolia.etherscan.io/tx/${order.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`${order.transactionHash.substring(0, 8)}...`}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Quick Links */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/dashboard"
                >
                  Seller Dashboard
                </Button>
                <Button variant="outlined" component={RouterLink} to="/">
                  Browse Products
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
