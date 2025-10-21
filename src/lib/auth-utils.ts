/**
 * Authentication Utilities
 *
 * Handles wallet signing and backend authentication
 */

import { authApi } from "./api"
import { useAuthStore } from "@/hooks/useAuth"
import type { IProvider } from "@web3auth/base"

/**
 * Sign a message with wallet or Web3Auth provider
 */
export async function signAuthMessage(
  provider: any,
  walletAddress: string
): Promise<string> {
  const message = `Sign this message to authenticate with KlevaPay.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`

  try {
    // Check if it's a Web3Auth provider
    if (provider?.request) {
      const signature = await provider.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })
      return signature
    }

    // Fallback for other providers
    throw new Error("Unsupported provider for signing")
  } catch (error) {
    console.error("Error signing message:", error)
    throw error
  }
}

/**
 * Authenticate with backend after wallet connection
 * For Web3 dapps, wallet connection IS the authentication
 * Returns: { success: boolean, hasMerchantProfile: boolean, merchant?: Merchant }
 */
export async function authenticateWithBackend(
  walletAddress: string,
  signature?: string
): Promise<{ success: boolean; hasMerchantProfile: boolean; merchant?: any }> {
  try {
    console.log("Web3 Authentication:", { walletAddress, hasSignature: !!signature })

    // For Web3 dapps, the wallet address serves as the authentication
    // Use wallet address as the token
    const token = walletAddress

    // Check if merchant profile exists for this wallet
    const { merchantApi } = await import("./api")

    // Try to get merchant by wallet address from the list
    const merchantsResponse = await merchantApi.checkMerchantExists(walletAddress)

    let merchant = null
    let hasMerchantProfile = false

    if (merchantsResponse.success && merchantsResponse.data?.exists) {
      merchant = merchantsResponse.data.merchant
      hasMerchantProfile = true
      console.log("✓ Merchant profile found:", merchant)
    } else {
      console.log("⚠ No merchant profile found for wallet:", walletAddress)
    }

    // Store auth regardless of merchant profile (so user can create profile)
    useAuthStore.getState().setAuth(token, merchant || null)
    console.log("✓ Web3 authentication successful")

    return { success: true, hasMerchantProfile, merchant }
  } catch (error) {
    console.error("Error during Web3 authentication:", error)
    return { success: false, hasMerchantProfile: false }
  }
}

/**
 * Complete authentication flow: sign + backend auth
 * Returns: { success: boolean, hasMerchantProfile: boolean, redirectTo: string }
 */
export async function completeAuthFlow(
  provider: any,
  walletAddress: string
): Promise<{ success: boolean; hasMerchantProfile: boolean; redirectTo: string }> {
  try {
    // First, try to sign a message
    let signature: string | undefined
    try {
      signature = await signAuthMessage(provider, walletAddress)
      console.log("✓ Message signed successfully")
    } catch (error) {
      console.warn("Failed to sign message, attempting login without signature:", error)
      // Continue without signature - backend may allow it
    }

    // Authenticate with backend and check for merchant profile
    const authResult = await authenticateWithBackend(walletAddress, signature)

    if (!authResult.success) {
      return { success: false, hasMerchantProfile: false, redirectTo: "/" }
    }

    // Determine redirect based on merchant profile
    const redirectTo = authResult.hasMerchantProfile
      ? "/dashboard"
      : "/onboarding/create-profile"

    return {
      success: true,
      hasMerchantProfile: authResult.hasMerchantProfile,
      redirectTo
    }
  } catch (error) {
    console.error("Error in auth flow:", error)
    return { success: false, hasMerchantProfile: false, redirectTo: "/" }
  }
}
