import { AlertTriangle, Info } from "lucide-react"

export function AlertsNotifications() {
  return (
    <div className="rounded-xl bg-white text-foreground shadow-sm border border-border p-4">
      <div className="text-[14px] font-medium mb-3">Alerts & Notifications</div>

      <div className="space-y-3">
        {/* KYC Alert */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-medium">KYC Verification Pending</div>
              <p className="text-[13px] opacity-80">Complete your KYC to increase your transaction limits</p>
              <button className="mt-2 text-[13px] font-medium underline underline-offset-2">Complete KYC →</button>
            </div>
          </div>
        </div>

        {/* Low Balance Alert */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Info className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-medium">Low USDT Balance</div>
              <p className="text-[13px] opacity-80">Your USDT balance is below the recommended threshold</p>
              <button className="mt-2 text-[13px] font-medium underline underline-offset-2">Add Funds →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
