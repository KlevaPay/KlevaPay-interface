"use client"

import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { WebhookEventType } from "@/types"

interface WebhookItem {
  id: string
  url: string
  events: WebhookEventType[]
  secret: string
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  status: "healthy" | "failing"
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    {
      id: "wh_001",
      url: "https://api.mystore.com/webhooks/klevapay",
      events: [WebhookEventType.PAYMENT_SUCCESSFUL, WebhookEventType.PAYMENT_FAILED, WebhookEventType.SETTLEMENT_COMPLETED],
      secret: "whsec_xxxxxxxxxxxxxxxx",
      isActive: true,
      createdAt: "2023-06-15",
      lastTriggered: "2023-08-15 14:30",
      status: "healthy",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    events: [] as WebhookEventType[],
  })

  const availableEvents: { value: WebhookEventType; label: string; description: string }[] = [
    {
      value: WebhookEventType.PAYMENT_CREATED,
      label: "Payment Created",
      description: "Triggered when a new payment is initiated",
    },
    {
      value: WebhookEventType.PAYMENT_SUCCESSFUL,
      label: "Payment Successful",
      description: "Triggered when a payment is completed successfully",
    },
    {
      value: WebhookEventType.PAYMENT_FAILED,
      label: "Payment Failed",
      description: "Triggered when a payment fails",
    },
    {
      value: WebhookEventType.SETTLEMENT_COMPLETED,
      label: "Settlement Completed",
      description: "Triggered when funds are settled to your account",
    },
    {
      value: WebhookEventType.REFUND_PROCESSED,
      label: "Refund Processed",
      description: "Triggered when a refund is processed",
    },
  ]

  const handleCreateWebhook = () => {
    // TODO: Add API call
    setIsCreating(false)
    setNewWebhook({ url: "", events: [] })
  }

  const handleDeleteWebhook = (webhookId: string) => {
    // TODO: Add confirmation and API call
    setWebhooks((prev) => prev.filter((wh) => wh.id !== webhookId))
  }

  const toggleWebhookStatus = (webhookId: string) => {
    // TODO: Add API call
    setWebhooks((prev) =>
      prev.map((wh) => (wh.id === webhookId ? { ...wh, isActive: !wh.isActive } : wh))
    )
  }

  const toggleEvent = (event: WebhookEventType) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Webhooks List */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Webhooks</h2>
            <p className="text-sm text-gray-600 mt-1">Receive real-time notifications about payment events</p>
          </div>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white"
          >
            <Plus className="size-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        {/* Create Webhook Form */}
        {isCreating && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Create New Webhook</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Webhook URL</label>
                <Input
                  placeholder="https://your-domain.com/webhooks/klevapay"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Events to Subscribe</label>
                <div className="space-y-2">
                  {availableEvents.map((event) => (
                    <label
                      key={event.value}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event.value)}
                        onChange={() => toggleEvent(event.value)}
                        className="mt-0.5 h-4 w-4 text-[#1E73FF] border-gray-300 rounded focus:ring-[#1E73FF]"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.label}</div>
                        <div className="text-xs text-gray-600">{event.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateWebhook}
                  disabled={!newWebhook.url || newWebhook.events.length === 0}
                  className="bg-[#1E73FF] text-white"
                >
                  Create Webhook
                </Button>
                <Button onClick={() => setIsCreating(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Webhooks Table */}
        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No webhooks configured yet.</p>
              <p className="text-sm mt-1">Click &quot;Add Webhook&quot; to get started.</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <div key={webhook.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{webhook.url}</h3>
                      {webhook.status === "healthy" ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : (
                        <XCircle className="size-4 text-red-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      Created: {webhook.createdAt}
                      {webhook.lastTriggered && ` • Last triggered: ${webhook.lastTriggered}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={webhook.isActive}
                        onChange={() => toggleWebhookStatus(webhook.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E73FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E73FF]" />
                    </label>
                  </div>
                </div>

                {/* Events */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subscribed Events</label>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secret */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Signing Secret</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                    {webhook.secret}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Use this secret to verify webhook signatures</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-yellow-600 hover:text-yellow-700">
                    <RefreshCw className="size-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Webhook Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-1">Webhook Integration Guide</h3>
        <p className="text-sm text-blue-700 mb-3">
          Learn how to receive and verify webhook events in your application.
        </p>
        <Button variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100">
          View Webhook Documentation →
        </Button>
      </div>
    </div>
  )
}
