import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShoppingBag, 
  ExternalLink,
  Wallet,
  LayoutDashboard
} from 'lucide-react';
import { useWallet } from './context/WalletContext';
import { apiClient, Order } from './api/client';
import { Loading } from './components/common/Loading';
import { cn } from './lib/utils';

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md space-y-6 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm"
        >
          <User className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold">Connect Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to view your profile and order history.</p>
          <button 
            onClick={connect}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8"
      >
        {/* Left Sidebar - Profile Info */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card/50 border border-border backdrop-blur-sm">
            <div className="text-center mb-6 relative">
               <div className="w-32 h-32 mx-auto relative group">
                 <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                   <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                      {name ? (
                        <span className="text-4xl font-bold">{name.charAt(0).toUpperCase()}</span>
                      ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                      )}
                   </div>
                 </div>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Camera className="w-4 h-4" />
                 </button>
                 <input ref={fileInputRef} type="file" hidden accept="image/*" />
               </div>
               
               <h2 className="text-2xl font-bold mt-4">{name || 'Anonymous User'}</h2>
               <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground p-2 rounded-full bg-background/50 border border-border inline-flex">
                 <Wallet className="w-3 h-3" />
                 {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
               </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                   <Mail className="w-4 h-4 text-primary" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Address
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all resize-none"
                  placeholder="Delivery address..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="p-4 rounded-3xl bg-card/50 border border-border backdrop-blur-sm space-y-2">
            <h3 className="font-semibold px-2 mb-2">Quick Navigation</h3>
            <RouterLink 
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-500/10 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span>Seller Dashboard</span>
            </RouterLink>
            <RouterLink 
              to="/"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-500/10 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Browse Marketplace</span>
            </RouterLink>
          </div>
        </div>

        {/* Right Content - Orders */}
        <div className="md:col-span-8">
          <div className="p-6 rounded-3xl bg-card border border-border min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Order History
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't made any purchases yet.</p>
                <RouterLink
                  to="/"
                  className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-opacity inline-block"
                >
                  Start Shopping
                </RouterLink>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-background/50 border border-border hover:border-primary/50 transition-colors flex flex-col md:flex-row items-center gap-4"
                  >
                     <div className="flex-grow text-center md:text-left">
                       <h4 className="font-semibold text-lg">{order.product?.name || 'Unknown Product'}</h4>
                       <p className="text-sm text-muted-foreground">Order ID: #{String(order.id)}</p>
                     </div>
                     
                     <div className="flex items-center gap-4">
                       <div className={cn(
                         "px-3 py-1 rounded-full text-xs font-bold",
                         order.paymentMethod === 'CRYPTO' 
                           ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                           : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                       )}>
                         {order.paymentMethod}
                       </div>
                       
                       <p className="font-bold text-lg min-w-[80px] text-right">
                         ${order.product?.price.toFixed(2)}
                       </p>

                       {order.transactionHash && (
                         <a 
                           href={`https://sepolia.etherscan.io/tx/${order.transactionHash}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                           title="View on Etherscan"
                         >
                           <ExternalLink className="w-4 h-4" />
                         </a>
                       )}
                     </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
