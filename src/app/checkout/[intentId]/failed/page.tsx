"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/ui/modules/components/button"
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react"

export default function PaymentFailedPage() {
  const params = useParams()
  const router = useRouter()
  const intentId = params.intentId as string

  const errorDetails = {
    errorCode: "PAYMENT_DECLINED",
    message: "Your payment was declined by your bank.",
    transactionId: "TRX-2023-89452",
    merchantName: "Acme Store",
    amount: "$150.00",
    orderId: "ORD-2023-12345",
    date: new Date().toLocaleString(),
  }

  const commonReasons = [
    "Insufficient funds in your account",
    "Card expired or invalid",
    "Payment limit exceeded",
    "Network or connectivity issues",
    "Card blocked for online transactions",
  ]

  const handleRetry = () => {
    router.push(`/checkout/${intentId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E9086] to-[#073863] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Failed Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="size-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-2">{errorDetails.message}</p>
          <p className="text-sm text-gray-500 mb-8">Error Code: {errorDetails.errorCode}</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-xs font-medium text-gray-900">
                {errorDetails.transactionId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merchant</span>
              <span className="font-medium text-gray-900">{errorDetails.merchantName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-xs font-medium text-gray-900">
                {errorDetails.orderId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">{errorDetails.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium text-gray-900 text-xs">{errorDetails.date}</span>
            </div>
          </div>

          {/* Common Reasons */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="size-4 text-yellow-700 mt-0.5 shrink-0" />
              <h3 className="text-sm font-semibold text-yellow-900">Common reasons for failure:</h3>
            </div>
            <ul className="text-xs text-yellow-800 space-y-1 ml-6">
              {commonReasons.map((reason, idx) => (
                <li key={idx} className="list-disc">
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white"
            >
              <ArrowLeft className="size-4 mr-2" />
              Try Again
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.close()}
            >
              Cancel Payment
            </Button>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-600">
              Need help?{" "}
              <button className="text-[#1E73FF] hover:underline font-medium">
                Contact Support
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">Powered by KlevaPay</p>
        </div>
      </div>
    </div>
  )
}
