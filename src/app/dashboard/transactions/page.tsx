"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { TransactionsTable } from "@/ui/modules/block/dashboard/transactions-table"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { transactionsApi, type TransactionFilters } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import type { Transaction } from "@/types"
import { PaymentStatus } from "@/types"
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react"

export default function TransactionsPage() {
  const { token, isAuthenticated, merchant } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

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

  // Map PaymentStatus to table status
  const mapStatusToTableStatus = (status: PaymentStatus): "Completed" | "Processing" | "Failed" => {
    switch (status) {
      case PaymentStatus.PAID:
      case PaymentStatus.SETTLED:
        return "Completed"
      case PaymentStatus.PENDING:
      case PaymentStatus.PROCESSING:
        return "Processing"
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
      case PaymentStatus.REFUNDED:
        return "Failed"
      default:
        return "Processing"
    }
  }

  // Format transaction data for table
  const formatTransactionForTable = (tx: Transaction) => ({
    id: tx.id,
    customer: tx.customerName || tx.customerEmail || "N/A",
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

          {/* Filters and Search */}
          <section className="bg-white rounded-xl shadow-sm border border-border p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 w-full md:w-auto">
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
                  <option value="SETTLED">Settled</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>

                <Button variant="outline" onClick={handleExport}>
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
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
              <section>
                <TransactionsTable
                  items={transactions.map(formatTransactionForTable)}
                />
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
