'use client'
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useListings } from '@/hooks/useListings'
import { Button } from '@/components/ui/Button'

interface Listing {
  id: string
  title: string
  price: string
  currency: string
  images?: string[]
  description?: string
}

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const { data: listings, isLoading, error } = useListings(filters)
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
        setFilters(smartFilters)
      } catch (err) {
        console.error("Smart search failed, falling back to basic search", err)
        setFilters({ query: searchQuery })
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleBuy = async (listingId: string) => {
    try {
      const res = await fetch('http://localhost:3333/orders', {
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
  if (error) return <div className="min-h-screen bg-dark-bg text-white p-20 text-center text-red-500">Error loading listings</div>

  return (
    <div className="min-h-screen text-white p-8 pt-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-emerald-300 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0">
          Latest Drops
        </h1>
        
        <div className="relative w-full max-w-xl">
          <div className="relative">
            <input
                type="text"
                placeholder={isAnalyzing ? "AI is analyzing..." : "Ask: 'cheap gaming laptop under $500'..."}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all backdrop-blur-md shadow-xl pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                disabled={isAnalyzing}
            />
             {isAnalyzing && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/70"></div>
                </div>
            )}
          </div>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500/20 to-emerald-500/20 blur-xl -z-10 opacity-0 focus-within:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
           <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Active AI Filters
           </div>
           
           <div className="flex flex-wrap gap-2">
            {(filters as any).query && (
                <span className="px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-sm text-brand-200">
                    Search: "{(filters as any).query}"
                </span>
            )}
            {(filters as any).minPrice && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-sm text-emerald-200">
                    Min Price: ${(filters as any).minPrice}
                </span>
            )}
            {(filters as any).maxPrice && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-sm text-emerald-200">
                    Max Price: ${(filters as any).maxPrice}
                </span>
            )}
            {(filters as any).sortBy && (
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-sm text-purple-200">
                    Sort: {(filters as any).sortBy} ({(filters as any).sortOrder})
                </span>
            )}
             <button 
                onClick={() => { setFilters({}); setSearchQuery('') }}
                className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-sm text-red-200 hover:bg-red-500/30 transition-colors"
            >
                Clear All
            </button>
        </div>
      </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {listings?.map((item: Listing) => (
          <div key={item.id} className="group glass p-0 rounded-3xl border border-white/10 bg-white/5 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
            <Link href={`/listings/${item.id}`} className="block relative cursor-pointer">
                <div className="h-64 bg-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-400 transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.images && item.images.length > 0 ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                       <span className="text-6xl font-black">{item.title[0]}</span>
                    )}
                </div>
            </Link>
            
            <div className="p-6">
                <Link href={`/listings/${item.id}`} className="block">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-brand-300 transition-colors">{item.title}</h3>
                </Link>
                <p className="text-white/60 text-sm mb-6 line-clamp-2">{item.description || "Premium quality verified asset. Secured by smart contract escrow."}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                      <span className="text-xs text-white/40 uppercase tracking-wider font-mono">Price</span>
                      <span className="text-brand-300 font-mono text-xl font-bold">{item.price} {item.currency}</span>
                  </div>
                  <Button 
                    onClick={() => handleBuy(item.id)}
                    className="rounded-full px-6 bg-white/10 hover:bg-brand-500 text-white border border-white/20 hover:border-brand-400 shadow-lg hover:shadow-brand-500/50 transition-all"
                  >
                    Buy Now
                  </Button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
