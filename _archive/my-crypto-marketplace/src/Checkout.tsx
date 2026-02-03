import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useWallet } from './context/WalletContext';
import { apiClient, Product, ShippingDetails } from './api/client';

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
import TextField from '@mui/material/TextField';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Contract ABI
import Marketplace_ABI from './contracts/Marketplace.json';

// Stripe init
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

// Contract address
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// ═══════════════════════════════════════════════════════════════════════════════
// Shipping Form Component
// ═══════════════════════════════════════════════════════════════════════════════
interface ShippingFormProps {
  initialValues: ShippingDetails;
  onSubmit: (details: ShippingDetails) => void;
}

function ShippingForm({ initialValues, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingDetails>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.country || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (

    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full Name"
            fullWidth
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <TextField
            required
            id="addressLine1"
            name="addressLine1"
            label="Address Line 1"
            fullWidth
            autoComplete="shipping address-line1"
            value={formData.addressLine1}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <TextField
            id="addressLine2"
            name="addressLine2"
            label="Address Line 2"
            fullWidth
            autoComplete="shipping address-line2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            value={formData.city}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
          <TextField
            required
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={formData.state}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            required
            id="postalCode"
            name="postalCode"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            value={formData.postalCode}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            value={formData.country}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
        </Box>

        <Box>
          <TextField
            required
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            autoComplete="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            helperText="Used for delivery coordination"
          />
        </Box>
        
        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Next: Payment
          </Button>
        </Box>
      </Box>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Stripe Checkout Form Component
// ═══════════════════════════════════════════════════════════════════════════════
interface StripeCheckoutFormProps {
  onBack: () => void;
  shippingDetails: ShippingDetails;
}

function StripeCheckoutForm({ onBack, shippingDetails }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // TODO: Ideally, we would save the order + shipping details to backend here BEFORE confirming stripe payment
    // However, for this MVP we'll confirm payment first then rely on webhook or client success (less secure but faster for now)
    // Or, pass shipping details in metadata

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/`,
        payment_method_data: {
          billing_details: {
            name: shippingDetails.fullName,
            address: {
              line1: shippingDetails.addressLine1,
              line2: shippingDetails.addressLine2,
              city: shippingDetails.city,
              state: shippingDetails.state,
              postal_code: shippingDetails.postalCode,
              country: 'US', // Simplify for MVP or map correctly
            }
          }
        }
      },
    });

    if (error) {
      toast.error(error.message);
    }
    
    // Success redirects, so no need to stop processing state usually
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onBack} fullWidth>
          Back
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing ? 'Processing...' : 'Pay with Card'}
        </Button>
      </Box>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Crypto Checkout Form Component
// ═══════════════════════════════════════════════════════════════════════════════
interface CryptoCheckoutFormProps {
  product: Product | null;
  shippingDetails: ShippingDetails;
  onSuccess?: (txHash: string) => void;
  onBack: () => void;
}

function CryptoCheckoutForm({ product, onSuccess, onBack, shippingDetails }: CryptoCheckoutFormProps) {
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
      
      const priceInWei = ethers.parseEther(String(product.price));
      
      toast.info('Confirm the transaction in MetaMask...');
      
      const tx = await contract.buyProduct(product.id, { value: priceInWei });
      
      toast.info('Waiting for transaction confirmation...');
      await tx.wait();
      
      // Save order to database WITH Shipping Details
      await apiClient.createOrder(account, product.id, tx.hash, 'CRYPTO', shippingDetails);

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
            Connect MetaMask to pay with cryptocurrency (ETH on Sepolia/Tempo)
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={onBack} fullWidth>
                Back
            </Button>
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
          </Box>
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
  
  // New States for Shipping
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });

  const steps = ['Shipping Address', 'Payment'];

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

  // Create Payment Intent for Stripe (only if card is selected AND we are at payment step)
  useEffect(() => {
    if (activeStep !== 1 || paymentMethod !== 'card' || !productId) {
      if(activeStep === 0) setLoading(false);
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
  }, [productId, paymentMethod, activeStep]);

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
      navigate('/profile'); // Redirect to profile to see order
    }, 2000);
  };

  const handleShippingSubmit = (details: ShippingDetails) => {
    setShippingDetails(details);
    setActiveStep(1); // Move to payment
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
        theme: 'stripe' as const,
    },
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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

        {activeStep === 0 ? (
          <ShippingForm 
            initialValues={shippingDetails} 
            onSubmit={handleShippingSubmit} 
          />
        ) : (
          <>
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
            {loading && paymentMethod === 'card' ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : paymentMethod === 'card' ? (
              clientSecret ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <StripeCheckoutForm onBack={handleBack} shippingDetails={shippingDetails} />
                </Elements>
              ) : (
                <Alert severity="warning">
                  Seller has not configured card payments yet.
                  <Button onClick={handleBack} sx={{mt: 1}}>Go Back</Button>
                </Alert>
              )
            ) : (
              <CryptoCheckoutForm 
                product={product} 
                onSuccess={handleCryptoSuccess}
                onBack={handleBack}
                shippingDetails={shippingDetails}
              />
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}
