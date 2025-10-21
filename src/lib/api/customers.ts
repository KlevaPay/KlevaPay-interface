/**
 * Customers API
 */

import { apiClient } from "./client"
import type { ApiResponse, Customer, PaginatedResponse } from "@/types"

export const customersApi = {
  /**
   * Get all customers
   */
  getCustomers: async (
    token: string,
    page = 1,
    limit = 20,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    return apiClient.get<PaginatedResponse<Customer>>(
      `/api/v1/customers?${params.toString()}`,
      token
    )
  },

  /**
   * Get customer by ID
   */
  getCustomer: async (id: string, token: string): Promise<ApiResponse<Customer>> => {
    return apiClient.get<Customer>(`/api/v1/customers/${id}`, token)
  },

  /**
   * Get customer statistics
   */
  getCustomerStats: async (token: string): Promise<
    ApiResponse<{
      totalCustomers: number
      activeCustomers: number
      averageTransactionValue: number
    }>
  > => {
    return apiClient.get(`/api/v1/customers/stats`, token)
  },
}
