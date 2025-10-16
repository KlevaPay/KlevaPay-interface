import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react"

export type BalanceCardProps = {
  currency: string
  label: string
  amount: string
  trend: {
    value: string
    direction: "up" | "down"
    note: string
  }
}

export function BalanceCard({ currency, label, amount, trend }: BalanceCardProps) {
  const isUp = trend.direction === "up"
  return (
    <div className="rounded-xl bg-white text-foreground shadow-sm border border-border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-[rgba(7,56,99,0.10)] grid place-items-center text-[color:var(--brand-navy)]">
            <DollarSign className="size-4" />
          </div>
          <div className="text-[12px] text-foreground/60">{currency} <span className="text-foreground/40">{label}</span></div>
        </div>
      </div>
      <div className="mt-2 text-[20px] font-semibold">{amount}</div>
      <div className={`mt-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] ${isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
        <span className="font-medium">{trend.value}</span>
        <span className="opacity-70">{trend.note}</span>
      </div>
    </div>
  )
}

