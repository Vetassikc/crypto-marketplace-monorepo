'use client'

import Link from 'next/link'
import { ConnectWallet } from '@/components/features/wallet/ConnectWallet'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const links = [
    { href: '/', label: 'Home' },
    { href: '/listings', label: 'Marketplace' },
    { href: '/sell', label: 'Sell' },
    { href: '/my-orders', label: 'Dashboard' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="border-b border-white/5 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
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
            <span className="hidden rounded-full border border-cyan-200/30 bg-cyan-200/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cyan-100 md:inline-block">
              Beta
            </span>
          </Link>

          {/* Search Bar */}
          <div className="mx-8 hidden max-w-xs flex-1 md:flex">
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
             <div className="mr-1 hidden items-center gap-2 text-sm font-medium text-neutral-400 lg:flex">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-1.5 transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            
            <div className="mx-1 h-6 w-px bg-white/10"></div>
            
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  )
}
