import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { BalanceCard } from "@/ui/modules/block/dashboard/balance-card"
import { PieChart } from "@/ui/modules/block/dashboard/pie-chart"
import { TransactionsTable } from "@/ui/modules/block/dashboard/transactions-table"
import { QuickActions } from "@/ui/modules/block/dashboard/quick-actions"
import { AlertsNotifications } from "@/ui/modules/block/dashboard/alerts"

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Welcome, <span className="text-foreground/70">John Doe</span></h1>
            <p className="text-[13px] text-foreground/70">Here’s an overview of your merchant account</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Balance summary */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <BalanceCard
              currency="USD"
              label="Balance"
              amount="$24,500.00"
              trend={{ value: "+2.5%", direction: "up", note: "from last month" }}
            />
            <BalanceCard
              currency="USDT"
              label="Balance"
              amount="$18,245.75"
              trend={{ value: "+1.2%", direction: "up", note: "from last month" }}
            />
            <BalanceCard
              currency="NGN"
              label="Balance"
              amount="₦3,842,500.00"
              trend={{ value: "-0.8%", direction: "down", note: "from last month" }}
            />
          </section>

          {/* Chart */}
          <section>
            <div className="rounded-xl bg-white shadow-sm border border-border p-4">
              <PieChart
                slices={[
                  { label: "USDT", value: 25, color: "#00C389" },
                  { label: "USD", value: 20, color: "#1E73FF" },
                  { label: "NGN", value: 35, color: "#6DC24B" },
                  { label: "EUR", value: 10, color: "#FFBE3D" },
                  { label: "GBP", value: 10, color: "#FF7AA2" },
                ]}
              />
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="mt-6">
            <TransactionsTable
              items={[
                { id: "TRX-12345", customer: "Alex Johnson", amount: "$1,250.00 USD", status: "Completed", date: "2023-08-15 14:30" },
                { id: "TRX-12344", customer: "Sarah Williams", amount: "$750.50 USDT", status: "Completed", date: "2023-08-15 13:15" },
                { id: "TRX-12343", customer: "Michael Brown", amount: "₦325,000.00 NGN", status: "Processing", date: "2023-08-15 12:45" },
                { id: "TRX-12342", customer: "Emily Davis", amount: "$80.25 USD", status: "Failed", date: "2023-08-15 11:20" },
                { id: "TRX-12341", customer: "Robert Wilson", amount: "$500.00 USDT", status: "Completed", date: "2023-08-15 10:05" },
              ]}
            />
          </section>

          {/* Quick Actions */}
          <section className="mt-6">
            <QuickActions />
          </section>

          {/* Alerts & Notifications */}
          <section className="mt-6 mb-8">
            <AlertsNotifications />
          </section>
        </main>
      </div>
    </div>
  )
}
