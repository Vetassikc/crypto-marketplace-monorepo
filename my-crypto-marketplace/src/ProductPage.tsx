import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useWallet } from './context/WalletContext';
import { apiClient, Product } from './api/client';

// MUI Imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import Marketplace_ABI from './contracts/Marketplace.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, signer, isConnected } = useWallet();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiClient.getProduct(parseInt(id));
        setProduct(data);
        
        // Set first image as main
        if (data.imageUrls && data.imageUrls.length > 0) {
          setSelectedImage(`${API_BASE}${data.imageUrls[0]}`);
        }
      } catch (error) {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleBuyCrypto = async () => {
    if (!signer || !product || !account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setBuying(true);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Marketplace_ABI.abi, signer);
      const priceInWei = ethers.parseEther(String(product.price));
      
      toast.info('Confirm the transaction in MetaMask...');
      const tx = await contract.buyProduct(product.id, { value: priceInWei });
      
      toast.info('Waiting for confirmation...');
      await tx.wait();
      
      // Save order
      await apiClient.createOrder(account, product.id, tx.hash, 'CRYPTO');
      
      toast.success('Purchase successful! 🎉');
      navigate('/profile');
    } catch (error: unknown) {
      const err = error as { reason?: string; message?: string };
      toast.error(err.reason || err.message || 'Transaction failed');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, overflow: 'hidden' }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Main Image */}
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: 2,
                mb: 2,
                backgroundColor: 'background.default',
              }}
              alt={product.name}
              src={selectedImage || 'https://via.placeholder.com/500'}
            />
            
            {/* Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={`${API_BASE}${url}`}
                    onClick={() => setSelectedImage(`${API_BASE}${url}`)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      cursor: 'pointer',
                      borderRadius: 1,
                      border: selectedImage === `${API_BASE}${url}` ? '2px solid' : '2px solid transparent',
                      borderColor: 'primary.main',
                      transition: 'border-color 0.2s',
                      '&:hover': {
                        opacity: 0.9,
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                ${product.price.toFixed(2)}
              </Typography>
              {product.store?.cryptoWalletAddress && (
                <Chip label="Crypto Available" color="success" size="small" />
              )}
              {product.store?.stripeOnboardingComplete && (
                <Chip label="Card Available" color="primary" size="small" />
              )}
            </Box>
            
            {product.store?.name && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Sold by: {product.store.name}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {product.description || 'No description available.'}
            </Typography>
            
            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Specifications:
                </Typography>
                <List dense sx={{ p: 0 }}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <ListItem key={key} disableGutters sx={{ p: 0 }}>
                      <ListItemText
                        primary={key}
                        secondary={String(value)}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                disabled={!isConnected || buying}
                onClick={handleBuyCrypto}
              >
                {buying ? <CircularProgress size={20} /> : 'Buy with Crypto'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to={`/checkout/${product.id}`}
              >
                Pay with Card
              </Button>
            </Box>
            
            {!isConnected && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Connect your wallet in the top menu to enable crypto payments
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
