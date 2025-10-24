/**
 * Merchant API
 */

import { apiClient } from "./client"
import type { ApiResponse, Merchant } from "@/types"

export interface MerchantStats {
  totalRevenue: number
  totalTransactions: number
  pendingTransactions: number
  successRate: number
}

export interface MerchantSettings {
  webhookUrl?: string
  callbackUrl?: string
  ipWhitelist?: string[]
  apiVersion?: string
}

export interface CreateMerchantData {
  businessName: string
  country: string
  walletAddress: string
  payoutPreferences: {
    currency: string
    method: "bank_transfer" | "crypto"
    accountDetails?: {
      bankName: string
      accountNumber: string
      accountName: string
      routingNumber?: string
    }
  }
}

export const merchantApi = {
  /**
   * Create merchant profile
   */
  createMerchant: async (data: CreateMerchantData): Promise<ApiResponse<Merchant>> => {
    return apiClient.post<Merchant>("/api/merchant", data)
  },

  /**
   * Check if merchant exists by wallet address
   * Uses the /api/merchant/wallet/{walletAddress} endpoint
   */
  checkMerchantExists: async (walletAddress: string): Promise<ApiResponse<{ exists: boolean; merchant?: Merchant }>> => {
    try {
      console.log("[MerchantAPI] Checking if merchant exists for wallet:", walletAddress)

      // Try to get merchant by wallet address
      const response = await apiClient.get<{ success: boolean; data: Merchant }>(`/api/merchant/wallet/${walletAddress}`)

      console.log("[MerchantAPI] Merchant check response:", response)

      if (response.success && response.data) {
        const merchantData = (response.data as any).data || response.data
        console.log("[MerchantAPI] ✓ Merchant exists:", merchantData)
        return {
          success: true,
          data: {
            exists: true,
            merchant: merchantData,
          },
        }
      }

      // If we get an error (404), merchant doesn't exist
      console.log("[MerchantAPI] ⚠ Merchant does not exist (no data in response)")
      return {
        success: true,
        data: { exists: false },
      }
    } catch (error) {
      // Error likely means merchant doesn't exist (404) or API is down
      console.log("[MerchantAPI] ⚠ Error checking merchant (likely doesn't exist):", error)
      return {
        success: true,
        data: { exists: false },
      }
    }
  },

  /**
   * Get merchant profile by wallet address
   */
  getProfile: async (walletAddress: string): Promise<ApiResponse<Merchant>> => {
    const response = await apiClient.get<any>(`/api/merchant/wallet/${walletAddress}`)

    // Backend returns { success: true, data: {...} }, extract the data
    if (response.success && response.data) {
      const merchantData = response.data.data || response.data
      return {
        success: true,
        data: merchantData,
      }
    }

    return {
      success: false,
      error: response.error || { code: "UNKNOWN_ERROR", message: "Failed to fetch merchant profile" }
    }
  },

  /**
   * Get merchant profile (legacy - uses token)
   */
  getProfileByToken: async (token: string): Promise<ApiResponse<Merchant>> => {
    return apiClient.get<Merchant>("/api/merchant/profile", token)
  },

  /**
   * Update merchant profile
   */
  updateProfile: async (data: Partial<Merchant>, token: string): Promise<ApiResponse<Merchant>> => {
    return apiClient.put<Merchant>("/api/merchant/profile", data, token)
  },

  /**
   * Get merchant statistics
   */
  getStats: async (walletAddress: string): Promise<ApiResponse<MerchantStats>> => {
    return apiClient.get<MerchantStats>(`/api/transactions/wallet/${walletAddress}/stats`, walletAddress)
  },

  /**
   * Get merchant settings
   */
  getSettings: async (token: string): Promise<ApiResponse<MerchantSettings>> => {
    return apiClient.get<MerchantSettings>("/api/merchant/settings", token)
  },

  /**
   * Update merchant settings
   */
  updateSettings: async (data: Partial<MerchantSettings>, token: string): Promise<ApiResponse<MerchantSettings>> => {
    return apiClient.put<MerchantSettings>("/api/merchant/settings", data, token)
  },

  /**
   * Get API keys
   */
  getApiKeys: async (token: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>("/api/merchant/api-keys", token)
  },

  /**
   * Generate new API key
   */
  generateApiKey: async (name: string, token: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>("/api/merchant/api-keys", { name }, token)
  },

  /**
   * Revoke API key
   */
  revokeApiKey: async (keyId: string, token: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/merchant/api-keys/${keyId}`, token)
  },
}
