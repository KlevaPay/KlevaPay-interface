"use client"
import Image from "next/image"
import { Button } from "@/ui/modules/components"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section
      id="home"
      className="w-full h-full"
      style={{
        background: "var(--brand-gradient)",
      }}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-20 lg:px-28 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[28px] sm:text-[36px] md:text-[40px] leading-tight font-extrabold text-foreground">
            Seamless Fiat and Crypto
            <br />
            Payments for Africa
          </h1>
          <p className="text-[15px] sm:text-[16px] sm:text-[1.2rem] text-foreground/80">
            Pay in Naira, USD, USDT, or ETH, Settle Instantly in USD or USDT.
          </p>
          <p className="text-[13px] sm:text-[14px] lg:text-[1rem] text-foreground/60">
            Low fees, fast conversions, secure integrations.
          </p>

            <Button
              size="lg"
              className="text-white"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              Get Started for Free
              <span className="ml-2 inline-block">→</span>
            </Button>
        </motion.div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/70 backdrop-blur">
            <Image
              src="/logo.png"
              alt="KleverPay Graphic Placeholder"
              fill
              className="object-contain p-8"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
