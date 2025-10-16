import { Button } from "@/ui/modules/components"
import { Plus, Wallet, Eye } from "lucide-react"

export function QuickActions() {
  return (
    <div className="rounded-xl bg-white text-foreground shadow-sm border border-border p-4">
      <div className="text-[14px] font-medium mb-3">Quick Actions</div>

      <div className="space-y-3">
        <Button className="w-full justify-center text-white" style={{ backgroundColor: "var(--brand-blue)" }}>
          <Plus className="mr-2 size-4" /> Create New Payment
        </Button>

        <Button className="w-full justify-center text-white" style={{ backgroundColor: "#17A572" }}>
          <Wallet className="mr-2 size-4" /> Request Payout
        </Button>

        <Button variant="outline" className="w-full justify-center">
          <Eye className="mr-2 size-4" /> View Settlements
        </Button>
      </div>
    </div>
  )
}
