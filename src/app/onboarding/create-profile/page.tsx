"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAccount } from "wagmi"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { merchantApi, type CreateMerchantData } from "@/lib/api"
import toast, { Toaster } from "react-hot-toast"

export default function CreateProfilePage() {
  const router = useRouter()
  const { token, isAuthenticated, merchant } = useAuth()
  const { isConnected: walletConnected, address: wagmiAddress } = useAccount()
  const { isConnected: w3aConnected, provider: w3aProvider } = useWeb3Auth()
  const [loading, setLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")

  const isConnected = walletConnected || w3aConnected

  // Get wallet address from wagmi or web3auth
  useEffect(() => {
    const getWalletAddress = async () => {
      if (wagmiAddress) {
        setWalletAddress(wagmiAddress)
      } else if (w3aConnected && w3aProvider) {
        try {
          const accounts = await w3aProvider.request({
            method: "eth_accounts",
          }) as string[]
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (error) {
          console.error("Error getting wallet address:", error)
        }
      } else if (token) {
        // Fallback to token which is the wallet address
        setWalletAddress(token)
      }
    }

    getWalletAddress()
  }, [wagmiAddress, w3aConnected, w3aProvider, token])

  // Redirect if wallet is not connected
  useEffect(() => {
    if (!isConnected && !isAuthenticated) {
      console.log("[CreateProfile] No wallet connected, redirecting to home...")
      router.push("/")
    }
  }, [isConnected, isAuthenticated, router])

  // Redirect to dashboard if merchant already exists
  useEffect(() => {
    if (merchant) {
      console.log("[CreateProfile] Merchant already exists, redirecting to dashboard...")
      router.push("/dashboard/merchant")
    }
  }, [merchant, router])

  const [formData, setFormData] = useState<CreateMerchantData>({
    businessName: "",
    country: "",
    walletAddress: "",
    payoutPreferences: {
      currency: "USD",
      method: "crypto",
    },
  })

  // Update wallet address in form when it's available
  useEffect(() => {
    if (walletAddress && !formData.walletAddress) {
      setFormData(prev => ({
        ...prev,
        walletAddress: walletAddress
      }))
    }
  }, [walletAddress, formData.walletAddress])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.startsWith("payout.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        payoutPreferences: {
          ...prev.payoutPreferences,
          [field]: value,
        },
      }))
    } else if (name.startsWith("account.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        payoutPreferences: {
          ...prev.payoutPreferences,
          accountDetails: {
            ...prev.payoutPreferences.accountDetails,
            [field]: value,
          } as any,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName || !formData.country) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.payoutPreferences.method === "bank_transfer") {
      const { accountDetails } = formData.payoutPreferences
      if (!accountDetails?.bankName || !accountDetails?.accountNumber || !accountDetails?.accountName) {
        toast.error("Please fill in all bank account details")
        return
      }
    }

    setLoading(true)
    try {
      const response = await merchantApi.createMerchant(formData)

      if (response.success && response.data) {
        toast.success("Business profile created successfully!")

        // Update auth store with new merchant data
        const { useAuthStore } = await import("@/hooks/useAuth")
        useAuthStore.getState().updateMerchant(response.data)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard/merchant")
        }, 1500)
      } else {
        // Handle different error responses
        const errorCode = response.error?.code || ""
        const errorMessage = response.error?.message || "Failed to create profile"

        console.log("[CreateProfile] Error:", { code: errorCode, message: errorMessage })

        // Provide user-friendly error messages based on status code or message
        if (errorCode === "HTTP_409" || errorCode.includes("409") || errorMessage.includes("already linked") || errorMessage.includes("already exists")) {
          toast.error("This wallet address is already linked to a business. Redirecting to your dashboard...")
          // Redirect to dashboard after showing error
          setTimeout(() => {
            router.push("/dashboard/merchant")
          }, 2000)
        } else if (errorCode === "HTTP_400" || errorMessage.includes("Wallet address is required")) {
          toast.error("Wallet address is missing. Please reconnect your wallet and try again.")
        } else if (errorMessage.includes("required") || errorMessage.includes("validation")) {
          toast.error("Please fill in all required fields.")
        } else if (errorCode === "HTTP_500" || errorCode.includes("500")) {
          toast.error("Server error. Please try again later.")
        } else {
          // Show the actual error message from the server
          toast.error(errorMessage || "Failed to create business profile. Please try again.")
        }
      }
    } catch (error: any) {
      console.error("Error creating merchant profile:", error)

      // Parse error message from caught error
      const errorMessage = error?.message || error?.toString() || "An unexpected error occurred"

      if (errorMessage.includes("409") || errorMessage.includes("Conflict") || errorMessage.includes("already")) {
        toast.error("This wallet address is already linked to a business. Redirecting to your dashboard...")
        setTimeout(() => {
          router.push("/dashboard/merchant")
        }, 2000)
      } else if (errorMessage.includes("400") || errorMessage.includes("validation")) {
        toast.error("Please check your input and try again.")
      } else if (errorMessage.includes("500")) {
        toast.error("Server error. Please try again later.")
      } else {
        toast.error("An error occurred while creating your profile. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const showBankFields = formData.payoutPreferences.method === "bank_transfer"

  // Show loading state while checking connection
  if (!isConnected && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking wallet connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Business Profile</h1>
          <p className="text-gray-600 mt-2">Set up your merchant account to start accepting payments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Business Information</h2>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select country</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>

            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                id="walletAddress"
                value={formData.walletAddress}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Your connected wallet address</p>
            </div>
          </div>

          {/* Payout Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Payout Preferences</h2>

            <div>
              <label htmlFor="payout.currency" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Currency <span className="text-red-500">*</span>
              </label>
              <select
                id="payout.currency"
                name="payout.currency"
                value={formData.payoutPreferences.currency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
                <option value="USDT">USDT</option>
              </select>
            </div>

            <div>
              <label htmlFor="payout.method" className="block text-sm font-medium text-gray-700 mb-1">
                Payout Method <span className="text-red-500">*</span>
              </label>
              <select
                id="payout.method"
                name="payout.method"
                value={formData.payoutPreferences.method}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="crypto">Cryptocurrency</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Bank Account Details (conditional) */}
            {showBankFields && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900">Bank Account Details</h3>

                <div>
                  <label htmlFor="account.bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="account.bankName"
                    name="account.bankName"
                    value={formData.payoutPreferences.accountDetails?.bankName || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label htmlFor="account.accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="account.accountNumber"
                    name="account.accountNumber"
                    value={formData.payoutPreferences.accountDetails?.accountNumber || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label htmlFor="account.accountName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="account.accountName"
                    name="account.accountName"
                    value={formData.payoutPreferences.accountDetails?.accountName || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account name"
                  />
                </div>

                <div>
                  <label htmlFor="account.routingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="account.routingNumber"
                    name="account.routingNumber"
                    value={formData.payoutPreferences.accountDetails?.routingNumber || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter routing number (if applicable)"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile..." : "Create Business Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
