/**
 * Transactions API
 */

import { apiClient } from "./client"
import type { ApiResponse, Transaction, PaginatedResponse, TransactionType, PaymentStatus } from "@/types"

export interface TransactionFilters {
  status?: PaymentStatus
  type?: TransactionType
  startDate?: string
  endDate?: string
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
