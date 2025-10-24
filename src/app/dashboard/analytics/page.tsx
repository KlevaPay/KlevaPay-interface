"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { merchantApi, type MerchantStats } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useAccount } from "wagmi"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { BarChart3, TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"

export default function AnalyticsPage() {
  const { token } = useAuth()
  const { address: wagmiAddress } = useAccount()
  const { isConnected: w3aConnected, provider: w3aProvider } = useWeb3Auth()
  const [stats, setStats] = useState<MerchantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string>("")

  // Get wallet address from multiple sources
  useEffect(() => {
    const getWalletAddress = async () => {
      if (token) {
        setWalletAddress(token)
      } else if (wagmiAddress) {
        setWalletAddress(wagmiAddress)
      } else if (w3aConnected && w3aProvider) {
        try {
          const accounts = await w3aProvider.request({
            method: "eth_accounts",
          }) as string[]
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error getting wallet address:", error)
        }
      }
    }

    getWalletAddress()
  }, [token, wagmiAddress, w3aConnected, w3aProvider])

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await merchantApi.getStats(walletAddress)
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [walletAddress])

  // Calculate percentages for visualizations
  const totalTx = stats?.totalTransactions || 0
  const successPercentage = totalTx > 0 ? ((stats?.successfulTransactions || 0) / totalTx) * 100 : 0
  const pendingPercentage = totalTx > 0 ? ((stats?.pendingTransactions || 0) / totalTx) * 100 : 0
  const failedPercentage = totalTx > 0 ? ((stats?.failedTransactions || 0) / totalTx) * 100 : 0

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Analytics</h1>
            <p className="text-[13px] text-foreground/70">Track your payment performance and insights</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Stats Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-foreground/60">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Volume */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-[#1E73FF]/10 rounded-lg">
                      <DollarSign className="size-5 text-[#1E73FF]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats?.totalVolume?.toLocaleString() || "0"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Total Volume</p>
                </div>

                {/* Total Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-[#1E73FF]/10 rounded-lg">
                      <BarChart3 className="size-5 text-[#1E73FF]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.totalTransactions?.toLocaleString() || "0"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
                </div>

                {/* Success Rate */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="size-5 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.successRate?.toFixed(1) || "0"}%
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Success Rate</p>
                </div>

                {/* Average Transaction */}
                <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="size-5 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats?.averageTransactionAmount?.toLocaleString() || "0"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Average Transaction</p>
                </div>
              </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Success Rate Donut Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Success Rate</h2>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  {/* Donut Chart using conic-gradient */}
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #10B981 0deg ${successPercentage * 3.6}deg,
                        #F59E0B ${successPercentage * 3.6}deg ${(successPercentage + pendingPercentage) * 3.6}deg,
                        #EF4444 ${(successPercentage + pendingPercentage) * 3.6}deg 360deg
                      )`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{stats?.successRate?.toFixed(1) || "0"}%</span>
                        <span className="text-xs text-gray-600">Success Rate</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Successful ({successPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-gray-600">Pending ({pendingPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Failed ({failedPercentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Volume Breakdown</h2>
              <div className="space-y-6 pt-4">
                {/* Total Volume */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Volume</span>
                    <span className="text-lg font-bold text-gray-900">${stats?.totalVolume?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full bg-[#1E73FF]" style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Average Transaction */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Transaction</span>
                    <span className="text-lg font-bold text-gray-900">${stats?.averageTransactionAmount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-purple-500"
                      style={{
                        width: `${Math.min(((stats?.averageTransactionAmount || 0) / (stats?.totalVolume || 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Successful Volume Estimate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Successful Volume (est.)</span>
                    <span className="text-lg font-bold text-green-600">
                      ${(((stats?.totalVolume || 0) * (stats?.successRate || 0)) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{ width: `${stats?.successRate || 0}%` }}
                    />
                  </div>
                </div>

                {/* Period Indicator */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Period</span>
                    <span className="text-sm font-medium text-gray-700">{stats?.period || "30d"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transaction Status */}
          <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Transaction Counts Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Distribution</h2>
              <div className="space-y-4">
                {/* Successful */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Successful</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {stats?.successfulTransactions?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-green-500"
                      style={{ width: `${successPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="size-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {stats?.pendingTransactions?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-yellow-500"
                      style={{ width: `${pendingPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Failed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Failed</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {stats?.failedTransactions?.toLocaleString() || "0"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-red-500"
                      style={{ width: `${failedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
