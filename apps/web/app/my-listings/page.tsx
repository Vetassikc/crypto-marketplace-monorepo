"use client"

import { useAuth } from "@/contexts/AuthContext"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

type MyListing = {
    id: string
    title: string
    price: string
    images?: string[]
}

const MyListingsContent = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    const { data: listings, isLoading } = useQuery({
        queryKey: ['my-listings', user?.id],
        queryFn: async () => {
            const res = await fetch(`${apiUrl}/listings?sellerId=${user?.id}`)
            if (!res.ok) throw new Error('Failed to fetch listings')
            return res.json()
        },
        enabled: !!user?.id
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
             const res = await fetch(`${apiUrl}/listings/${id}`, { method: 'DELETE' })
             if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete');
             }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] })
        },
        onError: (error: Error) => {
            alert(`Error deleting listing: ${error.message}`);
        }
    })

    if (isLoading) return <div className="p-20 text-center text-white/50">Loading your implementation...</div>

    if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-white mb-4">No Active Listings</h2>
                <Link href="/sell">
                    <Button>Create Your First Listing</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item: MyListing) => (
                <div key={item.id} className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
                    {item.images?.[0] && (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover rounded-xl bg-neutral-900" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-white">{item.title}</h3>
                        <p className="text-brand-400 font-mono">{item.price} USDC</p>
                    </div>
                    <div className="mt-auto flex gap-2">
                        <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                                if (confirm("Delete this listing?")) {
                                    deleteMutation.mutate(item.id)
                                }
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Link href={`/sell?edit=${item.id}`} className="flex-1">
                             <Button variant="glass" className="w-full">Edit</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function MyListingsPage() {
    return (
        <AuthGuard>
             <div className="min-h-screen text-white p-8 pt-24 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                     <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-indigo-300">
                        My Personal Cabinet
                    </h1>
                    <Link href="/sell">
                        <Button>+ Add New Item</Button>
                    </Link>
                </div>
                <MyListingsContent />
             </div>
        </AuthGuard>
    )
}
