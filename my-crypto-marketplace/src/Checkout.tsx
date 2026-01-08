import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useWallet } from './context/WalletContext';
import { apiClient, Product } from './api/client';

// MUI Imports
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

// Contract ABI
import Marketplace_ABI from './contracts/Marketplace.json';

// Stripe init
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

// Contract address
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const SEPOLIA_CHAIN_ID = '0xaa36a7';

// ═══════════════════════════════════════════════════════════════════════════════
// Stripe Checkout Form Component
// ═══════════════════════════════════════════════════════════════════════════════
function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? 'Processing...' : 'Pay with Card'}
      </Button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Crypto Checkout Form Component
// ═══════════════════════════════════════════════════════════════════════════════
interface CryptoCheckoutFormProps {
  product: Product | null;
  onSuccess?: (txHash: string) => void;
}

function CryptoCheckoutForm({ product, onSuccess }: CryptoCheckoutFormProps) {
  const { account, isConnected, connect, signer } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCryptoPurchase = async () => {
    if (!signer || !product || !account) {
      toast.error('Wallet not connected');
      return;
    }

    setIsProcessing(true);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Marketplace_ABI.abi, signer);
      
      // Convert price to Wei (assuming price is in ETH)
      const priceInWei = ethers.parseEther(String(product.price));
      
      toast.info('Confirm the transaction in MetaMask...');
      
      const tx = await contract.buyProduct(product.id, { value: priceInWei });
      
      toast.info('Waiting for transaction confirmation...');
      await tx.wait();
      
      // Save order to database
      await apiClient.createOrder(account, product.id, tx.hash, 'CRYPTO');

      toast.success('Purchase successful! 🎉');
      onSuccess?.(tx.hash);
      
    } catch (error: unknown) {
      const err = error as { reason?: string; message?: string };
      console.error('Crypto purchase error:', error);
      toast.error(err.reason || err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      {!isConnected ? (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            Connect MetaMask to pay with cryptocurrency (ETH on Sepolia)
          </Alert>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={connect}
            sx={{ py: 1.5 }}
          >
            Connect MetaMask
          </Button>
        </>
      ) : (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>
            Wallet connected: {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You will pay: <strong>{product?.price} ETH</strong> (+ gas fee)
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={handleCryptoPurchase}
            disabled={isProcessing}
            sx={{ py: 1.5 }}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Pay with Crypto'}
          </Button>
        </>
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Checkout Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function Checkout() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const prod = await apiClient.getProduct(parseInt(productId));
        setProduct(prod);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
      }
    };
    fetchProduct();
  }, [productId]);

  // Create Payment Intent for Stripe (only if card is selected)
  useEffect(() => {
    if (paymentMethod !== 'card' || !productId) {
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      setLoading(true);
      try {
        const { clientSecret } = await apiClient.createPaymentIntent(parseInt(productId));
        setClientSecret(clientSecret);
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(`Payment preparation failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [productId, paymentMethod]);

  const handlePaymentMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: 'card' | 'crypto' | null
  ) => {
    if (newMethod !== null) {
      setPaymentMethod(newMethod);
    }
  };

  const handleCryptoSuccess = () => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const stripeOptions = {
    clientSecret,
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        {product && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" color="primary">
              {product.name}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              ${product.price}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Payment Method Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            color="primary"
            value={paymentMethod}
            exclusive
            onChange={handlePaymentMethodChange}
            aria-label="payment method"
          >
            <ToggleButton value="card" sx={{ px: 4 }}>
              <CreditCardIcon sx={{ mr: 1 }} />
              Card
            </ToggleButton>
            <ToggleButton value="crypto" sx={{ px: 4 }}>
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              Crypto
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Payment Form */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : paymentMethod === 'card' ? (
          clientSecret ? (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripeCheckoutForm />
            </Elements>
          ) : (
            <Alert severity="warning">
              Seller has not configured card payments yet
            </Alert>
          )
        ) : (
          <CryptoCheckoutForm 
            product={product} 
            onSuccess={handleCryptoSuccess}
          />
        )}
      </Paper>
    </Container>
  );
}
