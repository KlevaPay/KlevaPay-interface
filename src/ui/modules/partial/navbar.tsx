"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/ui/modules/components"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { useAccount } from "wagmi"
import { AuthMethodModal } from "@/ui/modules/components/auth-method-modal"
import Image from "next/image"

export function Navbar() {
  const router = useRouter()
  const { isConnected: w3aConnected, disconnect: disconnectWeb3Auth, userInfo } = useWeb3Auth()
  const { isConnected: walletConnected, address } = useAccount()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const previousWalletConnected = useRef(walletConnected)

  const isConnected = w3aConnected || walletConnected

  // Redirect to dashboard when wallet connects
  useEffect(() => {
    if (walletConnected && !previousWalletConnected.current) {
      router.push("/dashboard")
    }
    previousWalletConnected.current = walletConnected
  }, [walletConnected, router])

  const handleDisconnect = () => {
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

