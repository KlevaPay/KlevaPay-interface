"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Input } from "@/ui/modules/components"
import { ChevronDown, ChevronUp } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type Transaction = {
  id: string
  customer: string
  amount: string
  status: "Completed" | "Processing" | "Failed"
  date: string
}

const StatusPill = ({ status }: { status: Transaction["status"] }) => {
  const styles =
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : status === "Processing"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
  return <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${styles}`}>{status}</span>
}

 type SortKey = "id" | "customer" | "amount" | "status" | "date"
 type TxType = "crypto" | "fiat"

 // Type guards for URL params and select values
 const isTxType = (v: string | null): v is TxType => v === "crypto" || v === "fiat"
 const isTxStatus = (v: string | null): v is Transaction["status"] =>
   v === "Completed" || v === "Processing" || v === "Failed"

 export function TransactionsTable({ items }: { items: Transaction[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // Initialize from URL params
  const [query, setQuery] = useState<string>(sp.get("q") ?? "")
  const [sortKey, setSortKey] = useState<SortKey>((sp.get("sortKey") as SortKey) || "date")
  const [sortDir, setSortDir] = useState<"asc" | "desc">((sp.get("sortDir") as "asc" | "desc") || "desc")
  const [page, setPage] = useState<number>(parseInt(sp.get("page") || "1", 10) || 1)
  const [pageSize, setPageSize] = useState<number>(parseInt(sp.get("pageSize") || "5", 10) || 5)

  // Filters
  const typeParam = sp.get("type")
  const statusParam = sp.get("status")
  const [typeFilter, setTypeFilter] = useState<"all" | TxType>(isTxType(typeParam) ? typeParam : "all")
  const [statusFilter, setStatusFilter] = useState<"all" | Transaction["status"]>(isTxStatus(statusParam) ? statusParam : "all")
  const [currencyFilter, setCurrencyFilter] = useState<"all" | string>(sp.get("ccy") || "all")
  const [dateFrom, setDateFrom] = useState<string>(sp.get("from") || "")
  const [dateTo, setDateTo] = useState<string>(sp.get("to") || "")

  // Sync state to URL (debounced for query)
  const urlSyncTimer = useRef<number | null>(null)

  const syncUrl = useCallback((debounce = false) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (sortKey) params.set("sortKey", sortKey)
    if (sortDir) params.set("sortDir", sortDir)
    if (page !== 1) params.set("page", String(page))
    if (pageSize !== 5) params.set("pageSize", String(pageSize))
    if (typeFilter !== "all") params.set("type", typeFilter)
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (currencyFilter !== "all") params.set("ccy", currencyFilter)
    if (dateFrom) params.set("from", dateFrom)
    if (dateTo) params.set("to", dateTo)

    const queryStr = params.toString()
    const url = queryStr ? `${pathname}?${queryStr}` : pathname
    const run = () => router.replace(url, { scroll: false })
    if (debounce) {
      if (urlSyncTimer.current) window.clearTimeout(urlSyncTimer.current)
      urlSyncTimer.current = window.setTimeout(run, 300)
    } else {
      run()
    }
  }, [pathname, router, query, sortKey, sortDir, page, pageSize, typeFilter, statusFilter, currencyFilter, dateFrom, dateTo])

  // Keep URL in sync when relevant state changes
  useEffect(() => { syncUrl(true) }, [query, syncUrl])
  useEffect(() => { syncUrl() }, [syncUrl, sortKey, sortDir, page, pageSize, typeFilter, statusFilter, currencyFilter, dateFrom, dateTo])

  const cryptoCodes = useMemo(() => new Set(["USDT", "ETH", "BTC", "SOL", "BNB"]), []) // extend as needed
  const fiatCodes = useMemo(() => new Set(["USD", "NGN", "EUR", "GBP"]), []) // extend as needed

  const getCurrency = useCallback((amount: string) => {
    // Expect formats like "$1,234.00 USD" or "₦325,000.00 NGN" or "$500.00 USDT"
    const parts = amount.trim().split(/\s+/)
    const last = parts[parts.length - 1]
    // Prefer 3-5 letter codes
    const code = /[A-Z]{3,5}/.test(last) ? last : ""
    return code
  }, [])

  const getType = useCallback((amount: string): TxType | null => {
    const code = getCurrency(amount)
    if (cryptoCodes.has(code)) return "crypto"
    if (fiatCodes.has(code)) return "fiat"
    return null
  }, [getCurrency, cryptoCodes, fiatCodes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let arr = items.filter((t) =>
      [t.id, t.customer, t.amount, t.status, t.date].some((v) => v.toLowerCase().includes(q))
    )

    // Status filter
    if (statusFilter !== "all") {
      arr = arr.filter((t) => t.status === statusFilter)
    }

    // Currency filter
    if (currencyFilter !== "all") {
      arr = arr.filter((t) => getCurrency(t.amount) === currencyFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      arr = arr.filter((t) => getType(t.amount) === typeFilter)
    }

    // Date range filter
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null
    const toTs = dateTo ? new Date(dateTo).getTime() : null
    if (fromTs || toTs) {
      arr = arr.filter((t) => {
        const ts = new Date(t.date).getTime()
        if (fromTs && ts < fromTs) return false
        if (toTs && ts > toTs) return false
        return true
      })
    }

    return arr
  }, [items, query, statusFilter, currencyFilter, typeFilter, dateFrom, dateTo, getType, getCurrency])

  const parseAmount = (s: string) => {
    const m = s.replace(/[^0-9.\-]/g, "")
    const val = parseFloat(m)
    return isNaN(val) ? 0 : val
  }

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let va: string | number = "", vb: string | number = ""
      switch (sortKey) {
        case "id":
          va = a.id; vb = b.id; break
        case "customer":
          va = a.customer; vb = b.customer; break
        case "amount":
          va = parseAmount(a.amount); vb = parseAmount(b.amount); break
        case "status":
          va = a.status; vb = b.status; break
        case "date":
          va = new Date(a.date).getTime(); vb = new Date(b.date).getTime(); break
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
          <div className="text-[14px] font-medium">Recent Transactions</div>
          <div className="hidden sm:block w-[220px]">
            <Input placeholder="Search transactions" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
          </div>
        </div>
        {/* Filters row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            className="border rounded-md px-2 py-2 bg-white text-[14px]"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(isTxType(e.target.value) ? e.target.value : "all"); setPage(1) }}
          >
            <option value="all">All Types</option>
            <option value="crypto">Crypto</option>
            <option value="fiat">Fiat</option>
          </select>
          <select
            className="border rounded-md px-2 py-2 bg-white text-[14px]"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(isTxStatus(e.target.value) ? e.target.value : "all"); setPage(1) }}
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            className="border rounded-md px-2 py-2 bg-white text-[14px]"
            value={currencyFilter}
            onChange={(e) => { setCurrencyFilter(e.target.value); setPage(1) }}
          >
            <option value="all">All Currencies</option>
            {[...new Set(items.map((t) => getCurrency(t.amount)).filter(Boolean))].map((c) => (
              <option key={c} value={c!}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded-md px-2 py-2 bg-white text-[14px]"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
          />
          <input
            type="date"
            className="border rounded-md px-2 py-2 bg-white text-[14px]"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
          />
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="text-foreground/60 mr-1">Quick filters:</span>
          <button onClick={() => { setStatusFilter("Completed"); setPage(1) }} className={`px-2 py-1 rounded-full border ${statusFilter === "Completed" ? "bg-green-100 border-green-300 text-green-700" : "bg-white"}`}>Completed</button>
          <button onClick={() => { setStatusFilter("Processing"); setPage(1) }} className={`px-2 py-1 rounded-full border ${statusFilter === "Processing" ? "bg-yellow-100 border-yellow-300 text-yellow-800" : "bg-white"}`}>Processing</button>
          <button onClick={() => { setStatusFilter("Failed"); setPage(1) }} className={`px-2 py-1 rounded-full border ${statusFilter === "Failed" ? "bg-red-100 border-red-300 text-red-700" : "bg-white"}`}>Failed</button>
          <span className="mx-2 h-4 w-px bg-border" />
          <button onClick={() => { const d = new Date(); const to = d.toISOString().slice(0,10); d.setDate(d.getDate()-7); const from = d.toISOString().slice(0,10); setDateFrom(from); setDateTo(to); setPage(1) }} className="px-2 py-1 rounded-full border">Last 7 days</button>
          <button onClick={() => { const d = new Date(); const to = d.toISOString().slice(0,10); d.setDate(d.getDate()-30); const from = d.toISOString().slice(0,10); setDateFrom(from); setDateTo(to); setPage(1) }} className="px-2 py-1 rounded-full border">Last 30 days</button>
          <button onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setCurrencyFilter("all"); setDateFrom(""); setDateTo(""); setPage(1) }} className="px-2 py-1 rounded-full border">Clear</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="text-foreground/60 select-none">
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("id")}>Transaction ID<SortIcon k="id" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("customer")}>Customer<SortIcon k="customer" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("amount")}>Amount<SortIcon k="amount" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("status")}>Status<SortIcon k="status" /></th>
              <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => toggleSort("date")}>Date<SortIcon k="date" /></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t, i) => (
              <tr key={t.id} className={i % 2 === 1 ? "bg-black/[0.02]" : ""}>
                <td className="px-4 py-3 text-[color:var(--brand-blue)]"><Link href="#">{t.id}</Link></td>
                <td className="px-4 py-3">{t.customer}</td>
                <td className="px-4 py-3">{t.amount}</td>
                <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                <td className="px-4 py-3 text-foreground/70">{t.date}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/60 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-foreground/60">Rows per page</span>
          <select
            className="border rounded-md px-2 py-1 bg-white"
            value={pageSize}
            onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1) }}
          >
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
