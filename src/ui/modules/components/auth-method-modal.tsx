"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Wallet, Mail } from "lucide-react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useWeb3Auth } from "@/providers/web3auth-provider"

interface AuthMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthMethodModal({ isOpen, onClose }: AuthMethodModalProps) {
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  const { connect: connectWeb3Auth } = useWeb3Auth()
  const [isConnecting, setIsConnecting] = useState(false)

  if (!isOpen) return null

  const handleWalletConnect = () => {
    onClose()
    if (openConnectModal) {
      openConnectModal()
    }
    // Redirect will be handled after wallet connection is confirmed
  }

  const handleWeb3AuthConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWeb3Auth()
      onClose()
      // Redirect will be handled by the Navbar component after successful connection
      // The navbar's useEffect will detect the connection and call completeAuthFlow
    } catch (error) {
      console.error("Web3Auth connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to KlevaPay</h2>
            <p className="text-sm text-gray-600">
              Choose how you&apos;d like to connect to your merchant account
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Continue with Wallet */}
            <button
              onClick={handleWalletConnect}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E73FF] hover:bg-[#1E73FF]/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1E73FF]/10 rounded-lg group-hover:bg-[#1E73FF]/20 transition-colors">
                  <Wallet className="size-6 text-[#1E73FF]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">I have a crypto wallet</h3>
                  <p className="text-xs text-gray-600">
                    Perfect for crypto users! Connect with MetaMask, Coinbase, or your existing wallet
                  </p>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Continue without Wallet */}
            <button
              onClick={handleWeb3AuthConnect}
              disabled={isConnecting}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E9086] hover:bg-[#1E9086]/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#1E9086]/10 rounded-lg group-hover:bg-[#1E9086]/20 transition-colors">
                  <Mail className="size-6 text-[#1E9086]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {isConnecting ? "Connecting..." : "I'm new to crypto"}
                  </h3>
                  <p className="text-xs text-gray-600">
                    No worries! Sign in with Google, Apple, Twitter, or other familiar accounts
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-600">
              By connecting, you agree to KlevaPay&apos;s{" "}
              <a href="#" className="text-[#1E73FF] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#1E73FF] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
