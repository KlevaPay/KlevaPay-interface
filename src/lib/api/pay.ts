/**
 * Pay API - Payment Processing
 */

import { apiClient } from "./client"
import type { ApiResponse } from "@/types"

export interface PaymentRequest {
  id: string
  merchantId: string
  amount: number
  currency: string
  cryptoCurrency?: string
  cryptoAmount?: number
  paymentIntentId?: string
  status: "pending" | "processing" | "completed" | "failed" | "expired"
  paymentMethod: "crypto" | "card" | "bank_transfer"
  customerEmail?: string
  customerName?: string
  description?: string
  metadata?: Record<string, any>
  paymentUrl?: string
  qrCode?: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentData {
  amount: number
  currency: string
  cryptoCurrency?: string
  paymentMethod?: "crypto" | "card" | "bank_transfer"
  customerEmail?: string
  customerName?: string
  description?: string
  metadata?: Record<string, any>
  returnUrl?: string
  cancelUrl?: string
  webhookUrl?: string
}

export interface VerifyPaymentResponse {
  verified: boolean
  payment: PaymentRequest
  txHash?: string
  confirmations?: number
}

export const payApi = {
  /**
   * Create a payment request
   */
  createPayment: async (data: CreatePaymentData, token: string): Promise<ApiResponse<PaymentRequest>> => {
    return apiClient.post<PaymentRequest>("/api/pay", data, token)
  },

  /**
   * Get a payment by ID
   */
  getPayment: async (paymentId: string, token?: string): Promise<ApiResponse<PaymentRequest>> => {
    return apiClient.get<PaymentRequest>(`/api/pay/${paymentId}`, token)
  },

  /**
   * Verify a payment
   */
  verifyPayment: async (paymentId: string, token?: string): Promise<ApiResponse<VerifyPaymentResponse>> => {
    return apiClient.get<VerifyPaymentResponse>(`/api/pay/${paymentId}/verify`, token)
  },

  /**
   * Cancel a payment
   */
  cancelPayment: async (paymentId: string, token: string): Promise<ApiResponse<PaymentRequest>> => {
    return apiClient.post<PaymentRequest>(`/api/pay/${paymentId}/cancel`, {}, token)
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId: string, token?: string): Promise<ApiResponse<{ status: string, payment: PaymentRequest }>> => {
    return apiClient.get<{ status: string, payment: PaymentRequest }>(`/api/pay/${paymentId}/status`, token)
  },

  /**
   * List all payment requests
   */
  listPayments: async (params: { page?: number, limit?: number, status?: string }, token: string): Promise<ApiResponse<{ data: PaymentRequest[], total: number }>> => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
    return apiClient.get<{ data: PaymentRequest[], total: number }>(`/api/pay?${queryParams.toString()}`, token)
  },

  /**
   * Generate QR code for payment
   */
  generateQRCode: async (paymentId: string, token?: string): Promise<ApiResponse<{ qrCode: string }>> => {
    return apiClient.get<{ qrCode: string }>(`/api/pay/${paymentId}/qr-code`, token)
  },
}
