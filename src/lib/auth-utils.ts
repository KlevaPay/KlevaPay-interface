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

  console.log("[Sign Message] Provider type:", {
    hasRequest: !!provider?.request,
    hasSignMessage: !!provider?.signMessage,
    hasAccount: !!provider?.account,
    providerKeys: Object.keys(provider || {})
  })

  try {
    // Check if it's a wagmi WalletClient (has signMessage method)
    if (provider?.signMessage) {
      console.log("[Sign Message] Using WalletClient signMessage method")
      const signature = await provider.signMessage({
        account: walletAddress as `0x${string}`,
        message,
      })
      console.log("[Sign Message] ✓ Signature obtained via WalletClient")
      return signature
    }

    // Check if it's a Web3Auth provider (has request method)
    if (provider?.request) {
      console.log("[Sign Message] Using Web3Auth provider request method")
      const signature = await provider.request({
        method: "personal_sign",
        params: [message, walletAddress],
      })
      console.log("[Sign Message] ✓ Signature obtained via Web3Auth")
      return signature
    }

    // Fallback for other providers
    console.error("[Sign Message] Unsupported provider type")
    throw new Error("Unsupported provider for signing")
  } catch (error) {
    console.error("[Sign Message] Error signing message:", error)
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
    console.log("[Backend Auth] Starting backend authentication:", { walletAddress, hasSignature: !!signature })

    // For Web3 dapps, the wallet address serves as the authentication
    // Use wallet address as the token
    const token = walletAddress

    // Check if merchant profile exists for this wallet
    console.log("[Backend Auth] Importing merchant API...")
    const { merchantApi } = await import("./api")

    // Try to get merchant by wallet address from the list
    console.log("[Backend Auth] Checking if merchant exists for wallet:", walletAddress)
    const merchantsResponse = await merchantApi.checkMerchantExists(walletAddress)
    console.log("[Backend Auth] Merchant check response:", merchantsResponse)

    let merchant = null
    let hasMerchantProfile = false

    if (merchantsResponse.success && merchantsResponse.data?.exists) {
      merchant = merchantsResponse.data.merchant
      hasMerchantProfile = true
      console.log("[Backend Auth] ✓ Merchant profile found:", merchant)
    } else {
      console.log("[Backend Auth] ⚠ No merchant profile found for wallet:", walletAddress)
    }

    // Store auth regardless of merchant profile (so user can create profile)
    console.log("[Backend Auth] Storing auth in state...")
    useAuthStore.getState().setAuth(token, merchant || null)
    console.log("[Backend Auth] ✓ Web3 authentication successful")

    return { success: true, hasMerchantProfile, merchant }
  } catch (error) {
    console.error("[Backend Auth] Error during Web3 authentication:", error)
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
  console.log("[Auth Flow] Starting authentication flow for:", walletAddress)

  try {
    // First, try to sign a message
    let signature: string | undefined
    try {
      console.log("[Auth Flow] Attempting to sign message...")
      signature = await signAuthMessage(provider, walletAddress)
      console.log("[Auth Flow] ✓ Message signed successfully")
    } catch (error) {
      console.warn("[Auth Flow] Failed to sign message, attempting login without signature:", error)
      // Continue without signature - backend may allow it
    }

    // Authenticate with backend and check for merchant profile
    console.log("[Auth Flow] Authenticating with backend...")
    const authResult = await authenticateWithBackend(walletAddress, signature)

    if (!authResult.success) {
      console.error("[Auth Flow] Backend authentication failed")
      return { success: false, hasMerchantProfile: false, redirectTo: "/" }
    }

    // Determine redirect based on merchant profile
    const redirectTo = authResult.hasMerchantProfile
      ? "/dashboard/merchant"
      : "/onboarding/create-profile"

    console.log("[Auth Flow] ✓ Authentication complete:", {
      hasMerchantProfile: authResult.hasMerchantProfile,
      redirectTo
    })

    return {
      success: true,
      hasMerchantProfile: authResult.hasMerchantProfile,
      redirectTo
    }
  } catch (error) {
    console.error("[Auth Flow] Error in auth flow:", error)
    return { success: false, hasMerchantProfile: false, redirectTo: "/" }
  }
}
