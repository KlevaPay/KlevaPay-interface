"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { BalanceCard } from "@/ui/modules/block/dashboard/balance-card"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

export default function AnalyticsPage() {
  // Sample analytics data
  const stats = [
    {
      label: "Total Revenue",
      value: "$127,842.50",
      trend: { value: "+12.5%", direction: "up" as const, note: "from last month" },
      icon: DollarSign,
    },
    {
      label: "Total Transactions",
      value: "2,847",
      trend: { value: "+8.2%", direction: "up" as const, note: "from last month" },
      icon: BarChart3,
    },
    {
      label: "Success Rate",
      value: "98.4%",
      trend: { value: "+2.1%", direction: "up" as const, note: "from last month" },
      icon: TrendingUp,
    },
    {
      label: "Active Customers",
      value: "1,234",
      trend: { value: "+15.3%", direction: "up" as const, note: "from last month" },
      icon: Users,
    },
  ]

  const revenueByPeriod = [
    { date: "Jan", amount: 8500 },
    { date: "Feb", amount: 9200 },
    { date: "Mar", amount: 11000 },
    { date: "Apr", amount: 10500 },
    { date: "May", amount: 12800 },
    { date: "Jun", amount: 14200 },
    { date: "Jul", amount: 13500 },
    { date: "Aug", amount: 15800 },
  ]

  const maxRevenue = Math.max(...revenueByPeriod.map((d) => d.amount))

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Analytics</h1>
            <p className="text-[13px] text-foreground/70">Track your payment performance and insights</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#1E73FF]/10 rounded-lg">
                    <stat.icon className="size-5 text-[#1E73FF]" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">{stat.trend.value}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Revenue Chart */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {revenueByPeriod.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#1E73FF]/10 rounded-t-lg relative" style={{ height: `${(item.amount / maxRevenue) * 100}%`, minHeight: "20px" }}>
                      <div className="absolute inset-0 bg-[#1E73FF] rounded-t-lg" />
                    </div>
                    <span className="text-xs text-gray-600">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Distribution</h2>
              <div className="space-y-4">
                {[
                  { currency: "USDT", percentage: 45, color: "#00C389" },
                  { currency: "USD", percentage: 30, color: "#1E73FF" },
                  { currency: "NGN", percentage: 20, color: "#6DC24B" },
                  { currency: "ETH", percentage: 5, color: "#FFBE3D" },
                ].map((item) => (
                  <div key={item.currency}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.currency}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Payment Methods & Status */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { method: "Crypto", count: 1247, percentage: 44 },
                  { method: "Card", count: 982, percentage: 34 },
                  { method: "Bank Transfer", count: 618, percentage: 22 },
                ].map((item) => (
                  <div key={item.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.method}</p>
                      <p className="text-xs text-gray-600">{item.count} transactions</p>
                    </div>
                    <span className="text-lg font-semibold text-[#1E73FF]">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Status */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status</h2>
              <div className="space-y-3">
                {[
                  { status: "Completed", count: 2801, color: "green" },
                  { status: "Processing", count: 28, color: "yellow" },
                  { status: "Failed", count: 18, color: "red" },
                ].map((item) => (
                  <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                      <p className="text-sm font-medium text-gray-900">{item.status}</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
