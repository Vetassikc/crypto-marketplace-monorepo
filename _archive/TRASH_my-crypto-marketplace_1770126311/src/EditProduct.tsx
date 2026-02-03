import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Type,
  DollarSign,
  AlignLeft,
  Tag
} from 'lucide-react';
import { useWallet } from './context/WalletContext';
import { apiClient, Category } from './api/client';
import { Loading } from './components/common/Loading';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, isConnected, connect } = useWallet();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [product, cats] = await Promise.all([
        apiClient.getProduct(parseInt(id)),
        apiClient.getCategories(),
      ]);

      setName(product.name);
      setPrice(String(product.price));
      setSelectedCategoryId(product.categoryId || '');
      setDescription(product.description || '');
      setExistingImages(product.imageUrls || []);
      setCategories(cats);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !id) {
      toast.error('Please connect your wallet');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('ownerAddress', account);
      if (selectedCategoryId) formData.append('categoryId', String(selectedCategoryId));

      existingImages.forEach(url => formData.append('existingImageUrls', url));
      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append('image', newImages[i]);
        }
      }

      await apiClient.updateProduct(parseInt(id), formData);
      toast.success('Product updated successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!account || !id) return;
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      await apiClient.deleteProduct(parseInt(id), account);
      toast.success('Product deleted successfully!');
      navigate('/dashboard');
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to delete product');
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
          <h2 className="text-3xl font-bold">Connect Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to edit products.</p>
          <button onClick={connect} className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) return <Loading message="Loading product details..." />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-card border border-border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-background transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Edit Product</h1>
          </div>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-8">
          {/* Detailed Info Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                   <Type className="w-4 h-4 text-primary" /> Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                   <DollarSign className="w-4 h-4 text-primary" /> Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                 <Tag className="w-4 h-4 text-primary" /> Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all appearance-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.children?.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                 <AlignLeft className="w-4 h-4 text-primary" /> Description
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-input focus:border-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="h-px bg-border my-8" />

          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Product Images
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                  <img src={`${API_BASE}${url}`} alt={`Product ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="relative aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center px-2">Click to add more images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setNewImages(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {newImages && newImages.length > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary">
                {newImages.length} new image(s) selected to upload
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
             <button
               type="button"
               onClick={() => navigate('/dashboard')}
               className="px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={saving}
               className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
             >
               <Save className="w-5 h-5" />
               {saving ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
