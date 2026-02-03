import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

export function SidebarFilters({
  categories = ['All', 'Digital Art', 'Clothing', 'Electronics', 'Services'],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: SidebarFiltersProps) {
  return (
    <div className="space-y-8 pr-6 border-r border-border h-[calc(100vh-140px)] sticky top-32 overflow-y-auto">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Category
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() => onCategoryChange(cat)}
                  className="peer sr-only"
                />
                <div className={cn(
                  "w-5 h-5 rounded-md border border-muted-foreground/30 transition-all",
                  "peer-checked:bg-primary peer-checked:border-primary",
                  "group-hover:border-primary/50"
                )}>
                  <Check className="w-3.5 h-3.5 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className={cn(
                "text-sm transition-colors",
                selectedCategory === cat ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Price Range
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Min</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                className="w-full pl-6 pr-3 py-2 rounded-lg bg-background/50 border border-input focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Max</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                className="w-full pl-6 pr-3 py-2 rounded-lg bg-background/50 border border-input focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Visual Slider Mockup (Optional - functionality handled by inputs for now to keep it lightweight) */}
        <div className="relative h-1 bg-secondary rounded-full mt-4">
          <div className="absolute left-0 right-1/2 h-full bg-primary rounded-full opacity-50" />
          <div className="absolute left-0 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg -translate-y-1/3 cursor-pointer" />
          <div className="absolute left-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg -translate-y-1/3 cursor-pointer" />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          Rating
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" />
                 <div className={cn(
                  "w-5 h-5 rounded-md border border-muted-foreground/30 transition-all",
                  "peer-checked:bg-primary peer-checked:border-primary",
                  "group-hover:border-primary/50"
                )}>
                  <Check className="w-3.5 h-3.5 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4",
                      i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                    )} 
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
