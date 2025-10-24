"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "../../components"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { useAccount } from "wagmi"
import { useAuth } from "@/hooks/useAuth"

export function DashboardTopbar() {
  const router = useRouter()
  const { isConnected: w3aConnected, disconnect: disconnectWeb3Auth } = useWeb3Auth()
  const { isConnected: walletConnected } = useAccount()
  const { isAuthenticated, logout } = useAuth()

  const isConnected = w3aConnected || walletConnected

  useEffect(() => {
    // Redirect if not connected or authenticated
    if (!isConnected && !isAuthenticated) {
      router.push('/')
    }
  }, [isConnected, isAuthenticated, router])

  const handleDisconnect = () => {
    logout()
    if (w3aConnected) {
      disconnectWeb3Auth()
    }
    router.push('/')
  }

  return (
    <div className="h-[64px] w-full border-b bg-white/90 backdrop-blur flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded hover:bg-black/5" aria-label="Open sidebar">
          <Menu className="size-5" />
        </button>
        <div className="text-[15px] font-medium">Dashboard</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-black/5" aria-label="Notifications">
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[color:var(--brand-blue)]"></span>
          <span className="sr-only">Notifications</span>
          <Image src="/notification.png" width={24} height={24} alt="Notification" />
        </button>
        <div className="size-8 rounded-full overflow-hidden border border-black/10">
          <Image src="/user.png" width={32} height={32} alt="User" className="object-cover dark:invert" />
        </div>
        <Button onClick={handleDisconnect}>Disconnect</Button>
      </div>
    </div>
  )
}
