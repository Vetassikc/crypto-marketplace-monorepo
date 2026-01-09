import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Wallet, ShieldCheck, Box as BoxIcon } from 'lucide-react';
import { useWallet } from './context/WalletContext';
import { apiClient, Product } from './api/client';
import { cn } from './lib/utils';

// Contract ABI
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm relative group">
            <img
              src={selectedImage || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(`${API_BASE}${url}`)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                    selectedImage === `${API_BASE}${url}` 
                      ? "border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={`${API_BASE}${url}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-2">
              {product.name}
            </h1>
            {product.store?.name && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <BoxIcon className="w-4 h-4" />
                <span>Sold by <strong className="text-foreground">{product.store.name}</strong></span>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border shadow-lg space-y-6">
             <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <span className="mb-1 text-muted-foreground">USD</span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleBuyCrypto}
                  disabled={!isConnected || buying}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-all gap-2 group",
                    (!isConnected || buying) && "opacity-50 cursor-not-allowed"
                  )}
                >
                   {buying ? (
                     <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <>
                        <Wallet className="w-6 h-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-primary">Pay with Crypto</span>
                        <span className="text-xs text-muted-foreground">Instant Settlement</span>
                     </>
                   )}
                </button>

                <RouterLink
                  to={`/checkout/${product.id}`}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-secondary/50 bg-secondary/10 hover:bg-secondary/20 transition-all gap-2 group"
                >
                   <CreditCard className="w-6 h-6 text-secondary-foreground mb-1 group-hover:scale-110 transition-transform" />
                   <span className="font-semibold text-secondary-foreground">Pay with Card</span>
                   <span className="text-xs text-muted-foreground">Secure Stripe Checkout</span>
                </RouterLink>
             </div>

             {!isConnected && (
                <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  Connect wallet to pay with crypto.
                </div>
             )}
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
               <h3 className="text-lg font-semibold mb-3">Specifications</h3>
               <div className="grid grid-cols-2 gap-4">
                 {Object.entries(product.specifications).map(([key, value]) => (
                   <div key={key} className="flex flex-col p-3 rounded-lg bg-secondary/20 border border-border">
                     <span className="text-xs text-muted-foreground uppercase">{key}</span>
                     <span className="font-medium">{String(value)}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
