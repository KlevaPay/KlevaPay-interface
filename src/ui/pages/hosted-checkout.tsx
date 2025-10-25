"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
  CreditCard,
  Wallet,
  Landmark,
  ShieldCheck,
  Headset,
  Copy,
  Loader2,
  Smartphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button, Input } from "@/ui/modules/components"
import { PaymentMethod, Currency } from "@/types"
import { cn } from "@/common/lib/utils"
import { useAccount } from "wagmi"
import { usePayWithToken } from "@/common/hooks/paywithtoken"

const hostedPaymentIntent = {
  merchantName: "BrightTech Gadgets",
  description: "Smart Home Automation Bundle",
  amount: 5000,
  currency: Currency.NGN,
  orderId: "KP-REF-1697616000123",
  customerSupportEmail: "support@brighttech.africa",
  customerSupportPhone: "+234 700 555 1212",
}

const conversionRates: Record<Currency, number> = {
  [Currency.USD]: 1,
  [Currency.NGN]: 1650,
  [Currency.USDT]: 1,
  [Currency.ETH]: 0.00039,
  [Currency.EUR]: 0.92,
  [Currency.GBP]: 0.79,
}

const paymentOptions: Array<{
  id: PaymentMethod
  label: string
  description: string
  icon: LucideIcon
  footer: string
}> = [
  {
    id: PaymentMethod.CARD,
    label: "Pay with card",
    description: "Instant confirmation for debit, credit, and virtual cards (3-D Secure supported).",
    icon: CreditCard,
    footer: "Cards billed as KLEVAPAY*BrightTech",
  },
  {
    id: PaymentMethod.CRYPTO,
    label: "Pay with crypto",
    description: "Send USDT or ETH at market rates with automatic conversion to the merchant's settlement currency.",
    icon: Wallet,
    footer: "Polygon network • rate locked for 10 minutes",
  },
  {
    id: PaymentMethod.BANK_TRANSFER,
    label: "Bank transfer",
    description: "Move funds to a KlevaPay virtual account and get confirmation within minutes of payment proof.",
    icon: Landmark,
    footer: "Receipts processed 24/7",
  },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const explorerUrls: Record<number, string> = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
  80002: "https://amoy.polygonscan.com",
  8453: "https://basescan.org",
}

type CheckoutStatus = "idle" | "processing" | "redirecting" | "awaiting_payment" | "success"

interface BankPaymentDetails {
  accountNumber?: string
  bankName?: string
  reference?: string
  expiresAt?: string
  amount?: number
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" ? (value as Record<string, unknown>) : null

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined)

const asNumber = (value: unknown): number | undefined => (typeof value === "number" ? value : undefined)

const asBoolean = (value: unknown): boolean | undefined =>
  typeof value === "boolean" ? value : undefined

const mapMethodToGateway = (method: PaymentMethod): "card" | "bank_transfer" | "crypto" | null => {
  switch (method) {
    case PaymentMethod.CARD:
      return "card"
    case PaymentMethod.BANK_TRANSFER:
      return "bank_transfer"
    case PaymentMethod.CRYPTO:
      return "crypto"
    default:
      return null
  }
}

const formatCurrency = (value: number, code: Currency): string => {
  switch (code) {
    case Currency.NGN:
      return `₦${value.toLocaleString()}`
    case Currency.USD:
      return `$${value.toFixed(2)}`
    case Currency.EUR:
      return `€${value.toFixed(2)}`
    case Currency.GBP:
      return `£${value.toFixed(2)}`
    case Currency.USDT:
    case Currency.ETH:
    default:
      return `${value.toLocaleString()} ${code}`
  }
}

export function HostedCheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CARD)
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle")
  const [customer, setCustomer] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+2348123456789",
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cryptoCurrency, setCryptoCurrency] = useState<"USDT" | "ETH">("USDT")
  const [bankDetails, setBankDetails] = useState<BankPaymentDetails | null>(null)
  const [txRef, setTxRef] = useState(() => hostedPaymentIntent.orderId)
  const [cryptoError, setCryptoError] = useState<string | null>(null)
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null)
  const [isCryptoProcessing, setIsCryptoProcessing] = useState(false)

  const { isConnected, chainId } = useAccount()
  const { payWithToken } = usePayWithToken()

  useEffect(() => {
    setCheckoutStatus("idle")
    setErrorMessage(null)
    if (selectedMethod !== PaymentMethod.BANK_TRANSFER) {
      setBankDetails(null)
    }
    if (selectedMethod !== PaymentMethod.CRYPTO) {
      setCryptoError(null)
      setCryptoTxHash(null)
      setIsCryptoProcessing(false)
    }
  }, [selectedMethod])

  const isProcessing = checkoutStatus === "processing"
  const isRedirecting = checkoutStatus === "redirecting"
  const isAwaitingPayment = checkoutStatus === "awaiting_payment"
  const isSuccess = checkoutStatus === "success"

  const amountInNaira =
    hostedPaymentIntent.currency === Currency.NGN
      ? hostedPaymentIntent.amount
      : Math.round(hostedPaymentIntent.amount * conversionRates[Currency.NGN])

  const usdEquivalent =
    hostedPaymentIntent.currency === Currency.USD
      ? hostedPaymentIntent.amount
      : hostedPaymentIntent.amount / conversionRates[Currency.NGN]

  const usdtEstimate = usdEquivalent
  const ethEstimate = usdEquivalent * conversionRates[Currency.ETH]
  const explorerBaseUrl = chainId ? explorerUrls[chainId] : undefined

  const handleCryptoPayment = useCallback(async () => {
    if (!isConnected) {
      setCryptoError("Connect your wallet to continue with crypto.")
      return
    }

    const amountString =
      cryptoCurrency === "USDT"
        ? usdtEstimate.toFixed(6)
        : ethEstimate.toFixed(6)

    const reference = `KP-REF-${Date.now()}`
    setTxRef(reference)

    setIsCryptoProcessing(true)
    setCryptoError(null)
    setCryptoTxHash(null)
    setCheckoutStatus("processing")

    try {
      const { hash, receipt } = await payWithToken({
        token: cryptoCurrency,
        amount: amountString,
        tokenDecimals: cryptoCurrency === "USDT" ? 6 : 18,
        txRef: reference,
      })

      setCryptoTxHash(hash)

      if (receipt.status === "success") {
        setCheckoutStatus("success")
      } else {
        setCheckoutStatus("idle")
        setCryptoError("Transaction reverted on-chain. Please try again.")
      }
    } catch (error) {
      setCheckoutStatus("idle")
      const message =
        error instanceof Error ? error.message : "Unable to process crypto payment."
      setCryptoError(message)
    } finally {
      setIsCryptoProcessing(false)
    }
  }, [
    cryptoCurrency,
    ethEstimate,
    isConnected,
    payWithToken,
    usdtEstimate,
  ])

  const shortenHash = (value: string) => `${value.slice(0, 6)}…${value.slice(-4)}`

  const handleCustomerChange = (field: "name" | "email" | "phone") => (value: string) =>
    setCustomer((prev) => ({ ...prev, [field]: value }))

  const copyToClipboard = async (value?: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.error("clipboard error", error)
    }
  }

  const startPayment = async () => {
    if (selectedMethod === PaymentMethod.CRYPTO) return

    if (!customer.name || !customer.email || !customer.phone) {
      setErrorMessage("Please fill in your name, email, and phone number before continuing.")
      return
    }

    if (!API_BASE_URL) {
      setErrorMessage("Payment service is unavailable. Please try again later.")
      return
    }

    const backendMethod = mapMethodToGateway(selectedMethod)

    if (!backendMethod || backendMethod === "crypto") {
      setErrorMessage("Unsupported payment method selected.")
      return
    }

    const reference = `KP-REF-${Date.now()}`
    setTxRef(reference)
    setErrorMessage(null)
    setCheckoutStatus("processing")
    if (selectedMethod === PaymentMethod.BANK_TRANSFER) {
      setBankDetails(null)
    }

    try {
      const response = await fetch(`${API_BASE_URL}api/pay/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: hostedPaymentIntent.amount,
          currency: hostedPaymentIntent.currency,
          method: backendMethod,
          customer,
          tx_ref: reference,
        }),
      })

      const body = (await response.json()) as unknown
      const bodyRecord = asRecord(body) ?? {}

      const successFlag = asBoolean(bodyRecord["success"])
      if (!response.ok || successFlag === false) {
        const message = asString(bodyRecord["message"]) ?? "Unable to create payment."
        throw new Error(message)
      }

      const payloadRecord = asRecord(bodyRecord["data"]) ?? bodyRecord

      if (selectedMethod === PaymentMethod.CARD) {
        const dataRecord = asRecord(payloadRecord["data"])
        const link =
          asString(payloadRecord["link"]) ??
          (dataRecord ? asString(dataRecord["link"]) : undefined)

        if (!link) {
          throw new Error("No checkout link returned by gateway.")
        }

        setCheckoutStatus("redirecting")
        window.location.href = link
        return
      }

      if (selectedMethod === PaymentMethod.BANK_TRANSFER) {
        const dataRecord = asRecord(payloadRecord["data"])
        const metaRecord =
          asRecord(payloadRecord["meta"]) ?? (dataRecord ? asRecord(dataRecord["meta"]) : null)
        const authorizationRecord =
          (metaRecord ? asRecord(metaRecord["authorization"]) : null) ??
          asRecord(payloadRecord["authorization"]) ??
          (dataRecord ? asRecord(dataRecord["authorization"]) : null)

        const accountNumber = authorizationRecord
          ? asString(authorizationRecord["transfer_account"]) ??
            asString(authorizationRecord["account_number"])
          : undefined

        const bankName = authorizationRecord
          ? asString(authorizationRecord["transfer_bank"]) ??
            asString(authorizationRecord["bank_name"])
          : undefined

        const expiresAt = authorizationRecord
          ? asString(authorizationRecord["account_expiration"])
          : undefined

        const referenceValue =
          (authorizationRecord &&
            (asString(authorizationRecord["transfer_reference"]) ??
              asString(authorizationRecord["bank_reference"]))) ??
          asString(payloadRecord["tx_ref"]) ??
          (dataRecord ? asString(dataRecord["tx_ref"]) : undefined) ??
          reference

        const amountValue =
          asNumber(payloadRecord["amount"]) ??
          (authorizationRecord ? asNumber(authorizationRecord["amount"]) : undefined) ??
          hostedPaymentIntent.amount

        setBankDetails({
          accountNumber,
          bankName,
          expiresAt,
          reference: referenceValue,
          amount: amountValue,
        })
        setCheckoutStatus("awaiting_payment")
        return
      }
    } catch (error) {
      console.error("create-payment error", error)
      const message =
        error instanceof Error ? error.message : "Unexpected error while creating payment."
      setErrorMessage(message)
      setCheckoutStatus("idle")
    }
  }

  const renderCustomerFields = () => (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm text-gray-700">
        <span className="font-medium">Full name</span>
        <Input
          placeholder="Jane Doe"
          value={customer.name}
          onChange={(event) => handleCustomerChange("name")(event.target.value)}
        />
      </label>
      <label className="block space-y-1 text-sm text-gray-700">
        <span className="font-medium">Email address</span>
        <Input
          type="email"
          placeholder="you@example.com"
          value={customer.email}
          onChange={(event) => handleCustomerChange("email")(event.target.value)}
        />
      </label>
      <label className="block space-y-1 text-sm text-gray-700">
        <span className="font-medium">Phone number</span>
        <Input
          placeholder="+2348123456789"
          value={customer.phone}
          onChange={(event) => handleCustomerChange("phone")(event.target.value)}
        />
      </label>
    </div>
  )

  const renderCardForm = () => (
    <div className="space-y-5">
      {renderCustomerFields()}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold text-blue-900">Secure card checkout</p>
        <p className="mt-1">
          You&apos;ll be redirected to Flutterwave&apos;s PCI-compliant page to complete your card payment.
        </p>
      </div>
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <Button
        className="w-full bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
        size="lg"
        onClick={startPayment}
        disabled={isProcessing || isRedirecting}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Processing...
          </>
        ) : isRedirecting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          `Pay ${formatCurrency(hostedPaymentIntent.amount, hostedPaymentIntent.currency)}`
        )}
      </Button>
      {!API_BASE_URL && (
        <p className="text-xs text-amber-600">
          Set <code className="font-mono text-amber-700">NEXT_PUBLIC_API_BASE_URL</code> to enable live card payments.
        </p>
      )}
    </div>
  )

  const renderCryptoForm = () => {
    const amountDisplay =
      cryptoCurrency === "USDT"
        ? `${usdtEstimate.toFixed(2)} USDT`
        : `${ethEstimate.toFixed(6)} ETH`

    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Pay {formatCurrency(hostedPaymentIntent.amount, hostedPaymentIntent.currency)} directly from your connected wallet.
        </p>
        <ConnectButton />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--brand-navy)]">
            Choose a token
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["USDT", "ETH"] as const).map((token) => {
              const tokenAmountDisplay =
                token === "USDT" ? `${usdtEstimate.toFixed(2)} USDT` : `${ethEstimate.toFixed(6)} ETH`

              return (
              <button
                key={token}
                type="button"
                onClick={() => setCryptoCurrency(token)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  cryptoCurrency === token
                    ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <p className="text-[15px] font-semibold text-[color:var(--brand-navy)]">{token}</p>
                  <p className="mt-2 text-xs text-gray-600">{tokenAmountDisplay}</p>
                </button>
              )
            })}
          </div>
        </div>

        {cryptoError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {cryptoError}
          </div>
        )}

        <Button
          className="w-full bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
          size="lg"
          onClick={() => void handleCryptoPayment()}
          disabled={isCryptoProcessing || !isConnected}
        >
          {isCryptoProcessing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Waiting for confirmation...
            </>
          ) : (
            `Pay ${amountDisplay}`
          )}
        </Button>

        {!isConnected && (
          <p className="text-xs text-amber-600">
            Connect a wallet above to pay with crypto.
          </p>
        )}

        {checkoutStatus === "processing" && isCryptoProcessing && (
          <p className="text-xs text-gray-500">
            Approve the transaction in your wallet. We&apos;ll confirm once it&apos;s mined on-chain.
          </p>
        )}

        <p className="text-xs text-gray-500">
          Settlement happens automatically to the merchant once the transaction is confirmed.
        </p>
      </div>
    )
  }

  const renderBankForm = () => {
    const referenceDisplay = bankDetails?.reference ?? txRef

    return (
      <div className="space-y-5">
        {renderCustomerFields()}
        {bankDetails ? (
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold text-emerald-900">Transfer details</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span>Bank</span>
                <strong>{bankDetails.bankName ?? "Pending"}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Account number</span>
                <div className="flex items-center gap-2">
                  <code className="rounded-md bg-white px-2 py-1 font-mono text-xs text-emerald-900">
                    {bankDetails.accountNumber ?? "—"}
                  </code>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-[color:var(--brand-blue)]"
                    onClick={() => void copyToClipboard(bankDetails.accountNumber)}
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Amount</span>
                <strong>{formatCurrency(bankDetails.amount ?? amountInNaira, Currency.NGN)}</strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Reference</span>
                <div className="flex items-center gap-2">
                  <code className="rounded-md bg-white px-2 py-1 font-mono text-xs text-emerald-900">
                    {referenceDisplay}
                  </code>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-[color:var(--brand-blue)]"
                    onClick={() => void copyToClipboard(referenceDisplay)}
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </button>
                </div>
              </div>
              {bankDetails.expiresAt && (
                <p className="text-xs text-emerald-800">
                  Expires: {new Date(bankDetails.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold text-[color:var(--brand-navy)]">Virtual account on demand</p>
            <p className="mt-1">
              We&apos;ll generate a dedicated virtual account for this payment. Transfers settle in minutes.
            </p>
          </div>
        )}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        <Button
          className="w-full bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
          size="lg"
          onClick={startPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating details...
            </>
          ) : bankDetails ? (
            "Regenerate bank transfer details"
          ) : (
            "Generate bank transfer details"
          )}
        </Button>
        {isAwaitingPayment && bankDetails && (
          <p className="text-xs text-gray-600">
            Keep this page open while you make the transfer. Use reference <span className="font-mono">{referenceDisplay}</span> so we can match your payment instantly.
          </p>
        )}
      </div>
    )
  }

  const renderMethodForm = () => {
    switch (selectedMethod) {
      case PaymentMethod.CARD:
        return renderCardForm()
      case PaymentMethod.CRYPTO:
        return renderCryptoForm()
      case PaymentMethod.BANK_TRANSFER:
        return renderBankForm()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F5FAFC]">
      <header className="border-b" style={{ borderColor: "var(--brand-navy-border)" }}>
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="KlevaPay logo" width={40} height={40} className="rounded-xl bg-white p-1 shadow" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-navy)]/70">Hosted checkout</p>
              <h1 className="text-xl font-semibold text-[color:var(--brand-navy)]">Secure payment via KlevaPay</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="size-4 text-[color:var(--brand-blue)]" />
            <span>PCI-DSS Level 1 • Encryption in transit & at rest</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1520px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="flex w-full flex-col gap-5 lg:w-[320px]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(7,56,99,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Order summary</p>
            <h2 className="mt-3 text-lg font-semibold text-[color:var(--brand-navy)]">
              {hostedPaymentIntent.description}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Merchant</span>
                <strong className="text-[color:var(--brand-navy)]">{hostedPaymentIntent.merchantName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Order ID</span>
                <code className="text-xs font-medium text-[color:var(--brand-blue)]">
                  {hostedPaymentIntent.orderId}
                </code>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#F0F7FA] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Amount due</p>
              <p className="mt-2 text-2xl font-bold text-[color:var(--brand-navy)]">
                {formatCurrency(hostedPaymentIntent.amount, hostedPaymentIntent.currency)}
              </p>
              <p className="text-xs text-gray-600">
                {hostedPaymentIntent.currency === Currency.NGN
                  ? `≈ ${formatCurrency(usdEquivalent, Currency.USD)}`
                  : `≈ ${formatCurrency(amountInNaira, Currency.NGN)}`}
              </p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[color:var(--brand-blue)]" />
                Trusted by 250+ African merchants
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="size-4 text-[color:var(--brand-blue)]" />
                Works on mobile, desktop, and in-app browsers
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(7,56,99,0.08)] text-sm text-gray-600">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Need help?</p>
            <div className="mt-3 flex items-start gap-3">
              <Headset className="size-5 text-[color:var(--brand-blue)]" />
              <div className="space-y-1">
                <p>We&apos;ll confirm your payment within minutes once sent.</p>
                <p>
                  Email: <a href={`mailto:${hostedPaymentIntent.customerSupportEmail}`} className="font-medium text-[color:var(--brand-blue)]">{hostedPaymentIntent.customerSupportEmail}</a>
                </p>
                <p>
                  Phone: <a href={`tel:${hostedPaymentIntent.customerSupportPhone}`} className="font-medium text-[color:var(--brand-blue)]">{hostedPaymentIntent.customerSupportPhone}</a>
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_14px_38px_rgba(7,56,99,0.1)]">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Select how to pay</p>
              <h2 className="mt-2 text-2xl font-semibold text-[color:var(--brand-navy)]">Choose a payment option</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedMethod(option.id)}
                  className={cn(
                    "group flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all",
                    selectedMethod === option.id
                      ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/5 shadow-[0_8px_24px_rgba(30,115,255,0.2)]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-2 shadow-sm">
                      <option.icon className="size-5 text-[color:var(--brand-blue)]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--brand-navy)]">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  <p className="mt-auto text-xs font-medium text-gray-500">{option.footer}</p>
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50/80 p-5">
              {isSuccess ? (
                <div className="space-y-3 text-center text-[color:var(--brand-navy)]">
                  <ShieldCheck className="mx-auto size-10 text-[color:var(--brand-blue)]" />
                  <h3 className="text-xl font-semibold">Payment submitted</h3>
                  <p className="text-sm text-gray-600">
                    We&apos;re confirming your payment. You&apos;ll be redirected automatically once the merchant receives a success callback.
                  </p>
                  {cryptoTxHash && (
                    <div className="mx-auto max-w-sm space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                      <p className="font-medium text-[color:var(--brand-navy)]">Transaction hash</p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                          {shortenHash(cryptoTxHash)}
                        </code>
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs font-medium text-[color:var(--brand-blue)]"
                          onClick={() => void copyToClipboard(cryptoTxHash)}
                        >
                          <Copy className="size-3.5" />
                          Copy
                        </button>
                      </div>
                      {explorerBaseUrl && (
                        <a
                          href={`${explorerBaseUrl}/tx/${cryptoTxHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-[color:var(--brand-blue)]"
                        >
                          View on block explorer
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                renderMethodForm()
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
