"use client"

import Image from "next/image"
import { Button } from "@/ui/modules/components"
import {
  Landmark,
  CreditCard,
  Bitcoin,
  ShieldCheck,
  Sparkles,
  Clock4,
  Globe2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

const paymentOptions = [
  {
    title: "Bank Transfer",
    description: "Collect instant transfers in Naira, USD, or other supported fiat accounts and reconcile payouts automatically.",
    icon: Landmark,
    highlights: [
      "Instant settlement to your KlevaPay balance",
      "Auto-generated virtual accounts for every customer",
      "Smart notifications for successful transfers",
    ],
    accent: "#1E73FF",
  },
  {
    title: "Pay with Crypto",
    description: "Delight global customers with USDT, USDC, ETH, or BTC payments while you settle in the currency that keeps your books simple.",
    icon: Bitcoin,
    highlights: [
      "Network fee transparency for your customers",
      "Realtime FX conversion with market-grade rates",
      "Automatic compliance checks on every transaction",
    ],
    accent: "#F7931A",
  },
  {
    title: "Pay with Card",
    description: "Accept debit and credit cards with 3-D Secure, tokenized storage, and adaptive fraud rules built for African merchants.",
    icon: CreditCard,
    highlights: [
      "VISA, MasterCard, Verve, and AMEX supported",
      "Chargeback protection and automated dispute flows",
      "Seamless fallback to bank transfer when cards fail",
    ],
    accent: "#1E9086",
  },
]

const onboardingSteps = [
  {
    title: "Create your merchant account",
    detail: "Sign up in minutes, upload your KYC documents, and get a live dashboard the moment you're approved.",
    icon: Sparkles,
  },
  {
    title: "Integrate or share a payment link",
    detail: "Use our drop-in checkout, API, or one-time links—no heavy engineering required to start collecting payments.",
    icon: Globe2,
  },
  {
    title: "Track payouts in real time",
    detail: "Monitor inflows, configure settlement currencies, and trigger withdrawals straight to your bank or stablecoin wallet.",
    icon: Clock4,
  },
]

const assurances = [
  {
    title: "Bank-grade security",
    detail: "PCI-DSS Level 1, SOC 2 ready infrastructure, encrypted vaults, and anomaly monitoring 24/7.",
  },
  {
    title: "Compliance everywhere",
    detail: "We handle travel rule, chain analytics, and regional regulatory filings so you can scale confidently.",
  },
  {
    title: "Always-on support",
    detail: "Dedicated success managers, in-app chat, Slack alerts, and a comprehensive status page for incident transparency.",
  },
]

export function PaymentGatewayPage() {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative overflow-hidden border-b"
        style={{
          background: "var(--brand-gradient)",
          borderColor: "var(--brand-navy-border)",
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
          <div className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-white/30 blur-3xl" />
          <div className="absolute right-0 bottom-10 h-[320px] w-[320px] rounded-full bg-white/20 blur-[110px]" />
        </div>

        <div className="relative mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 md:px-10 lg:px-16 lg:py-20">
          <div className="flex flex-col items-start gap-6 text-white">
            <div className="flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/80">
              <span className="size-2 rounded-full bg-white" />
              KlevaPay unified payments
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Image
                src="/logo.png"
                alt="KlevaPay logo"
                width={52}
                height={52}
                className="rounded-xl bg-white p-1 shadow-md"
                priority
              />
              <div>
                <h1 className="text-[32px] font-bold leading-tight sm:text-[40px] md:text-[48px]">
                  Accept every payment on one trusted gateway
                </h1>
                <p className="mt-3 max-w-2xl text-[16px] text-white/85 sm:text-[18px]">
                  Offer local bank transfers, global cards, and popular crypto in a single checkout. KlevaPay keeps the experience branded, secure, and instant for you and your customers.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                className="bg-white text-[15px] font-semibold text-[color:var(--brand-navy)] hover:bg-white/90"
                size="lg"
              >
                Start accepting payments
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/60 bg-white/10 text-white hover:bg-white/20"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <header className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-navy)]">Payment methods</p>
          <h2 className="text-[28px] font-semibold text-[color:var(--brand-navy)] sm:text-[32px]">
            Your customers choose how to pay, you decide how to settle
          </h2>
          <p className="text-[15px] text-neutral-600">
            Mix traditional rails with on-chain speed. Route every transaction through KlevaPay and keep a single source of truth for reconciliation.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {paymentOptions.map((option) => (
            <article
              key={option.title}
              className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(7,56,99,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(7,56,99,0.12)]"
            >
              <div
                className="mb-4 flex size-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${option.accent}1A` }}
              >
                <option.icon className="size-6" style={{ color: option.accent }} />
              </div>
              <h3 className="text-[20px] font-semibold text-[color:var(--brand-navy)]">
                {option.title}
              </h3>
              <p className="mt-3 text-[15px] text-neutral-600">
                {option.description}
              </p>
              <ul className="mt-5 space-y-3 text-[14px] text-neutral-600">
                {option.highlights.map((point) => (
                  <li key={point} className="flex gap-2">
                    <CheckCircle2 className="mt-1 size-4 flex-none" style={{ color: option.accent }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="border-y bg-[color:var(--brand-navy)] text-white"
        style={{ borderColor: "var(--brand-navy-border)" }}
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:px-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">How KlevaPay works</p>
            <h2 className="text-[28px] font-semibold sm:text-[32px]">Live in hours, not weeks</h2>
            <p className="text-[15px] text-white/80">
              Whether you are a fast-scaling startup or an established enterprise, our modular tools adapt to your stack. Plug into our APIs or launch a branded checkout without touching code.
            </p>

            <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <ShieldCheck className="size-5 text-white" />
                SOC 2-ready controls & PCI-DSS Level 1 certification
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Clock4 className="size-5 text-white" />
                Settlement times as fast as T+0 with real-time notifications
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
              >
                <div className="flex size-12 flex-none items-center justify-center rounded-xl bg-white/15 text-white">
                  <step.icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/60">
                    Step {index + 1}
                  </p>
                  <h3 className="text-[18px] font-semibold">{step.title}</h3>
                  <p className="text-[14px] text-white/80">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-navy)]">
              Built for finance teams
            </p>
            <h2 className="text-[28px] font-semibold text-[color:var(--brand-navy)] sm:text-[32px]">
              One ledger, every channel
            </h2>
            <p className="text-[15px] text-neutral-600">
              Control liquidity across fiat and digital assets with automated reconciliation rules and audit trails every auditor loves. Configure smart routing rules to minimize fees while keeping authorisation rates high.
            </p>

            <ul className="space-y-3 text-[14px] text-neutral-600">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-[color:var(--brand-blue)]" />
                <span>Dynamic risk scoring powered by on-chain analytics and global sanctions lists.</span>
              </li>
              <li className="flex items-start gap-3">
                <Globe2 className="mt-0.5 size-5 text-[color:var(--brand-blue)]" />
                <span>Localized checkout flows for Africa, Europe, and North America with automatic language detection.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 size-5 text-[color:var(--brand-blue)]" />
                <span>Embedded payout automation to your bank accounts or stablecoin wallets in one click.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-[#F3FBFD] to-white p-6 shadow-[0_12px_40px_rgba(7,56,99,0.08)]">
            <h3 className="text-[20px] font-semibold text-[color:var(--brand-navy)]">
              Enterprise trust, startup speed
            </h3>
            <p className="text-[14px] text-neutral-600">
              KlevaPay handles the heavy lifting so you can focus on building experiences your customers love.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {assurances.map((assurance) => (
                <div key={assurance.title} className="rounded-2xl border border-white/0 bg-white/70 p-4 shadow-[0_6px_18px_rgba(7,56,99,0.06)]">
                  <h4 className="text-[16px] font-semibold text-[color:var(--brand-navy)]">
                    {assurance.title}
                  </h4>
                  <p className="mt-2 text-[13px] text-neutral-600">{assurance.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-[color:var(--brand-blue)]/40 bg-white/60 p-4 text-[13px] text-neutral-600">
              Need a custom integration? Our solutions engineers will co-design the flow, test the edge cases, and launch alongside your team.
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t"
        style={{ background: "var(--brand-gradient)", borderColor: "var(--brand-navy-border)" }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-4 py-16 text-center text-white sm:px-6 md:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Ready to go live?
          </p>
          <h2 className="text-[30px] font-semibold leading-tight sm:text-[34px]">
            Launch your payment gateway with KlevaPay today
          </h2>
          <p className="max-w-3xl text-[15px] text-white/80">
            Join a growing network of merchants bridging fiat and crypto seamlessly. Our onboarding team is ready to migrate your existing providers and optimize your payment stack from day one.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-[color:var(--brand-navy)] hover:bg-white/90"
            >
              Create a merchant account
            </Button>
            <Button
              size="lg"
              className="bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            >
              Schedule a demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
