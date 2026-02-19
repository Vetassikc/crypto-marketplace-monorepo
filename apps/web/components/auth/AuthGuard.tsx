'use client'

import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/features/wallet/ConnectWallet'
import { ReactNode, useEffect, useState } from 'react'

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-300 to-accent-300 bg-clip-text text-transparent mb-2">
            Wallet Connection Required
          </h2>
          <p className="text-neutral-400 mb-8">
            Please connect your wallet to access this secure area of the marketplace.
          </p>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
