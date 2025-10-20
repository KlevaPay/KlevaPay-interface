"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Wallet, Key, Webhook, Shield, Bell } from "lucide-react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const settingsNav = [
    { label: "Profile", href: "/dashboard/settings/profile", icon: User },
    { label: "Payout Preferences", href: "/dashboard/settings/payout", icon: Wallet },
    { label: "API Keys", href: "/dashboard/settings/api-keys", icon: Key },
    { label: "Webhooks", href: "/dashboard/settings/webhooks", icon: Webhook },
    { label: "Security", href: "/dashboard/settings/security", icon: Shield },
    { label: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  ]

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Settings</h1>
            <p className="text-[13px] text-foreground/70">Manage your account and preferences</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Navigation */}
            <aside className="lg:w-64 shrink-0">
              <nav className="bg-white rounded-xl shadow-sm border border-border p-2">
                {settingsNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-[#1E73FF]/10 text-[#1E73FF] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </aside>

            {/* Settings Content */}
            <div className="flex-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
