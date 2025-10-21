/**
 * KlevaPay API Client
 * Base URL: https://backend-klevapay.onrender.com
 */

import type { ApiResponse } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-klevapay.onrender.com"

interface RequestOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { token, ...fetchOptions } = options

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add existing headers
    if (fetchOptions.headers) {
      const existingHeaders = fetchOptions.headers as Record<string, string>
      Object.assign(headers, existingHeaders)
    }

    // Add authorization header if token is provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Remove trailing slash from baseUrl and leading slash from endpoint to prevent double slashes
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, '')
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    try {
      const response = await fetch(`${cleanBaseUrl}${cleanEndpoint}`, {
        ...fetchOptions,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || `HTTP_${response.status}`,
            message: data.message || response.statusText,
          },
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error: any) {
      console.error("API Request Error:", error)
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error.message || "Failed to connect to the server",
        },
      }
    }
  }

  // GET request
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", token })
  }

  // POST request
  async post<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    })
  }

  // PUT request
  async put<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      token,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", token })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
