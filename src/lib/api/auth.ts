/**
 * Authentication API
 */

import { apiClient } from "./client"
import type { ApiResponse, Merchant } from "@/types"

export interface AuthResponse {
  token: string
  merchant: Merchant
}

export interface RegisterData {
  walletAddress: string
  email: string
  businessName: string
  businessType?: string
  country: string
}

export interface LoginData {
  walletAddress: string
  signature?: string
}

export const authApi = {
  /**
   * Register a new merchant
   */
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>("/api/auth/register", data)
  },

  /**
   * Login with wallet address
   */
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>("/api/auth/login", data)
  },

  /**
   * Get current merchant profile
   */
  getProfile: async (token: string): Promise<ApiResponse<Merchant>> => {
    return apiClient.get<Merchant>("/api/auth/profile", token)
  },

  /**
   * Update merchant profile
   */
  updateProfile: async (data: Partial<Merchant>, token: string): Promise<ApiResponse<Merchant>> => {
    return apiClient.put<Merchant>("/api/auth/profile", data, token)
  },

  /**
   * Logout
   */
  logout: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>("/api/auth/logout", {}, token)
  },
}
