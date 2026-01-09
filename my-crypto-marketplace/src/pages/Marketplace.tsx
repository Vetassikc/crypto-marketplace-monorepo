import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Hero } from '../components/home/Hero';
import { ProductCard } from '../components/marketplace/ProductCard';
import { SidebarFilters } from '../components/marketplace/SidebarFilters';
import { Loading } from '../components/common/Loading';

type SortOption = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc';

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Search Header */}
      {/* Search Header - Monolithic border-b only, no floating containment */ }
      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between py-4 px-6 lg:px-12">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-sm">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
             </div>
             <input 
               type="text"
               placeholder="Search Products..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-3 rounded-full bg-secondary/30 border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
             />
             <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-xs text-muted-foreground border px-1.5 rounded bg-muted/50">⌘ F</span>
             </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
             <div className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg hover:bg-muted transition-colors">
               <span className="text-sm text-muted-foreground">Sort By:</span>
               <span className="font-medium">
                 {sortBy === 'date_desc' && 'Newest'}
                 {sortBy === 'date_asc' && 'Oldest'}
                 {sortBy === 'price_asc' && 'Price: Low to High'}
                 {sortBy === 'price_desc' && 'Price: High to Low'}
               </span>
               <ChevronDown className="w-4 h-4 text-muted-foreground" />
             </div>
             
             {/* Dropdown Menu */}
             <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
               <button onClick={() => setSortBy('date_desc')} className="w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors text-sm">Newest First</button>
               <button onClick={() => setSortBy('date_asc')} className="w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors text-sm">Oldest First</button>
               <button onClick={() => setSortBy('price_asc')} className="w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors text-sm">Price: Low to High</button>
               <button onClick={() => setSortBy('price_desc')} className="w-full text-left px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors text-sm">Price: High to Low</button>
             </div>
          </div>
        </div>
      </div>

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
