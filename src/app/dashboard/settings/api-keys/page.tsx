"use client"

import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { Copy, Eye, EyeOff, Plus, Trash2, RefreshCw } from "lucide-react"

interface ApiKeyItem {
  id: string
  name: string
  key: string
  secretKey: string
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    {
      id: "key_001",
      name: "Production API Key",
      key: "pk_live_51H9xxxxxxxxxxxxxxxxxxx",
      secretKey: "sk_live_51H9xxxxxxxxxxxxxxxxxxx",
      isActive: true,
      createdAt: "2023-06-15",
      lastUsed: "2023-08-15 14:30",
    },
    {
      id: "key_002",
      name: "Development API Key",
      key: "pk_test_51H9xxxxxxxxxxxxxxxxxxx",
      secretKey: "sk_test_51H9xxxxxxxxxxxxxxxxxxx",
      isActive: true,
      createdAt: "2023-06-10",
      lastUsed: "2023-08-14 09:12",
    },
  ])

  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")

  const toggleSecretVisibility = (keyId: string) => {
    setShowSecret((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  const handleCreateKey = () => {
    setIsCreating(true)
    // TODO: Add API call to create new key
    setTimeout(() => {
      setIsCreating(false)
      setNewKeyName("")
    }, 1000)
  }

  const handleDeleteKey = (keyId: string) => {
    // TODO: Add confirmation dialog and API call
    setApiKeys((prev) => prev.filter((key) => key.id !== keyId))
  }

  const handleRegenerateKey = (keyId: string) => {
    // TODO: Add confirmation dialog and API call
    console.log("Regenerating key:", keyId)
  }

  return (
    <div className="space-y-6">
      {/* API Keys List */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your API keys for integration</p>
          </div>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white"
          >
            <Plus className="size-4 mr-2" />
            Create New Key
          </Button>
        </div>

        {/* Create New Key Form */}
        {isCreating && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Create New API Key</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter key name (e.g., Production API)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCreateKey} className="bg-[#1E73FF] text-white">
                Create
              </Button>
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* API Keys Table */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{apiKey.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Created: {apiKey.createdAt}
                    {apiKey.lastUsed && ` • Last used: ${apiKey.lastUsed}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      apiKey.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {apiKey.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Public Key */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Public Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                    {apiKey.key}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="shrink-0"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Secret Key */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Secret Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                    {showSecret[apiKey.id] ? apiKey.secretKey : "••••••••••••••••••••••••••"}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSecretVisibility(apiKey.id)}
                    className="shrink-0"
                  >
                    {showSecret[apiKey.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey.secretKey)}
                    className="shrink-0"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRegenerateKey(apiKey.id)}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <RefreshCw className="size-4 mr-1" />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteKey(apiKey.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="size-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-1">Need help integrating?</h3>
        <p className="text-sm text-blue-700 mb-3">
          Check out our comprehensive API documentation to get started with KlevaPay.
        </p>
        <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100">
          View API Documentation →
        </Button>
      </div>
    </div>
  )
}
