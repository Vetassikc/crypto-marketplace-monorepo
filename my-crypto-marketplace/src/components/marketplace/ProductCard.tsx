import { resolveIPFS } from '../../utils/ipfs';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../../api/client';
import { formatPrice } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onBuy: (id: number) => void;
  onView: (id: number) => void;
}

export function ProductCard({ product, onBuy, onView }: ProductCardProps) {
  const imageUrl = resolveIPFS(product.imageUrls?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={() => onView(product.id)}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(product.id);
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuy(product.id);
            }}
            className="p-3 rounded-full bg-primary hover:bg-primary/90 transition-colors text-primary-foreground shadow-lg shadow-primary/20"
            title="Buy Now"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Categories/Tags */}
        {product.store?.cryptoWalletAddress && (
          <div className="absolute top-3 right-3">
             <span className="px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase backdrop-blur-md">
               Crypto
             </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 
            className="font-semibold text-lg text-foreground truncate cursor-pointer hover:text-primary transition-colors"
            onClick={() => onView(product.id)}
          >
            {product.name}
          </h3>
          {product.store?.name && (
            <p className="text-sm text-muted-foreground truncate">
              by <span className="text-foreground/80">{product.store.name}</span>
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="font-bold text-xl text-primary">{formatPrice(product.price)}</span>
          </div>
          
          <button
            onClick={() => onBuy(product.id)}
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
