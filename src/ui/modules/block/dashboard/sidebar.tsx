import Link from "next/link"
import { BarChart3, CreditCard, DollarSign, Home, Settings, HelpCircle, Users, BookOpen, Store, Receipt, Coins, Wallet } from "lucide-react"

export function DashboardSidebar() {
  const nav = [
    { label: "Overview", icon: Home, href: "/dashboard" },
    { label: "Merchant", icon: Store, href: "/dashboard/merchant" },
    { label: "Transactions", icon: CreditCard, href: "/dashboard/transactions" },
    { label: "Payments", icon: DollarSign, href: "/dashboard/payments" },
    { label: "Payment Intents", icon: Receipt, href: "/dashboard/payment-intents" },
    { label: "Crypto", icon: Coins, href: "/dashboard/crypto" },
    { label: "Quick Pay", icon: Wallet, href: "/dashboard/pay" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { label: "API Docs", icon: BookOpen, href: "/dashboard/docs" },
    { label: "Support", icon: HelpCircle, href: "/dashboard/support" },
  ]

  return (
    <aside
      className="h-full w-[240px] shrink-0 border-r hidden md:flex flex-col"
      style={{ background: "var(--brand-gradient)", borderColor: "rgba(255,255,255,0.15)" }}
    >
      <div className="h-[64px] flex items-center px-5 text-white text-[18px] font-semibold">KlevaPay</div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="px-3 space-y-1">
          {nav.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-white/90 hover:bg-white/10 ${
                  idx === 0 ? "bg-white/10" : ""
                }`}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
