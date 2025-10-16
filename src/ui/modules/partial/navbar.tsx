"use client"

import Link from "next/link"
import { Button } from "@/ui/modules/components"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import Image from "next/image"

export function Navbar() {
  const { isConnected: w3aConnected, connect: connectWeb3Auth, disconnect: disconnectWeb3Auth } = useWeb3Auth()

  return (
    <header className="w-full border-b" style={{ backgroundColor: "var(--brand-white)", borderColor: "var(--brand-navy-border)", color: "#fff" }}>
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-20 lg:px-28 h-[77px] flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="KleverPay Logo" width={28} height={28} priority />
          <span className="text-[22px] font-semibold tracking-tight" style={{ color: "#0A486C" }}>KleverPay</span>
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
          {/* RainbowKit */}
          {/* <div className="hidden sm:block">
            <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
          </div>
          <div className="sm:hidden">
            <ConnectButton accountStatus="avatar" chainStatus="none" showBalance={false} />
          </div> */}

          {/* Account Abstraction via Web3Auth */}
          <Button
            size="sm"
            className="text-white"
            style={{ backgroundColor: w3aConnected ? "var(--brand-navy)" : "var(--brand-blue)" }}
            onClick={() => (w3aConnected ? disconnectWeb3Auth() : connectWeb3Auth())}
          >
            {w3aConnected ? "Web3Auth: Connected" : "Wallet"}
          </Button>
        </div>
      </div>
    </header>
  )
}

