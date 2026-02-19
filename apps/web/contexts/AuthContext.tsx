'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAccount } from 'wagmi'

interface User {
  id: string
  name?: string
  email?: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  image?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const login = async () => {
      if (!address || !isConnected) {
        setUser(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            network: 'tempo', // TODO: Get dynamic chainId if needed
          }),
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          console.error('Login failed')
        }
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    login()
  }, [address, isConnected])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
