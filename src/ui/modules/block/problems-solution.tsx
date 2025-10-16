'use client'
import { CheckCircle2, XCircle, Clock, Percent, Globe } from "lucide-react"
import { motion } from "framer-motion"

export function ProblemsSolution() {
  return (
    <section className="w-full bg-[oklch(0.708_0_0)]/20">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-20 lg:px-28 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
          {/* Problem card */}
          <motion.div 
            className="rounded-xl bg-card text-card-foreground shadow-sm border border-border p-6 sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="text-[oklch(0.704_0.191_22.216)]" />
              <h3 className="text-[18px] font-semibold">The Problem</h3>
            </div>
            <p className="text-[14px] text-foreground/80 mb-4">
              Cross-border payments are slow, expensive, and limited in Africa.
            </p>
            <ul className="space-y-3 text-[14px] text-foreground/80">
              <li className="flex items-start gap-3"><Clock className="mt-0.5 size-4 text-muted-foreground"/>Traditional bank transfers can take 3–5 business days to settle internationally.</li>
              <li className="flex items-start gap-3"><Percent className="mt-0.5 size-4 text-muted-foreground"/>High transaction fees ranging from 5–15% on cross-border payments.</li>
              <li className="flex items-start gap-3"><Globe className="mt-0.5 size-4 text-muted-foreground"/>Limited currency options and poor exchange rates for African businesses.</li>
            </ul>
          </motion.div>

          {/* Solution card */}
          <motion.div 
            className="rounded-xl bg-card text-card-foreground shadow-sm border border-border p-6 sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="text-green-500" />
              <h3 className="text-[18px] font-semibold">Our Solution</h3>
            </div>
            <p className="text-[14px] text-foreground/80 mb-4">
              KleverPay integrates multiple payment systems for instant settlements.
            </p>
            <ul className="space-y-3 text-[14px] text-foreground/80">
              <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 text-green-500"/>Flutterwave and OPay integration for seamless fiat transactions.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 text-green-500"/>Uniswap/1inch for crypto, enabling instant settlements in USD or USDT.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 text-green-500"/>Transparent conversions with rates displayed before transaction.</li>
              <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 text-green-500"/>Simple API integration with just a few lines of code.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
