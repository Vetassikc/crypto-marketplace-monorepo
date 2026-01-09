'use client'

import Link from 'next/link'
import { ConnectWallet } from './wallet/ConnectWallet'
import { Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './ui/ModeToggle'

import Image from 'next/image'

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="glass border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
               <Image 
                 src="/logo.svg" 
                 alt="VartMarkt Logo" 
                 fill
                 className="object-contain"
               />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight transition-all duration-300 group-hover:text-brand-400 group-hover:tracking-normal">
              VartMarkt
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-brand-500 transition-colors">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
              />
            </div>
          </div>

          {/* Rights Side */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-4 text-sm font-medium text-neutral-400 mr-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/listings" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/sell" className="hover:text-white transition-colors">Sell</Link>
              <Link href="/my-orders" className="hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
            
            <div className="h-6 w-px bg-white/10 mx-1"></div>
            
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  )
}
