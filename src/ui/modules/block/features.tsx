import { CreditCard, Globe2, LayoutDashboard, ShieldCheck } from "lucide-react"

function SectionShell({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section
      id={id}
      className="w-full border-t"
      style={{
        background: "var(--brand-gradient)",
        borderColor: "var(--brand-navy)",
      }}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-20 lg:px-28 py-10 sm:py-14">
        {children}
      </div>
    </section>
  )
}

export function PowerfulFeatures() {
  const cards = [
    {
      icon: <CreditCard className="text-[color:var(--brand-navy)]" />,
      title: "Hosted Checkout Widget",
      desc:
        "Fast, secure checkout powered from SDK with different networks and real-time conversion rates.",
    },
    {
      icon: <Globe2 className="text-[color:var(--brand-navy)]" />,
      title: "Multi-Currency Support",
      desc:
        "Seamless conversions between Naira, USD, USDT, ETH and more with competitive rates.",
    },
    {
      icon: <LayoutDashboard className="text-[color:var(--brand-navy)]" />,
      title: "Merchant Dashboard",
      desc:
        "Track real-time settlements, reporting, payment tracking, and automated payout management.",
    },
    {
      icon: <ShieldCheck className="text-[color:var(--brand-navy)]" />,
      title: "Secure Settlements",
      desc:
        "Secure on-ramp/off-ramp, reliable webhooks, and encrypted services via secure providers.",
    },
  ]

  return (
    <SectionShell id="features">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-[14px] sm:text-[1rem] lg:text-[1.2rem] font-semibold text-white">Powerful Features</h2>
        <p className="mt-1 text-[12px] sm:text-[1rem] lg:text-[1.2rem] text-white/80">
          Everything you need to accept payments globally and settle in your preferred currency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="rounded-xl bg-white text-foreground shadow-sm border border-border p-4 sm:p-5"
          >
            <div className="mb-3 inline-flex items-center justify-center size-9 rounded-md bg-[rgba(7,56,99,0.06)]">
              {c.icon}
            </div>
            <div className="font-medium mb-1">{c.title}</div>
            <p className="text-[13px] text-foreground/70">{c.desc}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

export function WhoKleverPayIsFor() {
  const items = [
    {
      title: "African E‑commerce Merchants",
      desc:
        "Accept payments in multiple currencies while settling in stable USD or USDT.",
    },
    {
      title: "Global Customers Paying in Crypto",
      desc:
        "Seamless checkout experiences for global customers who pay with crypto.",
    },
    {
      title: "Freelancers Needing USD Settlements",
      desc:
        "Get paid in local currencies or crypto, with settlements in USD to avoid volatility.",
    },
    {
      title: "Online Marketplaces",
      desc:
        "Offer flexible payment options to your customers and sellers with our API.",
    },
  ]

  return (
    <SectionShell id="audience">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-[1.2rem] sm:text-[1.5rem] lg:text-[2rem] font-semibold text-white">Who KleverPay Is For</h2>
        <p className="mt-1 text-[12px] sm:text-[1rem] lg:text-[1.2rem] text-white/80">
          Designed for businesses and individuals who need flexible payment options across borders.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((c, i) => (
          <div
            key={i}
            className="rounded-xl bg-white text-foreground shadow-sm border border-border p-4 sm:p-5"
          >
            <div className="mb-3 inline-flex items-center justify-center size-9 rounded-md bg-[rgba(7,56,99,0.06)]">
              <span className="text-[color:var(--brand-navy)] text-[1.5rem]">{i + 1}</span>
            </div>
            <div className="font-medium mb-1 text-[1.2rem]">{c.title}</div>
            <p className="text-[0.8rem] text-foreground/70">{c.desc}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
