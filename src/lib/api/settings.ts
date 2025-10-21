/**
 * Settings API
 */

import { apiClient } from "./client"
import type { ApiResponse, PayoutPreference, ApiKey, Webhook, WebhookEventType } from "@/types"

export const settingsApi = {
  /**
   * Get payout preferences
   */
  getPayoutPreferences: async (token: string): Promise<ApiResponse<PayoutPreference>> => {
    return apiClient.get<PayoutPreference>("/api/v1/settings/payout", token)
  },

  /**
   * Update payout preferences
   */
  updatePayoutPreferences: async (
    data: Partial<PayoutPreference>,
    token: string
  ): Promise<ApiResponse<PayoutPreference>> => {
    return apiClient.put<PayoutPreference>("/api/v1/settings/payout", data, token)
  },

  /**
   * Get all API keys
   */
  getApiKeys: async (token: string): Promise<ApiResponse<ApiKey[]>> => {
    return apiClient.get<ApiKey[]>("/api/v1/settings/api-keys", token)
  },

  /**
   * Create new API key
   */
  createApiKey: async (name: string, token: string): Promise<ApiResponse<ApiKey>> => {
    return apiClient.post<ApiKey>("/api/v1/settings/api-keys", { name }, token)
  },

  /**
   * Delete API key
   */
  deleteApiKey: async (id: string, token: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/v1/settings/api-keys/${id}`, token)
  },

  /**
   * Regenerate API key
   */
  regenerateApiKey: async (id: string, token: string): Promise<ApiResponse<ApiKey>> => {
    return apiClient.post<ApiKey>(`/api/v1/settings/api-keys/${id}/regenerate`, {}, token)
  },

  /**
   * Get all webhooks
   */
  getWebhooks: async (token: string): Promise<ApiResponse<Webhook[]>> => {
    return apiClient.get<Webhook[]>("/api/v1/settings/webhooks", token)
  },

  /**
   * Create webhook
   */
  createWebhook: async (
    data: { url: string; events: WebhookEventType[] },
    token: string
  ): Promise<ApiResponse<Webhook>> => {
    return apiClient.post<Webhook>("/api/v1/settings/webhooks", data, token)
  },

  /**
   * Update webhook
   */
  updateWebhook: async (
    id: string,
    data: { url?: string; events?: WebhookEventType[]; isActive?: boolean },
    token: string
  ): Promise<ApiResponse<Webhook>> => {
    return apiClient.put<Webhook>(`/api/v1/settings/webhooks/${id}`, data, token)
  },

  /**
   * Delete webhook
   */
  deleteWebhook: async (id: string, token: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/api/v1/settings/webhooks/${id}`, token)
  },

  /**
   * Test webhook
   */
  testWebhook: async (id: string, token: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.post<{ success: boolean }>(`/api/v1/settings/webhooks/${id}/test`, {}, token)
  },
}
