"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarChart3, CreditCard, Settings, HelpCircle, Store, ChevronLeft, ChevronRight } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const nav = [
    { label: "Merchant", icon: Store, href: "/dashboard/merchant" },
    { label: "Transactions", icon: CreditCard, href: "/dashboard/transactions" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    { label: "Support", icon: HelpCircle, href: "/dashboard/support" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard/merchant") {
      return pathname === href || pathname === "/dashboard/merchant"
    }
    return pathname?.startsWith(href)
  }

  return (
    <aside
      className={`min-h-screen shrink-0 border-r hidden md:flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
      style={{ background: "var(--brand-gradient)", borderColor: "rgba(255,255,255,0.15)" }}
    >
      <div className="h-[64px] flex items-center justify-between px-5 text-white text-[18px] font-semibold">
        {!isCollapsed && <span>KlevaPay</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="px-3 space-y-1">
          {nav.map((item, idx) => {
            const active = isActive(item.href)
            return (
              <li key={idx}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-all ${
                    active
                      ? "bg-white/20 text-white font-medium"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="size-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
