"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/ui/modules/components"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { useAccount, useWalletClient } from "wagmi"
import { AuthMethodModal } from "@/ui/modules/components/auth-method-modal"
import Image from "next/image"
import { completeAuthFlow } from "@/lib/auth-utils"
import { useAuth, useAuthStore } from "@/hooks/useAuth"

export function Navbar() {
  const router = useRouter()
  const { isConnected: w3aConnected, disconnect: disconnectWeb3Auth, userInfo, provider: w3aProvider } = useWeb3Auth()
  const { isConnected: walletConnected, address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { logout: authLogout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const previousWalletConnected = useRef(walletConnected)
  const previousW3aConnected = useRef(w3aConnected)

  const isConnected = w3aConnected || walletConnected

  // Handle wallet connection and backend authentication
  useEffect(() => {
    const handleWalletAuth = async () => {
      const { token, isAuthenticated } = useAuthStore.getState()

      console.log("[Navbar] Wallet state:", {
        walletConnected: walletConnected,
        previousConnected: previousWalletConnected.current,
        address: address ? `${address.slice(0, 10)}...` : null,
        web3Auth: w3aConnected,
        hasWalletClient: !!walletClient,
        hasToken: !!token,
        isAuthenticated
      })

      // Check if we need to authenticate:
      // 1. Wallet is connected with address and walletClient
      // 2. Either it's a new connection OR token is missing (reconnected wallet without auth)
      const needsAuth = walletConnected && address && walletClient && (
        !previousWalletConnected.current || !token || !isAuthenticated
      )

      if (needsAuth) {
        setIsAuthenticating(true)
        setShowAuthModal(false) // Close the modal when starting authentication
        try {
          console.log("[Navbar] Wallet connected, authenticating with backend...")
          console.log("[Navbar] Reason:", {
            newConnection: !previousWalletConnected.current,
            missingToken: !token,
            notAuthenticated: !isAuthenticated
          })

          const authResult = await completeAuthFlow(walletClient, address)

          if (authResult.success) {
            console.log("[Navbar] ✓ Authentication complete, redirecting to:", authResult.redirectTo)
            router.push(authResult.redirectTo)
          } else {
            console.error("[Navbar] Authentication failed")
          }
        } catch (error) {
          console.error("[Navbar] Error during authentication:", error)
        } finally {
          setIsAuthenticating(false)
          previousWalletConnected.current = walletConnected
        }
      } else if (walletConnected && address) {
        // Update previousConnected if wallet is still connected
        previousWalletConnected.current = walletConnected
      } else if (!walletConnected) {
        // Reset previousConnected when wallet is disconnected
        previousWalletConnected.current = false
      }
    }

    handleWalletAuth()
  }, [walletConnected, address, walletClient, router, w3aConnected])

  // Handle Web3Auth connection and backend authentication
  useEffect(() => {
    const handleWeb3AuthAuth = async () => {
      if (w3aConnected && !previousW3aConnected.current && w3aProvider) {
        setIsAuthenticating(true)
        try {
          console.log("Web3Auth connected, getting wallet address...")

          // Get wallet address from Web3Auth provider
          const accounts = await w3aProvider.request({
            method: "eth_accounts",
          }) as string[]

          if (accounts && accounts.length > 0) {
            const walletAddress = accounts[0]
            console.log("Web3Auth wallet address:", walletAddress)

            const authResult = await completeAuthFlow(w3aProvider, walletAddress)

            if (authResult.success || !!address) {
              console.log("✓ Authentication complete, redirecting to:", authResult.redirectTo)
              router.push(authResult.redirectTo)
            } else {
              console.error("Authentication failed")
            }
          }
        } catch (error) {
          console.error("Error during Web3Auth authentication:", error)
        } finally {
          setIsAuthenticating(false)
        }
      }
      previousW3aConnected.current = w3aConnected
    }

    handleWeb3AuthAuth()
  }, [w3aConnected, w3aProvider, router])

  const handleDisconnect = () => {
    // Clear auth store
    authLogout()

    if (w3aConnected) {
      disconnectWeb3Auth()
    }
    // Note: Wallet disconnect is handled by RainbowKit
  }

  const getDisplayName = () => {
    if (w3aConnected && userInfo?.name) {
      return userInfo.name
    }
    if (walletConnected && address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return ""
  }

  return (
    <>
      <header className="w-full border-b" style={{ backgroundColor: "var(--brand-white)", borderColor: "var(--brand-navy-border)", color: "#fff" }}>
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-20 lg:px-28 h-[77px] flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="KlevaPay Logo" width={28} height={28} priority />
            <span className="text-[22px] font-semibold tracking-tight" style={{ color: "#0A486C" }}>KlevaPay</span>
          </div>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-[14px]">
            <div className="relative flex items-center gap-6">
              <span className="absolute -z-10 inset-x-[-80px] top-1/2 -translate-y-1/2 h-px border-t border-dotted border-gray-200" />
              <Link href="#home" className="text-[#0A486C] font-medium">Home</Link>
              <Link href="#features" className="text-gray-500 hover:text-[#0A486C]">Features</Link>
              <Link href="#pricing" className="text-gray-500 hover:text-[#0A486C]">Pricing</Link>
              <Link href="#docs" className="text-gray-500 hover:text-[#0A486C]">Docs</Link>
              <span className="absolute -z-10 inset-x-[80px] top-1/2 -translate-y-1/2 h-px border-t border-dotted border-gray-200" />
            </div>
          </nav>

          {/* Wallet actions */}
          <div className="flex items-center gap-3 text-[14px]">
            {isConnected ? (
              <>
                {/* Show RainbowKit button if wallet is connected */}
                {walletConnected && (
                  <div className="hidden sm:block">
                    <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
                  </div>
                )}

                {/* Show Web3Auth info if connected */}
                {w3aConnected && (
                  <Button
                    size="sm"
                    className="text-white"
                    style={{ backgroundColor: "var(--brand-navy)" }}
                    onClick={handleDisconnect}
                  >
                    {getDisplayName() || "Connected"}
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                className="text-white"
                style={{ backgroundColor: "var(--brand-blue)" }}
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Method Modal */}
      <AuthMethodModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}

