import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Wallet, 
  CreditCard, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Edit,
  ExternalLink
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useStore } from '../hooks/useStore';
import { apiClient, Product } from '../api/client';
import { Loading } from '../components/common/Loading';
import { cn } from '../lib/utils';

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
  const [isEditingWallet, setIsEditingWallet] = useState(false);

  // Fetch products
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
      alert((err as Error).message || 'Failed to connect to Stripe');
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);
    try {
      await createStore(storeName, storeDescription);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create store');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCryptoWallet = async () => {
    if (!cryptoWallet) return;
    try {
      await updateCryptoWallet(cryptoWallet);
      setIsEditingWallet(false);
      setCryptoWallet('');
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to update crypto wallet');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-6 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <Wallet className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold">Connect Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to access the seller dashboard and manage your store.</p>
          <button 
            onClick={connect}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Connect Metamask
          </button>
        </motion.div>
      </div>
    );
  }

  if (storeLoading) return <Loading message="Loading dashboard..." />;

  // Create Store Form
  if (!store) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-8 rounded-3xl bg-card border border-border shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Store</h1>
            <p className="text-muted-foreground">Start selling real-world assets with crypto payments today.</p>
          </div>

          <form onSubmit={handleCreateStore} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="e.g. Future Tech Store"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Description</label>
              <textarea
                required
                rows={3}
                value={storeDescription}
                onChange={e => setStoreDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                placeholder="Tell us about what you sell..."
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Launch Store 🚀'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            {store.name}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">{store.description}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-product')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Products */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden group"
        >
          <Package className="w-8 h-8 text-primary mb-4 opacity-80" />
          <h3 className="text-muted-foreground font-medium">Total Products</h3>
          <p className="text-4xl font-bold mt-2 group-hover:text-primary transition-colors">{products.length}</p>
        </motion.div>

        {/* Total Sales */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card/60 border border-border backdrop-blur-sm relative overflow-hidden group"
        >
          <DollarSign className="w-8 h-8 text-green-500 mb-4 opacity-80" />
          <h3 className="text-muted-foreground font-medium">Total Sales</h3>
          <p className="text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            $0.00
          </p>
        </motion.div>

        {/* Integration Status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-card/60 border border-border backdrop-blur-sm flex flex-col justify-between"
        >
             <div className="space-y-4">
               {/* Stripe Status */}
               <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                 <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-full", store.stripeOnboardingComplete ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500")}>
                     <CreditCard className="w-4 h-4" />
                   </div>
                   <span className="font-medium">Stripe</span>
                 </div>
                 {store.stripeOnboardingComplete ? (
                    <span className="text-xs font-bold text-green-500 px-2 py-1 bg-green-500/10 rounded-full">ACTIVE</span>
                 ) : (
                    <button onClick={handleConnectStripe} className="text-xs font-bold text-primary hover:underline">
                      CONNECT
                    </button>
                 )}
               </div>

               {/* Crypto Status */}
               <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-full", store.cryptoWalletAddress ? "bg-purple-500/20 text-purple-500" : "bg-zinc-500/20 text-zinc-500")}>
                     <Wallet className="w-4 h-4" />
                   </div>
                   <span className="font-medium">Crypto</span>
                  </div>
                   {store.cryptoWalletAddress ? (
                     <button onClick={() => setIsEditingWallet(!isEditingWallet)} className="text-xs text-muted-foreground hover:text-foreground">
                        {store.cryptoWalletAddress.slice(0, 6)}...{store.cryptoWalletAddress.slice(-4)}
                     </button>
                   ) : (
                     <button onClick={() => setIsEditingWallet(true)} className="text-xs font-bold text-primary hover:underline">
                       SETUP
                     </button>
                   )}
               </div>
             </div>
        </motion.div>
      </div>

      {/* Wallet Edit Modal/Section */}
      <AnimatePresence>
        {isEditingWallet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
             <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                <h3 className="text-lg font-semibold mb-4">Update Crypto Wallet</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={cryptoWallet}
                    onChange={e => setCryptoWallet(e.target.value)}
                    placeholder="Enter ETH address (0x...)"
                    className="flex-grow px-4 py-2 rounded-xl bg-background border border-input focus:border-primary outline-none"
                  />
                  <button onClick={handleUpdateCryptoWallet} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">
                    Save
                  </button>
                  <button onClick={() => setIsEditingWallet(false)} className="px-6 py-2 rounded-xl border border-input hover:bg-accent hover:text-accent-foreground">
                    Cancel
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Inventory
          </h2>
        </div>
        
        {products.length === 0 ? (
           <div className="p-12 text-center">
             <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package className="w-8 h-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-1">No products yet</h3>
             <p className="text-muted-foreground mb-6">Start adding products to populate your marketplace store.</p>
             <button
               onClick={() => navigate('/dashboard/add-product')}
               className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity"
             >
               Add First Product
             </button>
           </div>
        ) : (
          <div className="divide-y divide-border/50">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 flex flex-col md:flex-row items-center gap-4 hover:bg-card/60 transition-colors group"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-background border border-border overflow-hidden shrink-0">
                  <img 
                    src={product.imageUrls?.[0] ? `${API_BASE}${product.imageUrls[0]}` : 'https://via.placeholder.com/100'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-md">{product.description}</p>
                </div>

                {/* Price */}
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                   <button 
                     onClick={() => navigate(`/product/${product.id}`)}
                     className="p-2 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors"
                     title="View"
                   >
                     <ExternalLink className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => navigate(`/edit/${product.id}`)}
                     className="p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                     title="Edit"
                   >
                     <Edit className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
