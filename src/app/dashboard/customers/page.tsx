"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { Suspense } from "react"
import { Search, Download, Filter } from "lucide-react"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"

export default function CustomersPage() {
  const customers = [
    {
      id: "CUST-001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      totalTransactions: 24,
      totalVolume: "$12,450.00",
      currency: "USD",
      lastPayment: "2023-08-15",
      status: "Active",
    },
    {
      id: "CUST-002",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      totalTransactions: 18,
      totalVolume: "$8,750.50",
      currency: "USDT",
      lastPayment: "2023-08-14",
      status: "Active",
    },
    {
      id: "CUST-003",
      name: "Michael Brown",
      email: "m.brown@example.com",
      totalTransactions: 31,
      totalVolume: "₦4,325,000",
      currency: "NGN",
      lastPayment: "2023-08-13",
      status: "Active",
    },
    {
      id: "CUST-004",
      name: "Emily Davis",
      email: "emily.d@example.com",
      totalTransactions: 12,
      totalVolume: "$5,280.25",
      currency: "USD",
      lastPayment: "2023-08-12",
      status: "Active",
    },
    {
      id: "CUST-005",
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      totalTransactions: 45,
      totalVolume: "$22,500.00",
      currency: "USDT",
      lastPayment: "2023-08-11",
      status: "Active",
    },
    {
      id: "CUST-006",
      name: "Amina Bello",
      email: "amina.b@example.com",
      totalTransactions: 8,
      totalVolume: "€3,210.00",
      currency: "EUR",
      lastPayment: "2023-08-10",
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Customers</h1>
            <p className="text-[13px] text-foreground/70">Manage and view your customer information</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-green-600 mt-2">+15.3% from last month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <p className="text-sm text-gray-600 mb-1">Active Customers (30d)</p>
              <p className="text-3xl font-bold text-gray-900">892</p>
              <p className="text-xs text-green-600 mt-2">+8.7% from last month</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <p className="text-sm text-gray-600 mb-1">Avg. Transaction Value</p>
              <p className="text-3xl font-bold text-gray-900">$485.32</p>
              <p className="text-xs text-green-600 mt-2">+3.2% from last month</p>
            </div>
          </section>

          {/* Filters and Actions */}
          <section className="bg-white rounded-xl shadow-sm border border-border p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search customers by name, email..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-initial">
                  <Filter className="size-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="flex-1 md:flex-initial">
                  <Download className="size-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </section>

          {/* Customers Table */}
          <section className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading customers...</div>}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#1E73FF]/10 rounded-full flex items-center justify-center">
                              <span className="text-[#1E73FF] font-semibold text-sm">
                                {customer.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-xs text-gray-500">{customer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.totalTransactions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{customer.totalVolume}</div>
                          <div className="text-xs text-gray-500">{customer.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.lastPayment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  )
}
