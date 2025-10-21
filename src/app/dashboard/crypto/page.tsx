"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useEffect, useState } from "react"
import { cryptoApi, type CryptoPrice, type CryptoWallet, type CryptoTransaction } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function CryptoPage() {
  const { token } = useAuth()
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [wallets, setWallets] = useState<CryptoWallet[]>([])
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"wallets" | "prices" | "transactions">("wallets")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch prices (public endpoint)
      const pricesResponse = await cryptoApi.getPrices(["BTC", "ETH", "USDT", "BNB"])
      if (pricesResponse.success && pricesResponse.data) {
        setPrices(pricesResponse.data)
      }

      // Fetch wallets (requires auth)
      if (token) {
        const walletsResponse = await cryptoApi.getWallets(token)
        if (walletsResponse.success && walletsResponse.data) {
          setWallets(walletsResponse.data)
        }

        const txResponse = await cryptoApi.getTransactions(undefined, token)
        if (txResponse.success && txResponse.data) {
          setTransactions(txResponse.data)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [token])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "failed":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Cryptocurrency</h1>
            <p className="text-[13px] text-foreground/70">Manage crypto wallets and monitor prices</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Tabs */}
          <section className="mb-6">
            <div className="flex gap-4 border-b border-white/20">
              <button
                onClick={() => setActiveTab("wallets")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "wallets"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Wallets
              </button>
              <button
                onClick={() => setActiveTab("prices")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "prices"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Prices
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "transactions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Transactions
              </button>
            </div>
          </section>

          {loading ? (
            <div className="text-sm text-foreground/60">Loading crypto data...</div>
          ) : (
            <>
              {/* Wallets Tab */}
              {activeTab === "wallets" && (
                <section className="rounded-xl bg-white shadow-sm border border-border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Your Crypto Wallets</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Create Wallet
                    </button>
                  </div>
                  {wallets.length === 0 ? (
                    <p className="text-sm text-foreground/60 text-center py-8">
                      No wallets found. Create a wallet to get started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wallets.map((wallet) => (
                        <div key={wallet.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-semibold text-foreground">{wallet.symbol}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${wallet.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                              {wallet.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/70 mb-1">Network: {wallet.network}</p>
                          <p className="text-xs font-mono text-foreground/70 mb-2 break-all">{wallet.address}</p>
                          <p className="text-lg font-bold text-foreground">{wallet.balance} {wallet.symbol}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Prices Tab */}
              {activeTab === "prices" && (
                <section className="rounded-xl bg-white shadow-sm border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Symbol
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            24h Change
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Market Cap
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-border">
                        {prices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-foreground/60">
                              No price data available.
                            </td>
                          </tr>
                        ) : (
                          prices.map((price) => (
                            <tr key={price.symbol} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                                {price.symbol}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                {price.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                ${price.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={price.changePercent24h >= 0 ? "text-green-600" : "text-red-600"}>
                                  {price.changePercent24h >= 0 ? "+" : ""}{price.changePercent24h.toFixed(2)}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                ${price.marketCap?.toLocaleString() || "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Transactions Tab */}
              {activeTab === "transactions" && (
                <section className="rounded-xl bg-white shadow-sm border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-border">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            TX Hash
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Network
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Confirmations
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-border">
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-sm text-foreground/60">
                              No crypto transactions found.
                            </td>
                          </tr>
                        ) : (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground">
                                {tx.txHash.substring(0, 16)}...
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                {tx.network}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                {tx.amount} {tx.symbol}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                {tx.confirmations}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
