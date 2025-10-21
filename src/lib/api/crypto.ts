/**
 * Crypto API
 */

import { apiClient } from "./client"
import type { ApiResponse } from "@/types"

export interface CryptoPrice {
  symbol: string
  name: string
  price: number
  currency: string
  change24h: number
  changePercent24h: number
  marketCap?: number
  volume24h?: number
  lastUpdated: string
}

export interface CryptoWallet {
  id: string
  merchantId: string
  address: string
  network: string
  balance: number
  symbol: string
  isActive: boolean
  createdAt: string
}

export interface CryptoTransaction {
  id: string
  walletId: string
  txHash: string
  network: string
  from: string
  to: string
  amount: number
  symbol: string
  status: "pending" | "confirmed" | "failed"
  confirmations: number
  createdAt: string
}

export interface CreateWalletData {
  network: string
  symbol: string
}

export const cryptoApi = {
  /**
   * Get cryptocurrency prices
   */
  getPrices: async (symbols?: string[], token?: string): Promise<ApiResponse<CryptoPrice[]>> => {
    const queryParams = symbols?.length ? `?symbols=${symbols.join(",")}` : ""
    return apiClient.get<CryptoPrice[]>(`/api/crypto/prices${queryParams}`, token)
  },

  /**
   * Get a specific cryptocurrency price
   */
  getPrice: async (symbol: string, token?: string): Promise<ApiResponse<CryptoPrice>> => {
    return apiClient.get<CryptoPrice>(`/api/crypto/prices/${symbol}`, token)
  },

  /**
   * Get merchant crypto wallets
   */
  getWallets: async (token: string): Promise<ApiResponse<CryptoWallet[]>> => {
    return apiClient.get<CryptoWallet[]>("/api/crypto/wallets", token)
  },

  /**
   * Get a specific wallet
   */
  getWallet: async (walletId: string, token: string): Promise<ApiResponse<CryptoWallet>> => {
    return apiClient.get<CryptoWallet>(`/api/crypto/wallets/${walletId}`, token)
  },

  /**
   * Create a new crypto wallet
   */
  createWallet: async (data: CreateWalletData, token: string): Promise<ApiResponse<CryptoWallet>> => {
    return apiClient.post<CryptoWallet>("/api/crypto/wallets", data, token)
  },

  /**
   * Get wallet balance
   */
  getWalletBalance: async (walletId: string, token: string): Promise<ApiResponse<{ balance: number, symbol: string }>> => {
    return apiClient.get<{ balance: number, symbol: string }>(`/api/crypto/wallets/${walletId}/balance`, token)
  },

  /**
   * Get crypto transactions
   */
  getTransactions: async (walletId?: string, token?: string): Promise<ApiResponse<CryptoTransaction[]>> => {
    const endpoint = walletId ? `/api/crypto/transactions?walletId=${walletId}` : "/api/crypto/transactions"
    return apiClient.get<CryptoTransaction[]>(endpoint, token)
  },

  /**
   * Get a specific transaction
   */
  getTransaction: async (txId: string, token: string): Promise<ApiResponse<CryptoTransaction>> => {
    return apiClient.get<CryptoTransaction>(`/api/crypto/transactions/${txId}`, token)
  },

  /**
   * Get supported networks
   */
  getSupportedNetworks: async (token?: string): Promise<ApiResponse<string[]>> => {
    return apiClient.get<string[]>("/api/crypto/networks", token)
  },

  /**
   * Get supported cryptocurrencies
   */
  getSupportedCurrencies: async (token?: string): Promise<ApiResponse<string[]>> => {
    return apiClient.get<string[]>("/api/crypto/currencies", token)
  },
}
