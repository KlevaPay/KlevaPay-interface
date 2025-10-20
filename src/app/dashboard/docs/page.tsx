"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language = "javascript", id }: { code: string; language?: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => copyCode(code, id)}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs"
        >
          {copiedCode === id ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">API Documentation</h1>
            <p className="text-[13px] text-foreground/70">Integrate KlevaPay into your application</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation */}
            <aside className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-sm border border-border p-4 sticky top-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contents</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    "Authentication",
                    "Create Payment Intent",
                    "Get Payment Status",
                    "Webhooks",
                    "Error Handling",
                    "Testing",
                    "SDKs",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-600 hover:text-[#1E73FF]"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Documentation Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Introduction */}
              <section className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
                <p className="text-gray-700 mb-4">
                  The KlevaPay API allows you to accept payments in multiple currencies (NGN, USD, USDT, ETH)
                  and receive settlements in your preferred currency.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">https://api.klevapay.com/v1</code>
                  </p>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
                <p className="text-gray-700 mb-4">
                  All API requests require authentication using your secret API key. Include it in the
                  Authorization header:
                </p>

                <CodeBlock
                  id="auth-header"
                  code={`Authorization: Bearer sk_live_your_secret_key_here`}
                />

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Warning:</strong> Never expose your secret key in client-side code or public
                    repositories.
                  </p>
                </div>
              </section>

              {/* Create Payment Intent */}
              <section id="create-payment-intent" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Payment Intent</h2>
                <p className="text-gray-700 mb-4">
                  Create a payment intent to initiate a new payment session.
                </p>

                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded mr-2">
                    POST
                  </span>
                  <code className="text-sm">/v1/payment-intents</code>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">Request Body</h3>
                <CodeBlock
                  id="create-payment-request"
                  language="json"
                  code={`{
  "orderId": "ORD-2023-12345",
  "amount": 150.00,
  "currency": "USD",
  "targetCurrency": "USDT",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "description": "Premium Subscription",
  "redirectUrl": "https://yoursite.com/success",
  "webhookUrl": "https://yoursite.com/webhooks/klevapay"
}`}
                />

                <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Response</h3>
                <CodeBlock
                  id="create-payment-response"
                  language="json"
                  code={`{
  "success": true,
  "data": {
    "id": "pi_abc123xyz",
    "orderId": "ORD-2023-12345",
    "amount": 150.00,
    "currency": "USD",
    "targetCurrency": "USDT",
    "status": "PENDING",
    "checkoutUrl": "https://checkout.klevapay.com/pi_abc123xyz",
    "widgetToken": "wt_xyz789abc",
    "expiresAt": "2023-08-15T16:30:00Z",
    "createdAt": "2023-08-15T14:30:00Z"
  }
}`}
                />

                <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Example (Node.js)</h3>
                <CodeBlock
                  id="create-payment-nodejs"
                  language="javascript"
                  code={`const axios = require('axios');

const response = await axios.post(
  'https://api.klevapay.com/v1/payment-intents',
  {
    orderId: 'ORD-2023-12345',
    amount: 150.00,
    currency: 'USD',
    targetCurrency: 'USDT',
    customerEmail: 'customer@example.com',
    description: 'Premium Subscription'
  },
  {
    headers: {
      'Authorization': 'Bearer sk_live_your_secret_key',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`}
                />
              </section>

              {/* Get Payment Status */}
              <section id="get-payment-status" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Payment Status</h2>
                <p className="text-gray-700 mb-4">
                  Retrieve the current status of a payment intent.
                </p>

                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mr-2">
                    GET
                  </span>
                  <code className="text-sm">/v1/payment-intents/:id</code>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">Response</h3>
                <CodeBlock
                  id="get-payment-response"
                  language="json"
                  code={`{
  "success": true,
  "data": {
    "id": "pi_abc123xyz",
    "orderId": "ORD-2023-12345",
    "amount": 150.00,
    "currency": "USD",
    "targetCurrency": "USDT",
    "status": "PAID",
    "paymentMethod": "CRYPTO",
    "transactionHash": "0x...",
    "createdAt": "2023-08-15T14:30:00Z",
    "paidAt": "2023-08-15T14:35:00Z"
  }
}`}
                />
              </section>

              {/* Webhooks */}
              <section id="webhooks" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhooks</h2>
                <p className="text-gray-700 mb-4">
                  KlevaPay sends webhook events to notify you about payment status changes.
                </p>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">Event Types</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  <li><code className="text-sm bg-gray-100 px-1 rounded">payment.created</code> - Payment intent created</li>
                  <li><code className="text-sm bg-gray-100 px-1 rounded">payment.successful</code> - Payment completed successfully</li>
                  <li><code className="text-sm bg-gray-100 px-1 rounded">payment.failed</code> - Payment failed</li>
                  <li><code className="text-sm bg-gray-100 px-1 rounded">settlement.completed</code> - Funds settled to your account</li>
                </ul>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">Webhook Payload</h3>
                <CodeBlock
                  id="webhook-payload"
                  language="json"
                  code={`{
  "event": "payment.successful",
  "timestamp": "2023-08-15T14:35:00Z",
  "data": {
    "paymentIntentId": "pi_abc123xyz",
    "orderId": "ORD-2023-12345",
    "amount": 150.00,
    "currency": "USD",
    "status": "PAID",
    "transactionId": "TRX-2023-89451"
  },
  "signature": "sha256_signature_here"
}`}
                />

                <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Verifying Webhooks</h3>
                <CodeBlock
                  id="verify-webhook"
                  language="javascript"
                  code={`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hash === signature;
}

// In your webhook endpoint
app.post('/webhooks/klevapay', (req, res) => {
  const signature = req.headers['x-klevapay-signature'];
  const isValid = verifyWebhook(req.body, signature, process.env.WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process the webhook
  console.log('Webhook event:', req.body.event);
  res.status(200).send('OK');
});`}
                />
              </section>

              {/* Error Handling */}
              <section id="error-handling" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Handling</h2>
                <p className="text-gray-700 mb-4">
                  KlevaPay uses standard HTTP response codes to indicate success or failure.
                </p>

                <h3 className="text-sm font-semibold text-gray-900 mb-2">Error Response Format</h3>
                <CodeBlock
                  id="error-response"
                  language="json"
                  code={`{
  "success": false,
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount must be greater than 0"
  }
}`}
                />

                <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Common Error Codes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Code</th>
                        <th className="px-4 py-2 text-left font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">INVALID_API_KEY</td>
                        <td className="px-4 py-2">The API key provided is invalid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">INVALID_AMOUNT</td>
                        <td className="px-4 py-2">The amount is invalid or out of range</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">PAYMENT_EXPIRED</td>
                        <td className="px-4 py-2">The payment intent has expired</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">INSUFFICIENT_FUNDS</td>
                        <td className="px-4 py-2">Customer has insufficient funds</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Testing */}
              <section id="testing" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Testing</h2>
                <p className="text-gray-700 mb-4">
                  Use test API keys to test your integration without making real transactions.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Test Public Key</p>
                    <code className="text-xs bg-white px-2 py-1 rounded block mt-1">
                      pk_test_51H9xxxxxxxxxxxxxxxxxxx
                    </code>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Test Secret Key</p>
                    <code className="text-xs bg-white px-2 py-1 rounded block mt-1">
                      sk_test_51H9xxxxxxxxxxxxxxxxxxx
                    </code>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-2 mt-4">Test Card Numbers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">Card Number</th>
                        <th className="px-4 py-2 text-left font-semibold">Scenario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">4242 4242 4242 4242</td>
                        <td className="px-4 py-2">Successful payment</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">4000 0000 0000 0002</td>
                        <td className="px-4 py-2">Card declined</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-mono text-xs">4000 0000 0000 9995</td>
                        <td className="px-4 py-2">Insufficient funds</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* SDKs */}
              <section id="sdks" className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">SDKs & Libraries</h2>
                <p className="text-gray-700 mb-4">
                  Official SDKs to integrate KlevaPay into your application.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Node.js</h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                      npm install klevapay-node
                    </code>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                      pip install klevapay
                    </code>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">PHP</h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                      composer require klevapay/klevapay-php
                    </code>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">React</h3>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                      npm install @klevapay/react
                    </code>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
