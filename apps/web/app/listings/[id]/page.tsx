"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/Button"
import { useEscrow } from "@/hooks/useEscrow"
import { AUSD_ADDRESS } from "@/lib/contracts"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { toast } from "sonner"
import { useEffect } from "react"
import { tempoTestnet } from '@/lib/tempo-chain'

interface Listing {
  id: string
  title: string
  description: string
  price: string
  currency: string
  sellerId: string
  seller: {
    wallets: { address: string }[]
  }
  images: string[]
  createdAt: string
  updatedAt: string
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

async function fetchListing(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/listings/${id}`)
  if (!res.ok) throw new Error('Listing not found')
  return res.json()
}

export default function ListingDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const { data: listing, isLoading, error } = useQuery<Listing>({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(id),
    enabled: !!id
  })

  // Smart Contract Hook
  const { createEscrow, approvePayment, allowance, refetchAllowance, balance, isPending, isConfirming, isConfirmed, hash } = useEscrow()

  const registerNetwork = async () => {
    try {
      const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum
      if (!ethereum) return

      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xa5bf', // 42431 in hex
          chainName: 'Tempo Moderato',
          nativeCurrency: {
            name: 'Alpha USD',
            symbol: 'AUSD',
            decimals: 18
          },
          rpcUrls: ['https://rpc.moderato.tempo.xyz'],
          blockExplorerUrls: ['https://scout.moderato.tempo.xyz']
        }]
      })
      toast.success("Network added. Please switch if prompted.")
    } catch (e) {
      console.error(e)
      toast.error("Failed to add network.")
    }
  }

  // Check if we have enough allowance
  const hasAllowance = allowance && Number(allowance) > 0;
  
  // NOTE: In production, use parseEther(listing.price) <= balance
  // Here we assume simple comparison for MVP. Note that balance is BigInt.
  // We need to convert listing.price to BigInt-ish or use Number (unsafe but ok for tests).
  // Assuming 18 decimals.
  const priceVal = parseFloat(listing?.price || "0");
  const balanceVal = balance ? Number(balance) / 1e18 : 0;
  const hasFunds = balanceVal >= priceVal;

  useEffect(() => {
      refetchAllowance();
  }, [refetchAllowance]);

  const handleAction = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!")
      return
    }

    if (!listing) {
      toast.error("Listing is not loaded yet.")
      return
    }

    if (chainId !== tempoTestnet.id) {
      toast.error("Please switch to Tempo Moderato Network")
      switchChain({ chainId: tempoTestnet.id })
      return
    }

    if (!hasFunds) {
        toast.warning(`Warning: Low Balance detected (${balanceVal.toFixed(2)} AUSD). Transaction might fail.`)
    }

    let sellerAddress = listing?.seller?.wallets?.[0]?.address;

    // Fallback logic...
    if (!sellerAddress && listing?.sellerId) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/users/${listing.sellerId}`);
        if (res.ok) {
           const sellerData = await res.json();
           sellerAddress = sellerData.wallets?.[0]?.address;
        }
      } catch (e) {
        console.error("Failed to fetch seller details", e);
      }
    }

    if (!sellerAddress) {
      toast.error("Seller has no wallet linked. Cannot pay.")
      return
    }
  
    if (!hasAllowance) {
        await approvePayment(listing.price.toString());
    } else {
        const numericOrderId = Date.now(); 
        await createEscrow(numericOrderId, sellerAddress, listing.price)
    }
  }

  // 2. Watch for confirmation and update backend
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("Transaction confirmed. Refetching allowance...");
      refetchAllowance(); // FORCE REFETCH
      
      toast.success("Transaction Confirmed!")
      
      if (hasAllowance) {
          const createBackendOrder = async () => {
            try {
               const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
               await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  listingId: id,
                  buyerId: 'cmk6y78si0000v4ts6mxw28bq', // Hardcoded for MVP
                  txHash: hash 
                })
              })
            } catch (err) {
              console.error("Backend sync failed", err)
            }
          }
          createBackendOrder()
      }
    }
  }, [isConfirmed, hash, id, hasAllowance, refetchAllowance])


  if (isLoading) return <div className="min-h-screen text-white p-20 text-center flex items-center justify-center"><div className="animate-spin h-8 w-8 border-t-2 border-brand-500 rounded-full"></div></div>
  if (error) return <div className="min-h-screen text-white p-20 text-center flex flex-col items-center justify-center gap-4"><p className="text-red-400">Listing not found</p><Link href="/listings" className="text-brand-400 hover:text-brand-300 underline">Return to Listings</Link></div>
  if (!listing) return <div className="min-h-screen text-white p-20 text-center">Listing unavailable.</div>

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
            {/* DEBUG INFO */}
            <div className="mb-4 text-xs text-brand-300 font-mono bg-black/40 p-2 rounded border border-brand-500/30 flex flex-col gap-1">
               <div className="flex justify-between items-center">
                   <span>DEBUG: App Chain: {tempoTestnet.id} | Wallet Chain: {chainId || 'Disconnected'}</span>
                   <button onClick={registerNetwork} className="underline hover:text-white">Fix Wallet Name</button>
               </div>
               <div>
                   Token Contract: {AUSD_ADDRESS} (Balance: {balanceVal.toFixed(2)})
               </div>
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
                    {chainId !== tempoTestnet.id ? (
                      <Button 
                        onClick={() => switchChain({ chainId: tempoTestnet.id })}
                        className="h-14 px-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
                      >
                        Wrong Network: Switch to Tempo
                      </Button>
                    ) : (
                      <Button 
                          onClick={handleAction}
                          disabled={isPending || isConfirming}
                          className={`h-14 px-12 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] border border-brand-400/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${!hasFunds ? 'bg-amber-600' : !hasAllowance ? 'bg-amber-500 hover:bg-amber-600 text-black' : 'bg-brand-600 hover:bg-brand-500 text-white'}`}
                      >
                          {isPending 
                            ? 'Processing...' 
                            : isConfirming 
                              ? 'Confirming...' 
                              : !hasAllowance 
                                ? `1. Approve ${listing.currency}` 
                                : `2. Pay ${listing.price} ${listing.currency}`
                          }
                      </Button>
                    )}
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
