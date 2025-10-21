"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useEffect, useState } from "react"
import { paymentIntentsApi, type PaymentIntent } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function PaymentIntentsPage() {
  const { token } = useAuth()
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const fetchPaymentIntents = async () => {
      if (!token) return

      setLoading(true)
      const response = await paymentIntentsApi.list({ page: 1, limit: 50 }, token)
      if (response.success && response.data) {
        setPaymentIntents(response.data.data)
      }
      setLoading(false)
    }

    fetchPaymentIntents()
  }, [token])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 bg-green-50"
      case "processing":
        return "text-blue-600 bg-blue-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "failed":
        return "text-red-600 bg-red-50"
      case "canceled":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[24px] font-semibold text-foreground">Payment Intents</h1>
                <p className="text-[13px] text-foreground/70">Manage and track payment intents</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Payment Intent
              </button>
            </div>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {loading ? (
            <div className="text-sm text-foreground/60">Loading payment intents...</div>
          ) : (
            <section className="rounded-xl bg-white shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border">
                    {paymentIntents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-foreground/60">
                          No payment intents found. Create one to get started.
                        </td>
                      </tr>
                    ) : (
                      paymentIntents.map((intent) => (
                        <tr key={intent.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground">
                            {intent.id.substring(0, 12)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {intent.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground uppercase">
                            {intent.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(intent.status)}`}>
                              {intent.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground/70">
                            {intent.description || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                            {new Date(intent.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
