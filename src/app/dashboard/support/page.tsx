"use client"

import { DashboardSidebar } from "@/ui/modules/block/dashboard/sidebar"
import { DashboardTopbar } from "@/ui/modules/block/dashboard/topbar"
import { useState } from "react"
import { Button } from "@/ui/modules/components/button"
import { Input } from "@/ui/modules/components/input"
import { Search, Book, MessageCircle, Mail, HelpCircle, ChevronRight, Send } from "lucide-react"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  })

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Book,
      items: [
        {
          question: "How do I create my first payment link?",
          answer:
            "To create a payment link, go to your dashboard and click on 'Create Payment'. Fill in the amount, currency, and description, then share the generated link with your customer.",
        },
        {
          question: "What currencies does KlevaPay support?",
          answer: "KlevaPay supports NGN, USD, USDT, ETH, EUR, and GBP for payments and settlements.",
        },
        {
          question: "How long does it take to receive settlements?",
          answer:
            "Settlements are typically instant for crypto (USDT) and within 24 hours for fiat currencies (USD, NGN).",
        },
      ],
    },
    {
      title: "API Integration",
      icon: Book,
      items: [
        {
          question: "Where can I find my API keys?",
          answer:
            "Your API keys are available in Settings > API Keys. Make sure to keep your secret key secure and never share it publicly.",
        },
        {
          question: "How do I test my integration?",
          answer:
            "Use test API keys (starting with pk_test_ and sk_test_) to test your integration without processing real payments.",
        },
        {
          question: "How do I verify webhook signatures?",
          answer:
            "Use the webhook secret provided in your webhook settings to verify the signature using HMAC SHA256. Check our API documentation for code examples.",
        },
      ],
    },
    {
      title: "Payments & Settlements",
      icon: HelpCircle,
      items: [
        {
          question: "What are the transaction fees?",
          answer:
            "Card payments: 2.9% + $0.30, Crypto payments: 1.5%, Bank transfers: ₦50 flat fee.",
        },
        {
          question: "Can I refund a payment?",
          answer:
            "Yes, you can initiate refunds from the transaction details page. Refunds are processed within 5-10 business days.",
        },
        {
          question: "How do I change my settlement currency?",
          answer:
            "Go to Settings > Payout Preferences to change your preferred settlement currency (USD, USDT, or NGN).",
        },
      ],
    },
    {
      title: "Account & Security",
      icon: HelpCircle,
      items: [
        {
          question: "How do I enable two-factor authentication?",
          answer:
            "Go to Settings > Security and toggle on Two-Factor Authentication. You'll need an authenticator app like Google Authenticator or Authy.",
        },
        {
          question: "What should I do if my API key is compromised?",
          answer:
            "Immediately regenerate your API key from Settings > API Keys and update your integration with the new key.",
        },
        {
          question: "How do I update my business information?",
          answer:
            "You can update your business information in Settings > Profile. Some changes may require reverification.",
        },
      ],
    },
  ]

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit support ticket
    console.log("Support ticket submitted:", contactForm)
  }

  return (
    <div className="min-h-screen w-full flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col bg-[rgba(7,56,99,0.20)]">
        <DashboardTopbar />

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <section className="mb-6">
            <h1 className="text-[24px] font-semibold text-foreground">Support Center</h1>
            <p className="text-[13px] text-foreground/70">Get help with KlevaPay</p>
            <div className="mt-3 h-px bg-white/40" />
          </section>

          {/* Search Bar */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-border p-8">
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
                How can we help you?
              </h2>
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search for help articles, guides, and FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 text-base"
                />
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/dashboard/docs"
                className="bg-white rounded-xl shadow-sm border border-border p-6 hover:border-[#1E73FF] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#1E73FF]/10 rounded-lg group-hover:bg-[#1E73FF]/20">
                    <Book className="size-6 text-[#1E73FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">API Documentation</h3>
                    <p className="text-sm text-gray-600">Integration guides & references</p>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 ml-auto" />
                </div>
              </a>

              <button className="bg-white rounded-xl shadow-sm border border-border p-6 hover:border-[#1E73FF] transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200">
                    <MessageCircle className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Chat with our support team</p>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 ml-auto" />
                </div>
              </button>

              <a
                href="mailto:support@klevapay.com"
                className="bg-white rounded-xl shadow-sm border border-border p-6 hover:border-[#1E73FF] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <Mail className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">support@klevapay.com</p>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 ml-auto" />
                </div>
              </a>
            </div>
          </section>

          {/* FAQ Sections */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {faqCategories.map((category, catIdx) => (
                  <div key={catIdx}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <category.icon className="size-5 text-[#1E73FF]" />
                      {category.title}
                    </h3>
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <details
                          key={itemIdx}
                          className="border border-gray-200 rounded-lg p-4 cursor-pointer"
                        >
                          <summary className="font-medium text-gray-900 hover:text-[#1E73FF]">
                            {item.question}
                          </summary>
                          <p className="text-sm text-gray-600 mt-2">{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section>
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h2>
              <p className="text-gray-600 mb-6">
                Can&apos;t find what you&apos;re looking for? Submit a support ticket and we&apos;ll get back to
                you.
              </p>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Issue affecting workflow</option>
                    <option value="high">High - Critical issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    placeholder="Please provide as much detail as possible..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E73FF] focus:border-transparent"
                    required
                  />
                </div>

                <Button type="submit" className="bg-[#1E73FF] hover:bg-[#1E73FF]/90 text-white">
                  <Send className="size-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
