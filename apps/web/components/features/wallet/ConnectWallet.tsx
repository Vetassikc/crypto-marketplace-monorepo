'use client'

import { useState, useEffect } from 'react'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { injected } from 'wagmi/connectors'
import Link from 'next/link'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="glass" disabled>
        Loading...
      </Button>
    )
  }

  if (isConnected) {
    return (
      <div className="flex gap-2 items-center">
        <Link href="/my-orders">
          <Button variant="ghost" size="sm" className="text-white hover:text-brand-500">
            My Orders
          </Button>
        </Link>
        <Link href="/my-listings">
          <Button variant="ghost" size="sm" className="text-white hover:text-brand-500">
            My Listings
          </Button>
        </Link>
        <span className="text-sm text-neutral-400">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      variant="glass" 
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </Button>
  )
}
