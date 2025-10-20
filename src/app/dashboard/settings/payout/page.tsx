"use client"

import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { Save, Plus, Trash2 } from "lucide-react"
import { SettlementCurrency } from "@/types"

export default function PayoutSettingsPage() {
  const [settlementCurrency, setSettlementCurrency] = useState<SettlementCurrency>(SettlementCurrency.USDT)
  const [autoSettle, setAutoSettle] = useState(true)
  const [minimumAmount, setMinimumAmount] = useState("100")

  const [bankDetails, setBankDetails] = useState({
    accountName: "Acme Corporation",
    accountNumber: "0123456789",
    bankName: "First Bank Nigeria",
    bankCode: "011",
  })

  const [cryptoAddress, setCryptoAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Add API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Settlement Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Settlement Preferences</h2>
          <p className="text-sm text-gray-600 mt-1">Choose how you want to receive your funds</p>
        </div>

        <div className="space-y-6">
          {/* Settlement Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Settlement Currency
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([SettlementCurrency.USD, SettlementCurrency.USDT, SettlementCurrency.NGN]).map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSettlementCurrency(currency)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    settlementCurrency === currency
                      ? "border-[#1E73FF] bg-[#1E73FF]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{currency}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {currency === SettlementCurrency.USD && "US Dollar"}
                      {currency === SettlementCurrency.USDT && "Tether (USDT)"}
                      {currency === SettlementCurrency.NGN && "Nigerian Naira"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto Settlement */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto Settlement</h3>
              <p className="text-xs text-gray-600 mt-1">Automatically settle funds when threshold is reached</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSettle}
                onChange={(e) => setAutoSettle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          {/* Minimum Settlement Amount */}
          {autoSettle && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Minimum Settlement Amount ({settlementCurrency})
              </label>
              <Input
                type="number"
                value={minimumAmount}
                onChange={(e) => setMinimumAmount(e.target.value)}
                placeholder="100"
              />
              <p className="text-xs text-gray-600 mt-1">
                Funds will be automatically settled when this threshold is reached
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bank Details (for USD/NGN) */}
      {(settlementCurrency === SettlementCurrency.USD || settlementCurrency === SettlementCurrency.NGN) && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Bank Account Details</h2>
            <p className="text-sm text-gray-600 mt-1">Add your bank account for fiat settlements</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Name</label>
              <Input
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number</label>
                <Input
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
                <Input
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Code</label>
              <Input
                value={bankDetails.bankCode}
                onChange={(e) => setBankDetails({ ...bankDetails, bankCode: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Crypto Wallet (for USDT) */}
      {settlementCurrency === SettlementCurrency.USDT && (
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Crypto Wallet Address</h2>
            <p className="text-sm text-gray-600 mt-1">Add your USDT wallet address for crypto settlements</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                USDT Wallet Address (Polygon/BSC)
              </label>
              <Input
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
                placeholder="0x..."
              />
              <p className="text-xs text-gray-600 mt-1">
                Make sure this address supports USDT on Polygon or BSC networks
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> Double-check your wallet address. Funds sent to an incorrect address
                cannot be recovered.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white"
        >
          <Save className="size-4 mr-2" />
          {isSaving ? "Saving..." : "Save Payout Settings"}
        </Button>
      </div>
    </div>
  )
}
