"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { Button } from "@/ui/modules/components/button"
import { transactionsApi, type TransactionFilters } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import type { Transaction } from "@/types"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"

export default function TransactionsPage() {
  const { token, isAuthenticated, merchant } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<TransactionFilters>({})

  const limit = 20

  // Fetch transactions
  const fetchTransactions = async () => {
    console.log("Auth state:", { token: token ? "exists" : "null", isAuthenticated })

    if (!token) {
      console.warn("No token available")
      setError("Authentication required. Please sign in again.")
      setIsLoading(false)
      return
    }

    const walletAddress = merchant?.walletAddress
    if (!walletAddress) {
      console.warn("No wallet address on merchant profile")
      setError("Missing wallet address. Please complete your merchant profile.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const response = await transactionsApi.getTransactionsByWallet(
      walletAddress,
      token,
      page,
      limit,
      filters
    )

    console.log("Transactions API Response:", response)
    console.log("Response data structure:", {
      success: response.success,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      error: response.error
    })

    if (response.success && response.data) {
      const { transactions, pagination } = response.data as any
      const items = Array.isArray(transactions) ? transactions : []
      const totalPagesFromApi = pagination?.totalPages || 1

      console.log("Extracted data:", { itemsCount: items.length, pagination })

      setTransactions(items)
      setTotalPages(totalPagesFromApi)
    } else {
      console.error("Failed to load transactions:", response.error)
      setError(response.error?.message || "Failed to load transactions")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [token, merchant?.walletAddress, page, filters])

  // Handle filter change
  const handleFilterChange = (filterType: keyof TransactionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
    setPage(1) // Reset to first page when filter changes
  }

  // Handle export
  const handleExport = async () => {
    if (!token) return

    const response = await transactionsApi.exportTransactions(token, filters)
    if (response.success && response.data?.downloadUrl) {
      window.open(response.data.downloadUrl, "_blank")
    }
  }

  // Map status string to table status
  const mapStatusToTableStatus = (status: string): "Completed" | "Processing" | "Failed" => {
    const upperStatus = status.toUpperCase()
    switch (upperStatus) {
      case "PAID":
      case "SETTLED":
      case "SUCCESSFUL":
      case "SUCCESS":
        return "Completed"
      case "PENDING":
      case "PROCESSING":
        return "Processing"
      case "FAILED":
      case "CANCELLED":
      case "REFUNDED":
        return "Failed"
      default:
        return "Processing"
    }
  }

  // Format transaction data for table
  const formatTransactionForTable = (tx: Transaction) => ({
    id: tx.reference || tx._id,
    customer: tx.customerName || tx.customerEmail || tx.metadata?.customerId || "N/A",
    amount: `${tx.amount.toLocaleString()} ${tx.currency}`,
    status: mapStatusToTableStatus(tx.status),
    date: new Date(tx.createdAt).toLocaleString(),
  })

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Transactions</h1>
            <p className="text-[13px] text-foreground/70">View and manage all your transactions</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Filters */}
          <section className="bg-white rounded-xl shadow-sm border border-border p-4 mb-4">
            <div className="flex flex-col gap-4">
              {/* Primary Filters Row */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Filter Dropdowns */}
                <div className="flex gap-2 w-full flex-wrap">
                {/* Status Filter */}
                <select
                  value={filters.status || ""}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value || undefined)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SUCCESS">Success</option>
                  <option value="SETTLED">Settled</option>
                  <option value="FAILED">Failed</option>
                </select>

                {/* Method Filter */}
                <select
                  value={filters.method || ""}
                  onChange={(e) =>
                    handleFilterChange("method", e.target.value || undefined)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                >
                  <option value="">All Methods</option>
                  <option value="CARD">Card</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="WALLET">Wallet</option>
                  <option value="CRYPTO">Crypto</option>
                  <option value="FIAT">Fiat</option>
                </select>

                {/* Currency Filter */}
                <select
                  value={filters.currency || ""}
                  onChange={(e) =>
                    handleFilterChange("currency", e.target.value || undefined)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                >
                  <option value="">All Currencies</option>
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>

                <Button variant="outline" onClick={handleExport}>
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Date Range and Sort Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Date Range */}
              <div className="flex gap-2 flex-1">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => handleFilterChange("startDate", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => handleFilterChange("endDate", e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy || "createdAt"}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                  >
                    <option value="createdAt">Date</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                    <option value="reference">Reference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Order</label>
                  <select
                    value={filters.sortOrder || "desc"}
                    onChange={(e) => handleFilterChange("sortOrder", e.target.value as "asc" | "desc")}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          </section>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E73FF]" />
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : (
            <>
              {/* Transactions Table */}
              <section className="rounded-xl bg-white shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => {
                          const formatted = formatTransactionForTable(tx)
                          return (
                            <tr key={tx._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                {formatted.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatted.customer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatted.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                {tx.method?.toLowerCase().replace('_', ' ') || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  formatted.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : formatted.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {formatted.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatted.date}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="size-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
