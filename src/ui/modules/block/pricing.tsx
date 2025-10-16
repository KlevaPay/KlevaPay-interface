import { Check } from "lucide-react"
import { Button } from "@/ui/modules/components"

function SectionShell({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section
      id={id}
      className="w-full border-t"
      style={{ background: "var(--brand-gradient)", borderColor: "var(--brand-navy)" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {children}
      </div>
    </section>
  )
}

const Feature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-[14px] text-foreground/80">
    <Check className="size-4 text-green-500 mt-0.5" />
    <span>{children}</span>
  </li>
)

export function Pricing() {
  return (
    <SectionShell id="pricing">
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-[22px] sm:text-[24px] font-semibold text-white">Simple, Transparent Pricing</h2>
        <p className="mt-1 text-[14px] text-white/80">
          Start for free and only pay as you grow. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="rounded-xl bg-white text-foreground shadow-sm border border-border p-5 sm:p-6">
          <div className="mb-3">
            <div className="text-[16px] font-medium">Free Tier</div>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-[28px] font-bold">$0</span>
              <span className="text-[12px] text-foreground/60">/month</span>
            </div>
          </div>

          <ul className="space-y-2 mb-5">
            <Feature>3.0% transaction fee</Feature>
            <Feature>1.0% currency conversion margin</Feature>
            <Feature>Basic dashboard access</Feature>
            <Feature>Standard customer support</Feature>
            <Feature>Up to $10,000 monthly volume</Feature>
          </ul>

          <Button className="w-full text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Get Started</Button>
        </div>

        {/* Premium */}
        <div className="rounded-xl bg-white text-foreground shadow-sm border border-border p-5 sm:p-6 relative">
          <span className="absolute right-4 top-4 text-[11px] px-2 py-1 rounded bg-[color:var(--brand-blue)] text-white">POPULAR</span>
          <div className="mb-3">
            <div className="text-[16px] font-medium">Premium</div>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-[28px] font-bold" style={{ color: "var(--brand-blue)" }}>$49</span>
              <span className="text-[12px] text-foreground/60">/month</span>
            </div>
          </div>

          <ul className="space-y-2 mb-5">
            <Feature>1.5% transaction fee</Feature>
            <Feature>0.6% currency conversion margin</Feature>
            <Feature>Advanced analytics dashboard</Feature>
            <Feature>Same‑day customer support</Feature>
            <Feature>Unlimited monthly volume</Feature>
            <Feature>Custom integration support</Feature>
          </ul>

          <Button className="w-full text-white" style={{ backgroundColor: "var(--brand-blue)" }}>Start Premium</Button>
        </div>
      </div>

      <div className="text-center mt-6 text-[13px] text-white/80">
        Need a custom solution? <a href="#contact" className="underline">Contact our sales team</a>
      </div>
    </SectionShell>
  )
}

export function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{ background: "var(--brand-gradient)", borderColor: "var(--brand-navy)" }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-white/90 text-[14px]">
          <div className="md:col-span-2">
            <div className="text-white font-semibold mb-2">KleverPay</div>
            <p className="text-white/80 text-[13px] max-w-sm">
              Enabling fast and crypto payments for African merchants and global customers.
            </p>
            <div className="mt-3 flex items-center gap-3 text-white/80">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>

          <div>
            <div className="font-medium text-white mb-2">Product</div>
            <ul className="space-y-1 text-white/80">
              <li><a href="#" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">API Documentation</a></li>
              <li><a href="#" className="hover:underline">Integrations</a></li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-white mb-2">Company</div>
            <ul className="space-y-1 text-white/80">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Team</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-white mb-2">Legal</div>
            <ul className="space-y-1 text-white/80">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Security</a></li>
              <li><a href="#" className="hover:underline">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-4 text-center text-white/70 text-[12px]">
          © 2025 KleverPay by Team A. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
