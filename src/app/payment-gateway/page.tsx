import { Navbar } from "@/ui/modules/partial/navbar"
import { PaymentGatewayPage } from "@/ui/pages/payment-gateway"
import { Footer } from "@/ui/modules/block/pricing"

export default function PaymentGateway() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PaymentGatewayPage />
      <Footer />
    </main>
  )
}
