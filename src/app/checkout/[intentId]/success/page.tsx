"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/ui/modules/components/button"
import { CheckCircle2, Download, ArrowRight } from "lucide-react"

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const intentId = params.intentId as string

  const paymentDetails = {
    transactionId: "TRX-2023-89451",
    merchantName: "Acme Store",
    amount: "$150.00",
    currency: "USD",
    paymentMethod: "Card",
    date: new Date().toLocaleString(),
    orderId: "ORD-2023-12345",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E9086] to-[#073863] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your payment has been processed successfully.</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-xs font-medium text-gray-900">
                {paymentDetails.transactionId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merchant</span>
              <span className="font-medium text-gray-900">{paymentDetails.merchantName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-xs font-medium text-gray-900">
                {paymentDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">{paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">{paymentDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium text-gray-900 text-xs">{paymentDetails.date}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white">
              <Download className="size-4 mr-2" />
              Download Receipt
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.close()}
            >
              Close Window
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>

          {/* Email Notification */}
          <p className="text-xs text-gray-600 mt-6">
            A confirmation email has been sent to your email address.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">Powered by KlevaPay</p>
        </div>
      </div>
    </div>
  )
}
