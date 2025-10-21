/**
 * Payments API
 */

import { apiClient } from "./client"
import type { ApiResponse, PaymentIntent, PaymentIntentForm, Transaction, PaginatedResponse } from "@/types"

export const paymentsApi = {
  /**
   * Create a new payment intent
   */
  createPaymentIntent: async (
    data: PaymentIntentForm,
    token: string
  ): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>("/api/payment-intents", data, token)
  },

  /**
   * Get payment intent by ID
   */
  getPaymentIntent: async (id: string, token?: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.get<PaymentIntent>(`/api/payment-intents/${id}`, token)
  },

  /**
   * Get all payment intents for merchant
   */
  getPaymentIntents: async (
    token: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<PaymentIntent>>> => {
    return apiClient.get<PaginatedResponse<PaymentIntent>>(
      `/api/payment-intents?page=${page}&limit=${limit}`,
      token
    )
  },

  /**
   * Cancel a payment intent
   */
  cancelPaymentIntent: async (id: string, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>(`/api/payment-intents/${id}/cancel`, {}, token)
  },

  /**
   * Confirm payment (for manual confirmations)
   */
  confirmPayment: async (
    id: string,
    data: { transactionHash?: string; providerReference?: string },
    token: string
  ): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>(`/api/payment-intents/${id}/confirm`, data, token)
  },
}
