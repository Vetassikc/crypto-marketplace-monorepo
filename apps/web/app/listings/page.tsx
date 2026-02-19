'use client'
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useListings, SearchParams, Listing } from '@/hooks/useListings'
import { Button } from '@/components/ui/Button'
import { Search, ArrowUpDown } from 'lucide-react'

// Define categories locally for now (could be shared later)
const CATEGORIES = [
  { id: 'All', label: 'All', icon: '🔍' },
  { id: 'Fashion', label: 'Fashion', icon: '👕' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Home', label: 'Home', icon: '🏠' },
  { id: 'Art', label: 'Art', icon: '🎨' },
  { id: 'Toys', label: 'Toys', icon: '🧸' },
  { id: 'Vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'Other', label: 'Other', icon: '📦' },
]

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // Initialize filters with defaults
  const [filters, setFilters] = useState<SearchParams>({
    category: 'All',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const { data: listings, isLoading } = useListings(filters)
  const router = useRouter()

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsAnalyzing(true)
      try {
        const res = await fetch('/api/smart-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        })
        const smartFilters = await res.json()
        setFilters(prev => ({ ...prev, ...smartFilters }))
      } catch (err) {
        console.error("Smart search failed, falling back to basic search", err)
        setFilters(prev => ({ ...prev, query: searchQuery }))
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    let sortBy = 'createdAt'
    let sortOrder: 'asc' | 'desc' = 'desc'

    if (value === 'price_asc') {
      sortBy = 'price'
      sortOrder = 'asc'
    } else if (value === 'price_desc') {
      sortBy = 'price'
      sortOrder = 'desc'
    } else if (value === 'newest') {
      sortBy = 'createdAt'
      sortOrder = 'desc'
    }

    setFilters(prev => ({ ...prev, sortBy, sortOrder }))
  }

  const handleBuy = async (listingId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          buyerId: 'cmk6y78si0000v4ts6mxw28bq' // Hardcoded for Sprint 3 MVP
        })
      })
      
      if (!res.ok) throw new Error('Failed to create order')
      
      alert('Order placed successfully! Redirecting to orders...')
      router.push('/my-orders')
    } catch (err) {
      alert('Error placing order')
      console.error(err)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-dark-bg text-white p-20 text-center">Loading marketplace...</div>
  // if (error) return <div className="min-h-screen bg-dark-bg text-white p-20 text-center text-red-500">Error loading listings</div>

  return (
    <div className="min-h-screen text-white p-8 pt-24 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-emerald-300 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0">
            Marketplace
          </h1>
          
          <div className="relative w-full max-w-xl group">
            <div className="relative z-10">
              <input
                  type="text"
                  placeholder={isAnalyzing ? "AI is analyzing..." : "Search for items..."}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all backdrop-blur-md shadow-xl pr-12 pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  disabled={isAnalyzing}
              />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
               {isAnalyzing && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/70"></div>
                  </div>
              )}
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/20 to-emerald-500/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
             {/* Category Chips - Scrollable on mobile */}
             <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar mask-gradient">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                      filters.category === cat.id
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
            </div>

            {/* Sorting & Filters Mobile Toggle */}
            <div className="flex gap-2 shrink-0">
               <div className="relative">
                  <select 
                    onChange={handleSortChange}
                    className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-500 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
               </div>
            </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (filters.query || filters.minPrice || filters.maxPrice) && (
        <div className="mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
           <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Active AI Filters:
           </span>
           
           <div className="flex flex-wrap gap-2">
            {filters.query && (
                <span className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-xs text-brand-200">
                    &quot;{filters.query}&quot;
                </span>
            )}
            {filters.minPrice && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-200">
                    Min: ${filters.minPrice}
                </span>
            )}
             <button 
                onClick={() => { setFilters({ category: 'All', sortBy: 'createdAt', sortOrder: 'desc' }); setSearchQuery('') }}
                className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-200 hover:bg-red-500/20 transition-colors"
            >
                Clear All
            </button>
        </div>
      </div>
      )}
      
      {/* Listings Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item: Listing) => (
            <div key={item.id} className="group glass p-0 rounded-3xl border border-white/10 bg-white/5 hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
              <Link href={`/listings/${item.id}`} className="block relative cursor-pointer flex-1">
                  <div className="aspect-[4/3] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-400 transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      
                      {/* Category Badge */}
                      {item.category && (
                        <div className="absolute top-4 left-4 z-20">
                           <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg">
                              {item.category}
                           </span>
                        </div>
                      )}

                      {item.images && item.images.length > 0 ? (
                         // eslint-disable-next-line @next/next/no-img-element
                         <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                         <span className="text-6xl font-black opacity-20">{item.title[0]}</span>
                      )}
                  </div>
                  
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">{item.title}</h3>
                        <span className="text-brand-300 font-mono text-lg font-bold whitespace-nowrap">{item.price} {item.currency}</span>
                      </div>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2 min-h-[2.5em]">{item.description || "Premium quality verified asset."}</p>
                      
                       <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleBuy(item.id);
                        }}
                        className="w-full rounded-xl bg-white/5 hover:bg-brand-600 text-white border border-white/10 hover:border-brand-500 transition-all"
                      >
                        Buy Now
                      </Button>
                  </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 flex flex-col items-center opacity-0 animate-in fade-in slide-in-from-bottom-8 fill-mode-forwards" style={{ animationDelay: '0.2s' }}>
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-white/20" />
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
           <p className="text-white/40 max-w-md mx-auto">
             Try adjusting your search or filters to find what you&apos;re looking for.
           </p>
           <Button 
              onClick={() => { setFilters({ category: 'All', sortBy: 'createdAt', sortOrder: 'desc' }); setSearchQuery('') }}
              className="mt-6 bg-brand-600 text-white rounded-full px-8"
            >
              Clear All Filters
           </Button>
        </div>
      )}
    </div>
  )
}
