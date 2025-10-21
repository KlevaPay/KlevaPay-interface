"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useState } from "react"
import { payApi, type CreatePaymentData } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import toast, { Toaster } from "react-hot-toast"

export default function QuickPayPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreatePaymentData>({
    amount: 0,
    currency: "USD",
    paymentMethod: "crypto",
    customerEmail: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }))
  }

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Please sign in to create a payment")
      return
    }

    if (formData.amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setLoading(true)
    try {
      const response = await payApi.createPayment(formData, token)

      if (response.success && response.data) {
        setPaymentUrl(response.data.paymentUrl || null)
        setQrCode(response.data.qrCode || null)
        toast.success("Payment created successfully!")
      } else {
        toast.error(`Failed to create payment: ${response.error?.message}`)
      }
    } catch (error) {
      console.error("Error creating payment:", error)
      toast.error("An error occurred while creating the payment")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      amount: 0,
      currency: "USD",
      paymentMethod: "crypto",
      customerEmail: "",
      description: "",
    })
    setPaymentUrl(null)
    setQrCode(null)
  }

  return (
    <div className="min-h-screen w-full flex">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Quick Pay</h1>
            <p className="text-[13px] text-foreground/70">Create instant payment links and QR codes</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Form */}
            <section className="rounded-xl bg-white shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Create Payment</h2>

              <form onSubmit={handleCreatePayment} className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-foreground/70 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount || ""}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-foreground/70 mb-1">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cryptoCurrency" className="block text-sm font-medium text-foreground/70 mb-1">
                    Crypto Currency (Optional)
                  </label>
                  <select
                    id="cryptoCurrency"
                    name="cryptoCurrency"
                    value={formData.cryptoCurrency || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-foreground/70 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="crypto">Cryptocurrency</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-foreground/70 mb-1">
                    Customer Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-foreground/70 mb-1">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground/70 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Payment"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            {/* Payment Result */}
            <section className="rounded-xl bg-white shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Details</h2>

              {paymentUrl || qrCode ? (
                <div className="space-y-4">
                  {paymentUrl && (
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        Payment URL
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-border">
                        <p className="text-sm text-foreground break-all">{paymentUrl}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(paymentUrl)
                          toast.success("Payment URL copied to clipboard!")
                        }}
                        className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Copy URL
                      </button>
                    </div>
                  )}

                  {qrCode && (
                    <div>
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        QR Code
                      </label>
                      <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-border">
                        <img src={qrCode} alt="Payment QR Code" className="w-64 h-64" />
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Share this payment link or QR code with your customer to receive payment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-sm text-foreground/60">
                  Create a payment to see the payment URL and QR code
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
