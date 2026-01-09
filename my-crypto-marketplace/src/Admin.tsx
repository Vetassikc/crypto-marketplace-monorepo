import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWallet } from './context/WalletContext';
import { apiClient, Category } from './api/client';
import Marketplace_ABI from './contracts/Marketplace.json';

// MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

interface PendingSeller {
  id: number;
  walletAddress: string;
  sellerStatus: string;
}

export default function Admin() {
  const { account, signer } = useWallet();
  
  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);

  // Admin state
  const [manualSellerAddress, setManualSellerAddress] = useState('');
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sellers, cats] = await Promise.all([
        apiClient.getPendingSellers(),
        apiClient.getCategories(),
      ]);
      
      setPendingSellers(sellers);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is contract owner or admin via ENV
  useEffect(() => {
    const checkOwnership = async () => {
      if (!account || !signer) return;
      
      const adminWallet = process.env.REACT_APP_ADMIN_WALLET?.toLowerCase();
      const currentAccount = account.toLowerCase();
      
      let isContractOwner = false;
      let isApprovedSeller = false;

      // Check ENV Admin
      if (adminWallet && adminWallet === currentAccount) {
        setIsOwner(true);
        // Admin is implicitly a seller too for testing
        setIsSeller(true);
        return;
      }

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Marketplace_ABI.abi, signer);
        
        try {
          const owner = await contract.owner();
          isContractOwner = owner.toLowerCase() === currentAccount;
        } catch (e) {
          console.warn('Failed to fetch contract owner', e);
        }

        try {
          // Also check DB status via API if contract check fails or returns false
           // TODO: Add proper endpoint for checking own status, for now relying on contract
          const sellerStatus = await contract.registeredSellers(account);
          isApprovedSeller = sellerStatus;
        } catch (e) {
           console.warn('Failed to fetch seller status from contract', e);
        }
        
        setIsOwner(isContractOwner);
        setIsSeller(isApprovedSeller);
      } catch (error) {
        console.error('Failed to check ownership:', error);
      }
    };

    checkOwnership();
  }, [account, signer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegisterSeller = async (address: string) => {
    if (!signer) return toast.error('Please connect your wallet');
    
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Marketplace_ABI.abi, signer);
      const tx = await contract.registerSeller(address);
      toast.info('Registering seller on blockchain...');
      await tx.wait();
      
      // Also approve in backend
      await apiClient.approveSeller(address);
      toast.success('Seller registered successfully!');
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to register seller');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) return toast.error('Please connect your wallet');
    if (!images || images.length === 0) return toast.error('Please select an image');
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('ownerAddress', account);
    formData.append('image', images[0]);
    
    try {
      await apiClient.createProduct(formData);
      toast.success('Product added successfully!');
      
      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImages(null);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to add product');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {!account && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please connect your wallet to access admin features
        </Alert>
      )}

      {/* Contract Owner Section */}
      {isOwner && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🔐 Contract Owner Controls
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Manual Seller Registration */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="0x..."
              label="Wallet Address"
              value={manualSellerAddress}
              onChange={e => setManualSellerAddress(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => handleRegisterSeller(manualSellerAddress)}
            >
              Register Seller
            </Button>
          </Box>

          {/* Pending Sellers Table */}
          <Typography variant="subtitle1" gutterBottom>
            Pending Seller Applications
          </Typography>
          
          {pendingSellers.length === 0 ? (
            <Typography color="text.secondary">No pending applications</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Wallet Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingSellers.map(seller => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        {seller.walletAddress.slice(0, 10)}...{seller.walletAddress.slice(-8)}
                      </TableCell>
                      <TableCell>{seller.sellerStatus}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleRegisterSeller(seller.walletAddress)}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Seller Section - Add Product */}
      {(isOwner || isSeller) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            📦 Add New Product
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box component="form" onSubmit={handleAddProduct}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Product Name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
              
              <TextField
                label="Price (USD)"
                type="number"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
              />
              
              <FormControl>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategoryId}
                  label="Category"
                  onChange={e => setSelectedCategoryId(e.target.value as number)}
                >
                  {categories.map(cat => [
                    <ListSubheader key={`header-${cat.id}`}>{cat.name}</ListSubheader>,
                    ...(cat.children || []).map(child => (
                      <MenuItem key={child.id} value={child.id}>
                        {child.name}
                      </MenuItem>
                    ))
                  ])}
                </Select>
              </FormControl>
              
              <TextField
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              
              <Button variant="outlined" component="label">
                {images ? `Selected: ${images[0].name}` : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={e => setImages(e.target.files)}
                />
              </Button>
              
              <Button type="submit" variant="contained" size="large">
                Add Product
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {!isOwner && !isSeller && account && (
        <Alert severity="info">
          You don't have admin or seller permissions. Contact the platform owner to become a seller.
        </Alert>
      )}
    </Box>
  );
}
