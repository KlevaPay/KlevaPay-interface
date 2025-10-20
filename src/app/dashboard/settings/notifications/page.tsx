"use client"

import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Save } from "lucide-react"

interface NotificationSettings {
  email: {
    paymentReceived: boolean
    paymentFailed: boolean
    settlementCompleted: boolean
    weeklyReport: boolean
    monthlyReport: boolean
  }
  push: {
    paymentReceived: boolean
    paymentFailed: boolean
    settlementCompleted: boolean
  }
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      paymentReceived: true,
      paymentFailed: true,
      settlementCompleted: true,
      weeklyReport: true,
      monthlyReport: false,
    },
    push: {
      paymentReceived: true,
      paymentFailed: true,
      settlementCompleted: false,
    },
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Add API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const updateEmailSetting = (key: keyof NotificationSettings["email"]) => {
    setSettings((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: !prev.email[key] },
    }))
  }

  const updatePushSetting = (key: keyof NotificationSettings["push"]) => {
    setSettings((prev) => ({
      ...prev,
      push: { ...prev.push, [key]: !prev.push[key] },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">Choose which emails you&apos;d like to receive</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Payment Received</h3>
              <p className="text-xs text-gray-600 mt-1">Get notified when you receive a payment</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.paymentReceived}
                onChange={() => updateEmailSetting("paymentReceived")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Payment Failed</h3>
              <p className="text-xs text-gray-600 mt-1">Get notified when a payment fails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.paymentFailed}
                onChange={() => updateEmailSetting("paymentFailed")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Settlement Completed</h3>
              <p className="text-xs text-gray-600 mt-1">Get notified when funds are settled to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.settlementCompleted}
                onChange={() => updateEmailSetting("settlementCompleted")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Weekly Report</h3>
              <p className="text-xs text-gray-600 mt-1">Receive a weekly summary of your transactions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.weeklyReport}
                onChange={() => updateEmailSetting("weeklyReport")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Monthly Report</h3>
              <p className="text-xs text-gray-600 mt-1">Receive a monthly summary of your performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email.monthlyReport}
                onChange={() => updateEmailSetting("monthlyReport")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">Manage browser push notifications</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Payment Received</h3>
              <p className="text-xs text-gray-600 mt-1">Get push notifications for new payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push.paymentReceived}
                onChange={() => updatePushSetting("paymentReceived")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Payment Failed</h3>
              <p className="text-xs text-gray-600 mt-1">Get push notifications for failed payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push.paymentFailed}
                onChange={() => updatePushSetting("paymentFailed")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Settlement Completed</h3>
              <p className="text-xs text-gray-600 mt-1">Get push notifications for settlements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.push.settlementCompleted}
                onChange={() => updatePushSetting("settlementCompleted")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white"
        >
          <Save className="size-4 mr-2" />
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
