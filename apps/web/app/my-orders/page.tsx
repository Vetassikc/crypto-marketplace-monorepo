'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { AuthGuard } from '@/components/auth/AuthGuard'
import Link from 'next/link'

type Order = {
  id: string
  status: string
  listing: {
    title: string
    price: string
    currency: string
  }
}

async function fetchOrders(buyerAddress?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  let url = `${apiUrl}/orders`;
  
  if (buyerAddress) {
    url += `?buyerAddress=${buyerAddress}`;
  }
  
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

const OrderList = () => {
  const { address } = useAccount()
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', address],
    queryFn: () => fetchOrders(address),
    enabled: !!address
  })

  if (isLoading) return <div className="p-20 text-white text-center">Loading orders...</div>
  
  if (error) return <div className="p-20 text-white text-center text-red-500">Error loading orders. Please check if the API is running.</div>

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
        <p className="text-white/40 text-xl mb-6">No active orders found.</p>
        <Link href="/listings" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-lg hover:shadow-brand-500/50">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order: Order) => (
        <div key={order.id} className="glass p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{order.listing.title}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                    {order.status}
                </span>
            </div>
            <p className="text-white/40 text-sm font-mono">Order ID: {order.id}</p>
          </div>
          
          <div className="text-right flex flex-col items-end gap-2">
            <span className="text-sm text-white/40 uppercase tracking-wider">Total</span>
            <p className="text-3xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                {order.listing.price} {order.listing.currency}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MyOrdersPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen text-white p-8 pt-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-emerald-300 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          My Orders
        </h1>
        <OrderList />
      </div>
    </AuthGuard>
  )
}
