import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  DollarSign, 
  Tag, 
  AlignLeft, 
  Type, 
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { apiClient } from '../api/client';
import { cn } from '../lib/utils';

export default function AddProduct() {
  const navigate = useNavigate();
  const { account, isConnected, connect } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Digital');
  const [image, setImage] = useState<File | null>(null);

  const categories = [
    { id: 'Digital', name: 'Digital Art', icon: '🎨' },
    { id: 'Clothing', name: 'Clothing', icon: '👕' },
    { id: 'Electronics', name: 'Electronics', icon: '💻' },
    { id: 'Services', name: 'Services', icon: '🛠️' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('ownerAddress', account);
      if (image) formData.append('image', image);

      await apiClient.createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to create product');
    } finally {
      setIsLoading(false);
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
          <ShoppingBag className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl font-bold">Connect Wallet</h2>
          <p className="text-muted-foreground">You need to connect your wallet to add products to the marketplace.</p>
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

  const isStep1Valid = name && price && category;
  const isStep2Valid = description && description.length > 10;
  const isStep3Valid = !!image;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-card border border-border shadow-2xl overflow-hidden relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: '33%' }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground text-sm">Step {currentStep} of 3</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" /> Product Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                      placeholder="e.g. Cyberpunk Neural Interface"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" /> Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Category
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all flex items-center gap-2",
                            category === cat.id 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-input bg-background/50 hover:border-primary/50"
                          )}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium text-sm">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Description */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <AlignLeft className="w-4 h-4 text-primary" /> Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all resize-none"
                      placeholder="Describe your product in detail..."
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {description.length} characters
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Images */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" /> Product Image
                    </label>
                    
                    <div className="relative group">
                      <div className={cn(
                        "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative overflow-hidden h-64 flex flex-col items-center justify-center",
                        imagePreview ? "border-primary/50" : "border-muted-foreground/30 hover:border-primary"
                      )}>
                        {imagePreview ? (
                          <>
                             <img 
                               src={imagePreview} 
                               alt="Preview" 
                               className="absolute inset-0 w-full h-full object-cover rounded-xl" 
                             />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <p className="text-white font-medium">Click to change</p>
                             </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <Upload className="w-8 h-8 text-primary" />
                            </div>
                            <p className="font-medium">Click to upload image</p>
                            <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors",
                  currentStep === 1 
                    ? "opacity-0 pointer-events-none" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {currentStep < 3 ? (
                 <button
                   type="button"
                   onClick={() => setCurrentStep(prev => prev + 1)}
                   disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                   className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Next Step <ArrowRight className="w-5 h-5" />
                 </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStep3Valid || isLoading}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Product'} <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
