import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react'; // Removed Search, ChevronDown
import { useProducts } from '../hooks/useProducts';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/marketplace/ProductCard';
import { SidebarFilters } from '../components/marketplace/SidebarFilters';
import { Loading } from '../components/common/Loading';
import { useMarketplaceContext } from '../context/MarketplaceContext';

export default function Marketplace() {
  const navigate = useNavigate();
  const { debouncedSearch, sortBy, setSearch } = useMarketplaceContext();
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { products, loading, error } = useProducts({
    search: debouncedSearch,
    sortBy,
  });

  const handleBuyClick = (productId: number) => {
    navigate(`/checkout/${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Filter products locally for categories & price (since standard API doesn't support it yet)
  const filteredProducts = products.filter(product => {
    // Temporary: Match against hardcoded IDs or assume All. 
    // Ideally we'd fetch categories and match by ID.
    const matchesCategory = selectedCategory === 'All'; 
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen text-foreground">
      {/* Search Header moved to Navbar */}

      <Hero />
      
      <div className="w-full px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
             <SidebarFilters 
               categories={['All', 'Digital', 'Art', 'Clothing', 'Music', 'Services']}
               selectedCategory={selectedCategory}
               onCategoryChange={setSelectedCategory}
               priceRange={priceRange}
               onPriceChange={setPriceRange}
             />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="mb-6 flex items-center justify-between">
               <h2 className="text-2xl font-bold flex items-center gap-2">
                 Products 
                 <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                   {filteredProducts.length}
                 </span>
               </h2>
             </div>

             {loading ? (
               <Loading />
             ) : error ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                  <h3 className="text-lg font-bold mb-2">Error Loading Products</h3>
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                </div>
             ) : filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProducts.map((product) => (
                   <ProductCard 
                     key={product.id} 
                     product={product} 
                     onBuy={handleBuyClick} 
                     onView={handleViewProduct} 
                   />
                 ))}
               </div>
             ) : (
               <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-70">
                 <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                   <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">No Products Found</h3>
                 <p className="max-w-sm text-muted-foreground">
                    We couldn't find any products matching your filters. Try adjusting your search or category.
                 </p>
                 <button 
                   onClick={() => {
                     setSelectedCategory('All');
                     setPriceRange([0, 1000]);
                     setSearch('');
                   }}
                   className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                 >
                   Clear Filters
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
