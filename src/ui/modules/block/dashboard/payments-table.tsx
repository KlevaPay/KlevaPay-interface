"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Input, Button } from "@/ui/modules/components"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type Payment = {
  id: string
  customer: string
  amount: string
  method: "Card" | "Bank" | "Crypto"
  status: "Pending" | "Completed" | "Failed" | "Refunded"
  date: string
}

type SortKey = "id" | "customer" | "amount" | "method" | "status" | "date"

type Method = Payment["method"]

type Status = Payment["status"]

const StatusPill = ({ status }: { status: Status }) => {
  const map: Record<Status, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
    Refunded: "bg-blue-100 text-blue-700",
  }
  return <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${map[status]}`}>{status}</span>
}

// Type guards for URL values
const isMethod = (v: string | null): v is Method => v === "Card" || v === "Bank" || v === "Crypto"
const isStatus = (v: string | null): v is Status =>
  v === "Pending" || v === "Completed" || v === "Failed" || v === "Refunded"

export function PaymentsTable({ items }: { items: Payment[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // state from URL
  const [query, setQuery] = useState<string>(sp.get("q") ?? "")
  const [sortKey, setSortKey] = useState<SortKey>((sp.get("sortKey") as SortKey) || "date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">((sp.get("sortDir") as "asc" | "desc") || "desc")
  const [page, setPage] = useState<number>(parseInt(sp.get("page") || "1", 10) || 1)
  const [pageSize, setPageSize] = useState<number>(parseInt(sp.get("pageSize") || "10", 10) || 10)

  const methodParam = sp.get("method")
  const statusParam = sp.get("status")
  const [methodFilter, setMethodFilter] = useState<"all" | Method>(isMethod(methodParam) ? methodParam : "all")
  const [statusFilter, setStatusFilter] = useState<"all" | Status>(isStatus(statusParam) ? statusParam : "all")
  const [dateFrom, setDateFrom] = useState<string>(sp.get("from") || "")
  const [dateTo, setDateTo] = useState<string>(sp.get("to") || "")

  const urlSyncTimer = useRef<number | null>(null)
  const syncUrl = useCallback((debounce = false) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (sortKey) params.set("sortKey", sortKey)
    if (sortDir) params.set("sortDir", sortDir)
    if (page !== 1) params.set("page", String(page))
    if (pageSize !== 10) params.set("pageSize", String(pageSize))
    if (methodFilter !== "all") params.set("method", methodFilter)
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (dateFrom) params.set("from", dateFrom)
    if (dateTo) params.set("to", dateTo)

    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    const run = () => router.replace(url, { scroll: false })
    if (debounce) {
      if (urlSyncTimer.current) window.clearTimeout(urlSyncTimer.current)
      urlSyncTimer.current = window.setTimeout(run, 300)
    } else {
      run()
    }
  }, [pathname, router, query, sortKey, sortDir, page, pageSize, methodFilter, statusFilter, dateFrom, dateTo])

  useEffect(() => { syncUrl(true) }, [query, syncUrl])
  useEffect(() => { syncUrl() }, [syncUrl, sortKey, sortDir, page, pageSize, methodFilter, statusFilter, dateFrom, dateTo])

  const parseAmount = (s: string) => {
    const m = s.replace(/[^0-9.\-]/g, "")
    const val = parseFloat(m)
    return isNaN(val) ? 0 : val
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = items.filter((p) => [p.id, p.customer, p.amount, p.method, p.status, p.date].some((v) => v.toLowerCase().includes(q)))
    if (methodFilter !== "all") arr = arr.filter((p) => p.method === methodFilter)
    if (statusFilter !== "all") arr = arr.filter((p) => p.status === statusFilter)

    // Date range
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null
    const toTs = dateTo ? new Date(dateTo).getTime() : null
    if (fromTs || toTs) {
      arr = arr.filter((p) => {
        const ts = new Date(p.date).getTime()
        if (fromTs && ts < fromTs) return false
        if (toTs && ts > toTs) return false
        return true
      })
    }
    return arr
  }, [items, query, methodFilter, statusFilter, dateFrom, dateTo])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let va: string | number = "", vb: string | number = ""
      switch (sortKey) {
        case "id": va = a.id; vb = b.id; break
        case "customer": va = a.customer; vb = b.customer; break
        case "amount": va = parseAmount(a.amount); vb = parseAmount(b.amount); break
        case "method": va = a.method; vb = b.method; break
        case "status": va = a.status; vb = b.status; break
        case "date": va = new Date(a.date).getTime(); vb = new Date(b.date).getTime(); break
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1
      if (va > vb) return sortDir === "asc" ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageItems = sorted.slice(start, start + pageSize)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    sortKey === k ? (sortDir === "asc" ? <ChevronUp className="inline size-3 ml-1" /> : <ChevronDown className="inline size-3 ml-1" />) : null
  )

  return (
    <div className="rounded-xl bg-white text-foreground shadow-sm border border-border">
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-border/60">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[14px] font-medium">Payments</div>
          <div className="hidden sm:block w-[240px]">
            <Input placeholder="Search payments" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select className="border rounded-md px-2 py-2 bg-white text-[14px]" value={methodFilter} onChange={(e) => { setMethodFilter(isMethod(e.target.value) ? e.target.value : "all"); setPage(1) }}>
            <option value="all">All Methods</option>
            <option value="Card">Card</option>
            <option value="Bank">Bank</option>
            <option value="Crypto">Crypto</option>
          </select>
          <select className="border rounded-md px-2 py-2 bg-white text-[14px]" value={statusFilter} onChange={(e) => { setStatusFilter(isStatus(e.target.value) ? e.target.value : "all"); setPage(1) }}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
          <input type="date" className="border rounded-md px-2 py-2 bg-white text-[14px]" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} />
          <input type="date" className="border rounded-md px-2 py-2 bg-white text-[14px]" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} />
          <div className="flex items-center gap-2">
            <Button className="text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Create Payment</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="text-foreground/60 select-none">
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("id")}>Payment ID<SortIcon k="id" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("customer")}>Customer<SortIcon k="customer" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("amount")}>Amount<SortIcon k="amount" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("method")}>Method<SortIcon k="method" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("status")}>Status<SortIcon k="status" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("date")}>Date<SortIcon k="date" /></th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p, i) => (
              <tr key={p.id} className={i % 2 === 1 ? "bg-black/[0.02]" : ""}>
                <td className="px-4 py-3 text-[color:var(--brand-blue)]"><Link href="#">{p.id}</Link></td>
                <td className="px-4 py-3">{p.customer}</td>
                <td className="px-4 py-3">{p.amount}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                <td className="px-4 py-3 text-foreground/70">{p.date}</td>
                <td className="px-4 py-3"><button className="inline-flex items-center gap-1 text-[13px] text-[color:var(--brand-blue)]"><ExternalLink className="size-3" /> View</button></td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/60 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-foreground/60">Rows per page</span>
          <select className="border rounded-md px-2 py-1 bg-white" value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1) }}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-foreground/60">Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded border disabled:opacity-50">Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
