"use client"

import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Shield, Smartphone, Key, AlertTriangle } from "lucide-react"

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="space-y-6">
      {/* Connected Wallet */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Connected Wallet</h2>
          <p className="text-sm text-gray-600 mt-1">Your Web3 wallet for authentication</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1E73FF]/10 rounded-lg">
                <Key className="size-5 text-[#1E73FF]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">0x742d...5f0bEb</p>
                <p className="text-xs text-gray-600">Connected via Web3Auth</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Smartphone className="size-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Authenticator App</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Use an authenticator app like Google Authenticator or Authy
                </p>
                {twoFactorEnabled && (
                  <p className="text-xs text-green-600 mt-2 font-medium">2FA is currently enabled</p>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
            </label>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your active sessions across devices</p>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Chrome on MacOS</p>
                <p className="text-xs text-gray-600">Lagos, Nigeria • Current session</p>
                <p className="text-xs text-gray-600 mt-1">Last active: Just now</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Firefox on Windows</p>
                <p className="text-xs text-gray-600">Abuja, Nigeria</p>
                <p className="text-xs text-gray-600 mt-1">Last active: 2 hours ago</p>
              </div>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                Revoke
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4">
          Revoke All Other Sessions
        </Button>
      </div>

      {/* Security Audit Log */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Security Audit Log</h2>
          <p className="text-sm text-gray-600 mt-1">Recent security-related activities on your account</p>
        </div>

        <div className="space-y-3">
          {[
            { action: "Wallet connected", timestamp: "2023-08-15 14:30", status: "success" },
            { action: "API key created", timestamp: "2023-08-14 10:15", status: "success" },
            { action: "Webhook added", timestamp: "2023-08-13 09:42", status: "success" },
            { action: "Failed login attempt", timestamp: "2023-08-12 18:20", status: "warning" },
          ].map((log, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`p-1.5 rounded-full ${
                  log.status === "success" ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                {log.status === "success" ? (
                  <Shield className="size-4 text-green-600" />
                ) : (
                  <AlertTriangle className="size-4 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-600">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="size-5 text-red-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700 mt-1">Irreversible and destructive actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Disconnect Wallet
          </Button>
          <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
