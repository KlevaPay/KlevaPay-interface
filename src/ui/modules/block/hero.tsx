"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/ui/modules/components"
import { motion } from "framer-motion"
import { useWeb3Auth } from "@/providers/web3auth-provider"
import { useAccount } from "wagmi"
import { AuthMethodModal } from "@/ui/modules/components/auth-method-modal"
import { useAuth } from "@/hooks/useAuth"

export function Hero() {
  const router = useRouter()
  const { isConnected: w3aConnected } = useWeb3Auth()
  const { isConnected: walletConnected } = useAccount()
  const { merchant } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const isConnected = w3aConnected || walletConnected

  const handleGetStarted = () => {
    // If wallet is not connected, show the auth modal to connect
    if (!isConnected) {
      setShowAuthModal(true)
      return
    }

    // If wallet is connected, route based on merchant profile
    if (merchant) {
      // Has merchant profile - route to merchant dashboard
      router.push("/dashboard/merchant")
    } else {
      // No merchant profile - route to create profile
      router.push("/onboarding/create-profile")
    }
  }

  const getButtonText = () => {
    if (isConnected) return "Continue"
    return "Get Started for Free"
  }

  return (
    <>
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

            <div className="flex items-center gap-6">
              <Button
                size="lg"
                className="text-white"
                style={{ backgroundColor: "var(--brand-blue)" }}
                onClick={handleGetStarted}
              >
                {getButtonText()} <span className="ml-2 inline-block">→</span>
              </Button>
              <Button
                size="lg"
                className="text-white"
                style={{ backgroundColor: "var(--brand-blue)" }}
                onClick={() => router.push("/hosted-checkout")}
              >
                View Demo <span className="ml-2 inline-block">→</span>
              </Button>
            </div>
          </motion.div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/70 backdrop-blur">
              <Image
                src="/logo.png"
                alt="KlevaPay Graphic Placeholder"
                fill
                className="object-contain p-8"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Auth Method Modal */}
      <AuthMethodModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}

