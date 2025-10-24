/**
 * Payment Intents API
 */

import { apiClient } from "./client"
import type { ApiResponse } from "@/types"

export interface PaymentIntent {
  id: string
  merchantId: string
  amount: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed" | "canceled"
  description?: string
  metadata?: Record<string, any>
  customerId?: string
  paymentMethod?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface CreatePaymentIntentData {
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, any>
  customerId?: string
  paymentMethod?: string
  returnUrl?: string
  cancelUrl?: string
}

export interface UpdatePaymentIntentData {
  amount?: number
  description?: string
  metadata?: Record<string, any>
}

export interface PaymentIntentListParams {
  page?: number
  limit?: number
  status?: string
  customerId?: string
  startDate?: string
  endDate?: string
}

export const paymentIntentsApi = {
  /**
   * Create a new payment intent
   */
  create: async (data: CreatePaymentIntentData, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>("/api/payment-intents", data, token)
  },

  /**
   * Get a payment intent by ID
   */
  getById: async (id: string, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.get<PaymentIntent>(`/api/payment-intents/${id}`, token)
  },

  /**
   * List all payment intents
   */
  list: async (params: PaymentIntentListParams, token: string): Promise<ApiResponse<{ data: PaymentIntent[], total: number }>> => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
    return apiClient.get<{ data: PaymentIntent[], total: number }>(`/api/payment-intents?${queryParams.toString()}`, token)
  },

  /**
   * Update a payment intent
   */
  update: async (id: string, data: UpdatePaymentIntentData, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.patch<PaymentIntent>(`/api/payment-intents/${id}`, data, token)
  },

  /**
   * Cancel a payment intent
   */
  cancel: async (id: string, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>(`/api/payment-intents/${id}/cancel`, {}, token)
  },

  /**
   * Confirm a payment intent
   */
  confirm: async (id: string, token: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiClient.post<PaymentIntent>(`/api/payment-intents/${id}/confirm`, {}, token)
  },
}
