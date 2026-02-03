"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/Button"

interface Listing {
  id: string
  title: string
  description: string
  price: string
  currency: string
  sellerId: string
  createdAt: string
  updatedAt: string
}

async function fetchListing(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/listings/${id}`)
  if (!res.ok) throw new Error('Listing not found')
  return res.json()
}

export default function ListingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    enabled: !!id
  })

  const handleBuy = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: id,
          buyerId: 'cmk6y78si0000v4ts6mxw28bq' // Hardcoded for MVP
        })
      })
      
      if (!res.ok) throw new Error('Failed to create order')
      
      router.push('/my-orders')
    } catch (err) {
      alert('Error placing order')
      console.error(err)
    }
  }

  if (isLoading) return <div className="min-h-screen text-white p-20 text-center flex items-center justify-center"><div className="animate-spin h-8 w-8 border-t-2 border-brand-500 rounded-full"></div></div>
  if (error) return <div className="min-h-screen text-white p-20 text-center flex flex-col items-center justify-center gap-4"><p className="text-red-400">Listing not found</p><Link href="/listings" className="text-brand-400 hover:text-brand-300 underline">Return to Listings</Link></div>

  return (
    <div className="min-h-screen text-white p-8 pt-24 max-w-7xl mx-auto">
      <Link href="/listings" className="inline-flex items-center text-white/40 hover:text-white transition-colors mb-8 group">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Visual Section */}
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-emerald-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
            <div className="relative glass aspect-square rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 group-hover:border-brand-500/30 transition-colors">
                {listing.images && listing.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors select-none">{listing.title[0]}</span>
                )}
                
                {/* Simulated Product Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-900/20 pointer-events-none"></div>
            </div>
        </div>

        {/* Details Section */}
        <div className="py-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6 uppercase tracking-wider">
                Blockchain Verified
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 leading-tight">
                {listing.title}
            </h1>

            <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-mono font-bold text-brand-300 drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                    {listing.price} {listing.currency}
                </span>
                <span className="text-white/40 mb-2 text-sm uppercase tracking-widest">Escrow Secured</span>
            </div>

            <div className="prose prose-invert prose-lg mb-12 text-white/70">
                <ReactMarkdown>{listing.description || "No description provided. This is a premium asset verified on the Vartovii marketplace."}</ReactMarkdown>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    onClick={handleBuy}
                    className="h-14 px-12 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] border border-brand-400/20 transition-all transform hover:-translate-y-1"
                >
                    Buy Now
                </Button>
                <button className="h-14 px-8 rounded-full glass hover:bg-white/10 text-white font-medium border border-white/10 transition-all">
                    View Seller Profile
                </button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-8 text-sm text-white/40">
                <div>
                    <span className="block text-xs uppercase tracking-wider mb-1">Contract Address</span>
                    <span className="font-mono text-white/60">0x71C...9A21</span>
                </div>
                 <div>
                    <span className="block text-xs uppercase tracking-wider mb-1">Token ID</span>
                    <span className="font-mono text-white/60">#8821</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
