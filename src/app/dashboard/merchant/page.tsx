"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useEffect, useState } from "react"
import { merchantApi, type MerchantStats } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import type { Merchant } from "@/types"

export default function MerchantPage() {
  const { token, merchant: authMerchant } = useAuth()
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [stats, setStats] = useState<MerchantStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!token) return

      setLoading(true)

      // Fetch merchant profile using wallet address
      const profileResponse = await merchantApi.getProfile(token)
      console.log("Merchant profile response:", profileResponse)

      if (profileResponse.success && profileResponse.data) {
        setMerchant(profileResponse.data)

        // Update auth store with fresh merchant data
        const { useAuthStore } = await import("@/hooks/useAuth")
        useAuthStore.getState().updateMerchant(profileResponse.data)
      } else {
        console.error("Failed to fetch merchant profile:", profileResponse.error)
      }

      // Fetch stats (may not be implemented yet on backend)
      try {
        const statsResponse = await merchantApi.getStats(token)
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data)
        }
      } catch (error) {
        console.warn("Stats endpoint not available:", error)
      }

      setLoading(false)
    }

    fetchMerchantData()
  }, [token])

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
            <div className="text-sm text-foreground/60">Loading merchant data...</div>
          ) : (
            <>
              {/* Merchant Stats */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-2">Total Revenue</h3>
                  <p className="text-2xl font-bold text-foreground">
                    ${stats?.totalRevenue?.toLocaleString() || "0"}
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
                    {stats?.activeCustomers?.toLocaleString() || "0"}
                  </p>
                </div>
              </section>

              {/* Merchant Profile Section */}
              <section className="rounded-xl bg-white shadow-sm border border-border p-6 mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Merchant Profile</h2>
                {merchant ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground/70">Business Name</label>
                      <p className="text-base text-foreground mt-1">{merchant.businessName || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">Wallet Address</label>
                      <p className="text-base text-foreground mt-1 font-mono text-sm break-all">
                        {merchant.walletAddress || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground/70">Country</label>
                      <p className="text-base text-foreground mt-1">{merchant.country || "-"}</p>
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
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-foreground/70">Member Since</label>
                      <p className="text-base text-foreground mt-1">
                        {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/60">No merchant profile found</p>
                )}
              </section>

              {/* API Keys Section */}
              <section className="rounded-xl bg-white shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">API Keys</h2>
                <p className="text-sm text-foreground/70 mb-4">
                  Manage your API keys for integrating KlevaPay into your applications
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Generate New API Key
                </button>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
