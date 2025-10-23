"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAccount } from "wagmi"
import { useWeb3Auth } from "@/providers/web3auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

/**
 * Protected Route Component
 *
 * Ensures that users have a connected wallet before accessing protected pages.
 * Redirects to home page if no wallet is connected.
 */
export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount()
  const { isConnected: isWeb3AuthConnected, isLoading: isWeb3AuthLoading } = useWeb3Auth()

  useEffect(() => {
    // Don't check auth if not required
    if (!requireAuth) {
      return
    }

    // Wait for Web3Auth to finish loading
    if (isWeb3AuthLoading) {
      return
    }

    // Check if user has any wallet connection
    const hasWalletConnection = isWagmiConnected || isWeb3AuthConnected
    const hasAuthToken = !!token && isAuthenticated

    // If no wallet is connected and no auth token, redirect to home
    if (!hasWalletConnection && !hasAuthToken) {
      console.log("[ProtectedRoute] No wallet connected, redirecting to home...")
      router.push("/")
      return
    }

    // If wallet is connected but no auth token, user needs to complete auth flow
    // This is allowed for onboarding pages where they can create profile
    if (hasWalletConnection && !hasAuthToken) {
      console.log("[ProtectedRoute] Wallet connected but no auth token")
      // Allow access - user might be in the process of creating profile
    }
  }, [
    requireAuth,
    token,
    isAuthenticated,
    isWagmiConnected,
    isWeb3AuthConnected,
    isWeb3AuthLoading,
    router
  ])

  // Show loading state while checking auth
  if (requireAuth && isWeb3AuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
