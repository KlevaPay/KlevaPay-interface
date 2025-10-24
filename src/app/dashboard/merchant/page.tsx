"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useEffect, useState } from "react"
import { merchantApi, type MerchantStats } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useAccount } from "wagmi"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import type { Merchant } from "@/types"

export default function MerchantPage() {
  const { token } = useAuth()
  const { address: wagmiAddress } = useAccount()
  const { isConnected: w3aConnected, provider: w3aProvider } = useWeb3Auth()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [stats, setStats] = useState<MerchantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string>("")

  // Get wallet address from multiple sources
  useEffect(() => {
    const getWalletAddress = async () => {
      console.log("[MerchantDashboard] Getting wallet address:", {
        token: token ? `${token.slice(0, 10)}...` : null,
        wagmiAddress: wagmiAddress ? `${wagmiAddress.slice(0, 10)}...` : null,
        w3aConnected
      })

      // Priority: token -> wagmiAddress -> web3auth
      if (token) {
        setWalletAddress(token)
        console.log("[MerchantDashboard] Using token as wallet address")
      } else if (wagmiAddress) {
        setWalletAddress(wagmiAddress)
        console.log("[MerchantDashboard] Using wagmi address as wallet address")
      } else if (w3aConnected && w3aProvider) {
        try {
          const accounts = await w3aProvider.request({
            method: "eth_accounts",
          }) as string[]
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
            console.log("[MerchantDashboard] Using Web3Auth address as wallet address")
          }
        } catch (error) {
          console.error("[MerchantDashboard] Error getting Web3Auth address:", error)
        }
      } else {
        console.warn("[MerchantDashboard] No wallet address found from any source")
      }
    }

    getWalletAddress()
  }, [token, wagmiAddress, w3aConnected, w3aProvider])

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!walletAddress) {
        console.log("[MerchantDashboard] No wallet address available, waiting...")
        return
      }

      console.log("[MerchantDashboard] Fetching merchant data for:", walletAddress.slice(0, 10) + "...")
      setLoading(true)

      // Fetch merchant profile using wallet address
      const profileResponse = await merchantApi.getProfile(walletAddress)
      console.log("[MerchantDashboard] Merchant profile response:", profileResponse)

      if (profileResponse.success && profileResponse.data) {
        console.log("[MerchantDashboard] ✓ Merchant profile loaded successfully")
        setMerchant(profileResponse.data)

        // Update auth store with fresh merchant data
        const { useAuthStore } = await import("@/hooks/useAuth")
        useAuthStore.getState().updateMerchant(profileResponse.data)
      } else {
        console.error("[MerchantDashboard] Failed to fetch merchant profile:", profileResponse.error)
        // If merchant profile not found, redirect to create profile
        if (profileResponse.error?.code === "HTTP_404" || profileResponse.error?.message?.includes("not found")) {
          console.log("[MerchantDashboard] Merchant not found, redirecting to create profile...")
          // We'll handle this in the UI instead of redirecting immediately
        }
      }

      try {
        const statsResponse = await merchantApi.getStats(walletAddress)
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data)
        }
      } catch (error) {
        console.warn("[MerchantDashboard] Stats endpoint not available:", error)
      }

      setLoading(false)
    }

    fetchMerchantData()
  }, [walletAddress])


  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Merchant Dashboard</h1>
            <p className="text-[13px] text-foreground/70">Manage your merchant account and view statistics</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-foreground/60">Loading merchant data...</p>
              </div>
            </div>
          ) : !merchant ? (
            <div className="rounded-xl bg-white shadow-sm border border-border p-8 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">No Merchant Profile Found</h2>
              <p className="text-sm text-foreground/70 mb-4">
                We couldn't find a merchant profile for your wallet address.
              </p>
              <p className="text-xs text-foreground/60 mb-6 font-mono break-all">
                Wallet: {walletAddress || "Not connected"}
              </p>
              <button
                onClick={() => window.location.href = "/onboarding/create-profile"}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Merchant Profile
              </button>
            </div>
          ) : (
            <>
              {/* Merchant Stats */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-2">Total Volume</h3>
                  <p className="text-2xl font-bold text-foreground">
                    ${stats?.totalVolume?.toLocaleString() || "0"}
                  </p>
                </div>

                <div className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-2">Total Transactions</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.totalTransactions?.toLocaleString() || "0"}
                  </p>
                </div>

                <div className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-2">Success Rate</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.successRate?.toFixed(1) || "0"}%
                  </p>
                </div>

                <div className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-2">Pending Transactions</h3>
                  <p className="text-2xl font-bold text-foreground">
                    {stats?.pendingTransactions?.toLocaleString() || "0"}
                  </p>
                </div>
              </section>

              {/* Account Overview Section */}
              <section className="rounded-xl bg-white shadow-sm border border-border p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Account Overview</h2>
                  
                </div>

                {merchant ? (
                  <div className="space-y-6">
                    {/* Business Information */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-foreground border-b pb-2">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground/70">Business Name</label>
                          <p className="text-base text-foreground mt-1">{merchant.businessName || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground/70">Country</label>
                          <p className="text-base text-foreground mt-1">{merchant.country || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-foreground/70">Payout Wallet Address</label>
                          <p className="text-base text-foreground mt-1 font-mono text-sm break-all">
                            {merchant.walletAddress || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground/70">KYC Status</label>
                          <p className="text-base text-foreground mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              merchant.kycStatus === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {merchant.kycStatus || "PENDING"}
                            </span>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground/70">Member Since</label>
                          <p className="text-base text-foreground mt-1">
                            {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold text-foreground border-b pb-2">Payment Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground/70">Payout Method</label>
                          <p className="text-base text-foreground mt-1 capitalize">
                            {merchant.payoutPreferences?.method?.replace("_", " ") || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground/70">Payout Currency</label>
                          <p className="text-base text-foreground mt-1">
                            {merchant.payoutPreferences?.currency || "-"}
                          </p>
                        </div>

                        {/* Bank Account Details (if bank_transfer) */}
                        {merchant.payoutPreferences?.method === "bank_transfer" && merchant.payoutPreferences?.accountDetails && (
                          <>
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-semibold text-foreground mb-3">Bank Account Details</h4>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground/70">Bank Name</label>
                              <p className="text-base text-foreground mt-1">
                                {merchant.payoutPreferences.accountDetails.bankName || "-"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground/70">Account Number</label>
                              <p className="text-base text-foreground mt-1">
                                {merchant.payoutPreferences.accountDetails.accountNumber || "-"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground/70">Account Name</label>
                              <p className="text-base text-foreground mt-1">
                                {merchant.payoutPreferences.accountDetails.accountName || "-"}
                              </p>
                            </div>
                            {merchant.payoutPreferences.accountDetails.routingNumber && (
                              <div>
                                <label className="text-sm font-medium text-foreground/70">Routing Number</label>
                                <p className="text-base text-foreground mt-1">
                                  {merchant.payoutPreferences.accountDetails.routingNumber}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/60">No merchant profile found</p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
