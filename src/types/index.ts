// ============================================================================
// KLEVAPAY TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------------

export enum Currency {
  NGN = "NGN",
  USD = "USD",
  USDT = "USDT",
  ETH = "ETH",
  EUR = "EUR",
  GBP = "GBP",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SETTLED = "SETTLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CRYPTO = "CRYPTO",
  WALLET = "WALLET",
}

export enum TransactionType {
  PAYMENT = "PAYMENT",
  SETTLEMENT = "SETTLEMENT",
  REFUND = "REFUND",
  WITHDRAWAL = "WITHDRAWAL",
}

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING_KYC = "PENDING_KYC",
  SUSPENDED = "SUSPENDED",
}

export enum KYCStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REQUIRES_UPDATE = "REQUIRES_UPDATE",
}

export enum WebhookEventType {
  PAYMENT_CREATED = "payment.created",
  PAYMENT_SUCCESSFUL = "payment.successful",
  PAYMENT_FAILED = "payment.failed",
  SETTLEMENT_COMPLETED = "settlement.completed",
  REFUND_PROCESSED = "refund.processed",
}

export enum SettlementCurrency {
  USD = "USD",
  USDT = "USDT",
  NGN = "NGN",
}

// ----------------------------------------------------------------------------
// Core Types
// ----------------------------------------------------------------------------

export interface Merchant {
  id: string
  email: string
  businessName: string
  businessType?: string
  country: string
  status: MerchantStatus
  kycStatus: KYCStatus
  apiKey?: string
  secretKey?: string
  settlementCurrency: SettlementCurrency
  webhookUrl?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  id: string
  merchantId: string
  orderId: string
  amount: number
  currency: Currency
  targetCurrency: SettlementCurrency
  status: PaymentStatus
  checkoutUrl: string
  widgetToken: string
  customerEmail?: string
  customerName?: string
  description?: string
  metadata?: Record<string, any>
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  merchantId: string
  paymentIntentId?: string
  type: TransactionType
  amount: number
  currency: Currency
  status: PaymentStatus
  paymentMethod?: PaymentMethod
  customerName?: string
  customerEmail?: string
  transactionHash?: string
  providerReference?: string
  fee?: number
  netAmount?: number
  convertedAmount?: number
  convertedCurrency?: Currency
  conversionRate?: number
  description?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  customer: string
  amount: string
  method: string
  status: string
  date: string
}

export interface Balance {
  currency: Currency
  available: number
  pending: number
  total: number
}

export interface PayoutPreference {
  settlementCurrency: SettlementCurrency
  autoSettle: boolean
  minimumSettlementAmount?: number
  bankDetails?: {
    accountName?: string
    accountNumber?: string
    bankName?: string
    bankCode?: string
  }
  cryptoAddress?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  secretKey?: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export interface Webhook {
  id: string
  url: string
  events: WebhookEventType[]
  secret: string
  isActive: boolean
  createdAt: string
  lastTriggered?: string
}

export interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  totalTransactions: number
  totalVolume: number
  currency: Currency
  lastPayment?: string
  createdAt: string
}

export interface AnalyticsData {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  averageTransactionValue: number
  period: "today" | "week" | "month" | "year"
  revenueByPeriod: Array<{
    date: string
    amount: number
  }>
  transactionsByStatus: Record<PaymentStatus, number>
  transactionsByCurrency: Record<Currency, number>
  transactionsByMethod: Record<PaymentMethod, number>
}

export interface KYCData {
  businessName: string
  businessType: string
  registrationNumber?: string
  taxId?: string
  country: string
  address: string
  city: string
  postalCode: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  phoneNumber: string
  idType?: "passport" | "national_id" | "drivers_license"
  idNumber?: string
  idDocument?: File | string
  businessDocument?: File | string
  proofOfAddress?: File | string
}

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  metadata?: {
    page?: number
    limit?: number
    total?: number
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// ----------------------------------------------------------------------------
// Form Types
// ----------------------------------------------------------------------------

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  businessName: string
  acceptTerms: boolean
}

export interface SignInForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  token: string
  password: string
  confirmPassword: string
}

export interface PaymentIntentForm {
  orderId: string
  amount: number
  currency: Currency
  targetCurrency: SettlementCurrency
  customerEmail?: string
  customerName?: string
  description?: string
  redirectUrl?: string
  webhookUrl?: string
}

// ----------------------------------------------------------------------------
// Component Props Types
// ----------------------------------------------------------------------------

export interface BalanceCardProps {
  currency: string
  label: string
  amount: string
  trend?: {
    value: string
    direction: "up" | "down"
    note?: string
  }
}

export interface TransactionTableItem {
  id: string
  customer: string
  amount: string
  status: string
  date: string
}

export interface ConversionRate {
  from: Currency
  to: Currency
  rate: number
  timestamp: string
}

// ----------------------------------------------------------------------------
// Checkout Widget Types
// ----------------------------------------------------------------------------

export interface CheckoutWidgetConfig {
  paymentIntentId: string
  merchantName: string
  amount: number
  currency: Currency
  description?: string
  customerEmail?: string
  onSuccess?: (transaction: Transaction) => void
  onError?: (error: Error) => void
  onCancel?: () => void
}

export interface PaymentMethodOption {
  id: PaymentMethod
  name: string
  icon: string
  enabled: boolean
  processingTime: string
  fee?: string
}
