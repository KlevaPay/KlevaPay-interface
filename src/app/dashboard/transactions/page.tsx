import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { TransactionsTable } from "@/ui/modules/block/dashboard/transactions-table"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section>
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
        </main>
      </div>
    </div>
  )
}
