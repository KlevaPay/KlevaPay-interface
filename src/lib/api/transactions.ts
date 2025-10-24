/**
 * Transactions API
 */

import { apiClient } from "./client"
import type { ApiResponse, Transaction, PaginatedResponse } from "@/types"

export interface TransactionFilters {
  status?: string       // PENDING, PAID, SETTLED, FAILED, SUCCESS, PROCESSING
  method?: string       // CARD, BANK, WALLET, CRYPTO, FIAT
  currency?: string     // NGN, USD, EUR, USDT, BTC, ETH
  startDate?: string    // YYYY-MM-DD
  endDate?: string      // YYYY-MM-DD
  sortBy?: string       // Field to sort by (default: createdAt)
  sortOrder?: "asc" | "desc"  // Sort order (default: desc)
}

export const transactionsApi = {
  /**
   * Get all transactions
   */
  getTransactions: async (
    token: string,
    page = 1,
    limit = 20,
    filters?: TransactionFilters
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    })

    return apiClient.get<PaginatedResponse<Transaction>>(
      `/api/transactions?${params.toString()}`,
      token
    )
  },

  /**
   * Get transactions by wallet address with pagination and filters
   * Matches response: { success, message, data: { merchant, transactions, pagination, summary, filters } }
   */
  getTransactionsByWallet: async (
    walletAddress: string,
    token: string,
    page = 1,
    limit = 20,
    filters?: TransactionFilters
  ): Promise<
    ApiResponse<
      {
        merchant: any
        transactions: Transaction[]
        pagination: { currentPage: number; totalPages: number; totalCount: number; limit: number; hasNextPage: boolean; hasPrevPage: boolean }
        summary: { totalAmount: number; totalTransactions: number; successfulTransactions: number; pendingTransactions: number; failedTransactions: number; totalSuccessfulAmount: number }
        filters?: any
      }
    >
  > => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters as any),
    })

    return apiClient.get(
      `/api/transactions/wallet/${walletAddress}?${params.toString()}`,
      token
    )
  },

  /**
   * Get transactions by wallet address
   */
  getTransaction: async (
    walletAddress: string,
    token: string
  ): Promise<ApiResponse<Transaction>> => {
    return apiClient.get<Transaction>(
      `/api/transactions/wallet/${walletAddress}`,
      token
    )
  },

  /**
   * Get recent transactions by wallet address
   * Returns the most recent transactions for quick overview
   */
  getRecentTransactions: async (
    walletAddress: string,
    token: string,
    limit?: number
  ): Promise<ApiResponse<{ transactions: Transaction[] }>> => {
    const params = limit ? `?limit=${limit}` : ""
    return apiClient.get<{ transactions: Transaction[] }>(
      `/api/transactions/wallet/${walletAddress}/recent${params}`,
      token
    )
  },

  /**
   * Export transactions to CSV
   */
  exportTransactions: async (
    token: string,
    filters?: TransactionFilters
  ): Promise<ApiResponse<{ downloadUrl: string }>> => {
    const params = new URLSearchParams(filters as any)
    return apiClient.get<{ downloadUrl: string }>(
      `/api/transactions/export?${params.toString()}`,
      token
    )
  },

  /**
   * Get transaction statistics
   */
  getStats: async (token: string, period?: "today" | "week" | "month" | "year"): Promise<
    ApiResponse<{
      totalRevenue: number
      totalTransactions: number
      successRate: number
      averageTransactionValue: number
    }>
  > => {
    const params = period ? `?period=${period}` : ""
    return apiClient.get(`/api/transactions/stats${params}`, token)
  },
}
