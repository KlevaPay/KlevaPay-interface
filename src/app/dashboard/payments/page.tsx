import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { PaymentsTable, type Payment } from "@/ui/modules/block/dashboard/payments-table"

const sample: Payment[] = [
  { id: "PAY-78651", customer: "Alex Johnson", amount: "$120.00 USD", method: "Card", status: "Completed", date: "2023-08-16 09:45" },
  { id: "PAY-78650", customer: "Sarah Williams", amount: "$750.50 USDT", method: "Crypto", status: "Pending", date: "2023-08-16 08:12" },
  { id: "PAY-78649", customer: "Michael Brown", amount: "₦32,500.00 NGN", method: "Bank", status: "Failed", date: "2023-08-15 18:25" },
  { id: "PAY-78648", customer: "Emily Davis", amount: "$49.99 USD", method: "Card", status: "Refunded", date: "2023-08-15 15:40" },
  { id: "PAY-78647", customer: "Robert Wilson", amount: "$500.00 USDT", method: "Crypto", status: "Completed", date: "2023-08-15 10:05" },
  { id: "PAY-78646", customer: "Amina Bello", amount: "€210.00 EUR", method: "Card", status: "Completed", date: "2023-08-14 12:05" },
]

export default function PaymentsPage() {
  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <section>
            <PaymentsTable items={sample} />
          </section>
        </main>
      </div>
    </div>
  )
}
