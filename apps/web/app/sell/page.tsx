"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"

const CATEGORIES = [
  { id: 'Fashion', label: 'Fashion', icon: '👕' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Home', label: 'Home', icon: '🏠' },
  { id: 'Art', label: 'Art', icon: '🎨' },
  { id: 'Toys', label: 'Toys', icon: '🧸' },
  { id: 'Vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'Other', label: 'Other', icon: '📦' },
]

interface CreateListingForm {
  title: string
  description: string
  price: number
  imageUrl: string
  category: string
}

function SellForm() {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<CreateListingForm>({
    defaultValues: {
      category: 'Other'
    }
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const { user } = useAuth()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const selectedCategory = watch('category')

  useEffect(() => {
    if (editId) {
      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      fetch(`${apiUrl}/listings/${editId}`)
        .then(res => res.json())
        .then(data => {
          reset({
            title: data.title,
            description: data.description,
            price: Number(data.price),
            imageUrl: data.images?.[0] || '',
            category: data.category || 'Other'
          })
          if (data.images?.[0]) setPreviewImage(data.images[0])
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [editId, reset])

  const onSubmit = async (data: CreateListingForm) => {
    try {
      const priceString = String(data.price).replace(',', '.');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const endpoint = editId ? `${apiUrl}/listings/${editId}` : `${apiUrl}/listings`
      const method = editId ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          price: priceString,
          images: data.imageUrl ? [data.imageUrl] : [],
          currency: "USDC",
          category: data.category,
          sellerId: user?.id 
        })
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to ${editId ? 'update' : 'create'} listing: ${errorText}`);
      }

      router.push("/my-listings") 
    } catch (error) {
      console.error(error)
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (isLoading) return <div className="text-center p-20 text-neutral-400">Loading listing details...</div>

  return (
    <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 shadow-2xl relative overflow-hidden">
      {/* ... decorative ... */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2"></div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{editId ? 'Edit Listing' : 'Create New Listing'}</h2>
        {!editId && <p className="text-white/60">Reach verified buyers in seconds.</p>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload/URL Section */}
          <div className="space-y-4">
              <label className="block text-sm font-medium text-white/80 uppercase tracking-wide">Product Image</label>
              <div className="aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-brand-500/50 transition-colors flex flex-col items-center justify-center bg-white/5 relative overflow-hidden group">
                {previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                      <span className="text-4xl mb-2 block">📷</span>
                      <span className="text-white/40 text-sm">Paste Image URL below to preview</span>
                  </div>
                )}
              </div>
              <input 
                {...register("imageUrl", { 
                  required: "Image URL is required for MVP",
                  onChange: (e) => setPreviewImage(e.target.value) 
                })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-brand-500 focus:outline-none transition-all"
              />
              {errors.imageUrl && <span className="text-red-400 text-sm">{errors.imageUrl.message}</span>}
          </div>

          {/* Inputs Section */}
          <div className="space-y-6">
            {!editId && (
              <div className="flex justify-end">
                <Button 
                    type="button" 
                    onClick={async () => {
                        const url = (document.querySelector('input[name="imageUrl"]') as HTMLInputElement)?.value;
                        if (!url) return alert("Please enter an image URL first");
                        
                        const btn = document.getElementById('magic-btn');
                        if(btn) btn.innerText = "✨ Generating...";
                        
                        try {
                            const res = await fetch('/api/generate-description', {
                                method: 'POST',
                                body: JSON.stringify({ imageUrl: url })
                            });
                            const data = await res.json();
                            const desc = data.description;
                            
                            let title = "AI Generated Listing";
                            let description = desc;

                            if (desc.includes("Title:") && desc.includes("Description:")) {
                                const titleMatch = desc.match(/Title:\s*(.*?)(?=\n|$)/);
                                if (titleMatch) title = titleMatch[1].trim().replace(/\*\*/g, ''); 
                                description = desc.replace(/Title:.*?\n/, '').replace(/Description:\s*/, '').trim();
                            } else if (desc.includes("**Title:**")) {
                                  const titleMatch = desc.match(/\*\*Title:\*\*\s*(.*?)(?=\n|$)/);
                                  if (titleMatch) title = titleMatch[1].trim();
                                  const descMatch = desc.match(/\*\*Description:\*\*\s*([\s\S]*)/);
                                  if (descMatch) description = descMatch[1].trim();
                            }

                            setValue('title', title);
                            setValue('description', description);
                            
                        } catch {
                            alert("Error generating description");
                        } finally {
                            if(btn) btn.innerText = "✨ Magic Write";
                        }
                    }}
                    id="magic-btn"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full px-4 py-2 text-sm font-bold shadow-lg shadow-violet-500/30 transition-all hover:scale-105"
                >
                    ✨ Magic Write
                </Button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 uppercase tracking-wide mb-2">Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category', cat.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 uppercase tracking-wide mb-2">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-brand-500 focus:outline-none transition-all font-bold text-lg"
                placeholder="e.g. Vintage Leather Jacket"
              />
              {errors.title && <span className="text-red-400 text-sm">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 uppercase tracking-wide mb-2">Price (USDC)</label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required", min: 0 })}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-brand-500 focus:outline-none transition-all font-mono text-xl"
                placeholder="0.00"
              />
              {errors.price && <span className="text-red-400 text-sm">{errors.price.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 uppercase tracking-wide mb-2">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={4}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-brand-500 focus:outline-none transition-all resize-none"
                placeholder="Describe your item..."
              />
              {errors.description && <span className="text-red-400 text-sm">{errors.description.message}</span>}
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-6 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-lg shadow-lg hover:shadow-brand-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : (editId ? "Update Listing" : "List Item")}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function SellPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen text-white p-8 pt-24 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-emerald-300 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)] mb-4">
            Seller Studio
          </h1>
        </div>
  
        <Suspense fallback={<div className="text-center p-10">Loading studio...</div>}>
          <SellForm />
        </Suspense>
      </div>
    </AuthGuard>
  )
}
