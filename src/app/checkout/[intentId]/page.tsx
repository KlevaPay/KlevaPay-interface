"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { CreditCard, Wallet, Building2, X, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import type { PaymentMethod, Currency } from "@/types"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const intentId = params.intentId as string

  const [paymentData, setPaymentData] = useState({
    merchantName: "Acme Store",
    amount: 150.0,
    currency: "USD" as Currency,
    description: "Premium Subscription - Annual Plan",
    orderId: "ORD-2023-12345",
  })

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState("")

  // Crypto payment state
  const [cryptoCurrency, setCryptoCurrency] = useState<"USDT" | "ETH">("USDT")
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")

  // Card payment state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  // Bank transfer state
  const [bankDetails, setBankDetails] = useState({
    accountName: "KlevaPay Merchant Account",
    accountNumber: "0123456789",
    bankName: "First Bank Nigeria",
  })

  useEffect(() => {
    // TODO: Fetch payment intent data from API
    // fetch(`/api/payment-intents/${intentId}`)
  }, [intentId])

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // TODO: Process payment based on selected method
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push(`/checkout/${intentId}/success`)
    } catch (error) {
      console.error("Payment failed:", error)
      router.push(`/checkout/${intentId}/failed`)
    } finally {
      setIsProcessing(false)
    }
  }

  const paymentMethods = [
    {
      id: "CARD" as PaymentMethod,
      name: "Card Payment",
      icon: CreditCard,
      description: "Pay with credit or debit card",
      processingTime: "Instant",
      fee: "2.9% + $0.30",
    },
    {
      id: "CRYPTO" as PaymentMethod,
      name: "Crypto Payment",
      icon: Wallet,
      description: "Pay with USDT or ETH",
      processingTime: "2-5 minutes",
      fee: "1.5%",
    },
    {
      id: "BANK_TRANSFER" as PaymentMethod,
      name: "Bank Transfer",
      icon: Building2,
      description: "Transfer from your bank account",
      processingTime: "10-30 minutes",
      fee: "₦50 flat",
    },
  ]

  const conversionRates = {
    USD: 1,
    NGN: 1650,
    USDT: 1,
    ETH: 0.00041,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E9086] to-[#073863] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">KlevaPay Checkout</h1>
          <p className="text-white/80">Secure payment powered by KlevaPay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Merchant</span>
                  <span className="font-medium text-gray-900">{paymentData.merchantName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-xs text-gray-900">{paymentData.orderId}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-sm font-medium text-gray-900">{paymentData.description}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Total Amount</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${paymentData.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      ≈ ₦{(paymentData.amount * conversionRates.NGN).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedMethod && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Processing Time:</strong>{" "}
                    {paymentMethods.find((m) => m.id === selectedMethod)?.processingTime}
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    <strong>Fee:</strong> {paymentMethods.find((m) => m.id === selectedMethod)?.fee}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {!selectedMethod ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Payment Method</h2>
                  <p className="text-sm text-gray-600 mb-6">Choose how you&apos;d like to pay</p>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#1E73FF] hover:bg-[#1E73FF]/5 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#1E73FF]/10 rounded-lg group-hover:bg-[#1E73FF]/20">
                            <method.icon className="size-6 text-[#1E73FF]" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="size-5 text-gray-400 group-hover:text-[#1E73FF]" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Back Button */}
                  <button
                    onClick={() => setSelectedMethod(null)}
                    className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    ← Back to payment methods
                  </button>

                  {/* Card Payment Form */}
                  {selectedMethod === "CARD" && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Payment</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Card Number
                          </label>
                          <Input
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) =>
                              setCardDetails({ ...cardDetails, number: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Expiry Date
                            </label>
                            <Input
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) =>
                                setCardDetails({ ...cardDetails, expiry: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                            <Input
                              placeholder="123"
                              type="password"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={(e) =>
                                setCardDetails({ ...cardDetails, cvv: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Cardholder Name
                          </label>
                          <Input
                            placeholder="John Doe"
                            value={cardDetails.name}
                            onChange={(e) =>
                              setCardDetails({ ...cardDetails, name: e.target.value })
                            }
                          />
                        </div>

                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white py-3"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay $${paymentData.amount.toFixed(2)}`
                          )}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Crypto Payment */}
                  {selectedMethod === "CRYPTO" && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Crypto Payment</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Cryptocurrency
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setCryptoCurrency("USDT")}
                              className={`p-4 border-2 rounded-lg transition-all ${
                                cryptoCurrency === "USDT"
                                  ? "border-[#1E73FF] bg-[#1E73FF]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <p className="font-semibold text-gray-900">USDT</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {paymentData.amount.toFixed(2)} USDT
                              </p>
                            </button>
                            <button
                              onClick={() => setCryptoCurrency("ETH")}
                              className={`p-4 border-2 rounded-lg transition-all ${
                                cryptoCurrency === "ETH"
                                  ? "border-[#1E73FF] bg-[#1E73FF]/5"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <p className="font-semibold text-gray-900">ETH</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {(paymentData.amount * conversionRates.ETH).toFixed(6)} ETH
                              </p>
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Send {cryptoCurrency} to:
                          </p>
                          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-3">
                            <p className="flex-1 font-mono text-xs text-gray-900 break-all">
                              {walletAddress}
                            </p>
                            <button
                              onClick={() => navigator.clipboard.writeText(walletAddress)}
                              className="shrink-0 text-[#1E73FF] hover:text-[#1E73FF]/80 text-xs font-medium"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Network: Polygon • Confirmations required: 12
                          </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-xs text-yellow-800">
                            <strong>Important:</strong> Send only {cryptoCurrency} on Polygon network to
                            this address. Sending other tokens or using wrong network will result in loss
                            of funds.
                          </p>
                        </div>

                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white py-3"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Confirming payment...
                            </>
                          ) : (
                            "I've sent the payment"
                          )}
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Bank Transfer */}
                  {selectedMethod === "BANK_TRANSFER" && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Transfer</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Transfer to this account:
                          </h3>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Account Name</span>
                              <span className="text-sm font-medium text-gray-900">
                                {bankDetails.accountName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Account Number</span>
                              <span className="text-sm font-mono font-medium text-gray-900">
                                {bankDetails.accountNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Bank Name</span>
                              <span className="text-sm font-medium text-gray-900">
                                {bankDetails.bankName}
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-sm text-gray-600">Amount</span>
                              <span className="text-lg font-bold text-gray-900">
                                ₦{(paymentData.amount * conversionRates.NGN).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-xs text-blue-800">
                            <strong>Note:</strong> After making the transfer, click the button below. Your
                            payment will be verified within 10-30 minutes.
                          </p>
                        </div>

                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white py-3"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="size-4 mr-2 animate-spin" />
                              Confirming payment...
                            </>
                          ) : (
                            "I've made the transfer"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Secure Badge */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-xs text-gray-600">
                  🔒 Secured by KlevaPay • Your payment information is encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
