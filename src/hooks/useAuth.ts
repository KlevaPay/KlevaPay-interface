/**
 * Authentication Hook
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi, type AuthResponse, type RegisterData, type LoginData } from "@/lib/api"
import type { Merchant } from "@/types"

interface AuthState {
  token: string | null
  merchant: Merchant | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<AuthResponse | null>
  register: (data: RegisterData) => Promise<AuthResponse | null>
  logout: () => void
  updateMerchant: (merchant: Merchant) => void
  setAuth: (token: string, merchant: Merchant | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      merchant: null,
      isAuthenticated: false,

      setAuth: (token, merchant) => {
        set({ token, merchant, isAuthenticated: true })
      },

      login: async (data) => {
        const response = await authApi.login(data)
        if (response.success && response.data) {
          set({
            token: response.data.token,
            merchant: response.data.merchant,
            isAuthenticated: true,
          })
          return response.data
        }
        return null
      },

      register: async (data) => {
        const response = await authApi.register(data)
        if (response.success && response.data) {
          set({
            token: response.data.token,
            merchant: response.data.merchant,
            isAuthenticated: true,
          })
          return response.data
        }
        return null
      },

      logout: () => {
        const { token } = get()
        if (token) {
          authApi.logout(token)
        }
        set({ token: null, merchant: null, isAuthenticated: false })
      },

      updateMerchant: (merchant) => {
        set({ merchant })
      },
    }),
    {
      name: "klevapay-auth",
    }
  )
)

// Custom hook for easier usage
export const useAuth = () => {
  const store = useAuthStore()
  return {
    ...store,
    isLoading: false, // Add loading state if needed
  }
}
